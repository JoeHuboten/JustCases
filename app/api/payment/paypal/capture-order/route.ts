import { NextResponse } from 'next/server';
import { withApiGuard } from '@/lib/api-guard';
import { strictRateLimit } from '@/lib/rate-limit';
import { checkoutPaymentCaptureSchema } from '@/lib/validation';
import { finalizeCheckoutSession } from '@/lib/checkout';
import { prisma } from '@/lib/prisma';
import { enqueueEmailJob } from '@/lib/email-jobs';

function getPaypalConfig() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const apiBase =
    process.env.PAYPAL_MODE === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

  if (
    !clientId ||
    !clientSecret ||
    clientId === 'your_paypal_client_id' ||
    clientSecret === 'your_paypal_client_secret'
  ) {
    return null;
  }

  return { clientId, clientSecret, apiBase };
}

async function getPaypalAccessToken(config: { clientId: string; clientSecret: string; apiBase: string }) {
  const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
  const tokenResponse = await fetch(`${config.apiBase}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });
  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenData.access_token) {
    throw new Error(tokenData.message || 'Failed to get PayPal access token');
  }
  return tokenData.access_token as string;
}

export const POST = withApiGuard(
  {
    requireAuth: true,
    requireVerifiedEmail: true,
    csrf: true,
    rateLimit: strictRateLimit,
    bodySchema: checkoutPaymentCaptureSchema,
  },
  async (_request, { user, body }) => {
    const existingOrder = await prisma.order.findFirst({
      where: {
        checkoutSessionId: body!.checkoutSessionId,
        userId: user!.id,
      },
      select: { id: true },
    });
    if (existingOrder) {
      return NextResponse.json({
        success: true,
        orderId: existingOrder.id,
        idempotent: true,
      });
    }

    const paypalConfig = getPaypalConfig();
    if (!paypalConfig) {
      return NextResponse.json(
        {
          error: 'Payment system not configured',
          message: 'PayPal credentials are not configured.',
          configured: false,
        },
        { status: 503 },
      );
    }

    const accessToken = await getPaypalAccessToken(paypalConfig);
    const captureResponse = await fetch(
      `${paypalConfig.apiBase}/v2/checkout/orders/${body!.providerPaymentId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      },
    );
    const captureData = await captureResponse.json();
    if (!captureResponse.ok || captureData.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment capture failed', message: captureData.message || 'Payment was not completed' },
        { status: 400 },
      );
    }

    const customId = captureData?.purchase_units?.[0]?.custom_id;
    if (customId !== body!.checkoutSessionId) {
      return NextResponse.json({ error: 'Checkout session mismatch' }, { status: 400 });
    }

    const captureId =
      captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.id ||
      captureData?.id ||
      body!.providerPaymentId;

    const finalized = await finalizeCheckoutSession({
      userId: user!.id,
      checkoutSessionId: body!.checkoutSessionId,
      provider: 'PAYPAL',
      providerPaymentId: String(captureId),
      statusNote: 'Payment completed via PayPal. Order is being processed.',
    });

    const order = await prisma.order.findUnique({
      where: { id: finalized.orderId },
      include: {
        items: { include: { product: true } },
        user: true,
      },
    });
    if (order?.user.email) {
      try {
        await enqueueEmailJob({
          type: 'ORDER_CONFIRMATION',
          to: order.user.email,
          payload: {
            orderId: order.id,
            customerName: order.user.name || 'Customer',
            total: order.total,
            items: order.items.map((item) => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.price,
            })),
            trackingNumber: order.trackingNumber || undefined,
            language: 'bg',
          },
        });
      } catch {
        // Email dispatch must not block checkout completion.
      }
    }

    return NextResponse.json({
      success: true,
      orderId: finalized.orderId,
      providerPaymentId: String(captureId),
      idempotent: finalized.idempotent,
    });
  },
);
