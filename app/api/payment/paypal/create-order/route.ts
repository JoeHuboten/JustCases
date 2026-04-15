import { NextResponse } from 'next/server';
import { withApiGuard } from '@/lib/api-guard';
import { strictRateLimit } from '@/lib/rate-limit';
import { checkoutPaymentCreateSchema } from '@/lib/validation';
import { CheckoutLineItem, getCheckoutSessionForUser } from '@/lib/checkout';

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
    bodySchema: checkoutPaymentCreateSchema,
  },
  async (_request, { user, body }) => {
    const session = await getCheckoutSessionForUser(user!.id, body!.checkoutSessionId);
    if (!session) {
      return NextResponse.json({ error: 'Checkout session not found' }, { status: 404 });
    }
    if (session.status !== 'PENDING') {
      return NextResponse.json({ error: 'Checkout session is not pending' }, { status: 400 });
    }
    if (session.expiresAt <= new Date()) {
      return NextResponse.json({ error: 'Checkout session expired' }, { status: 400 });
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
    const items = (session.items as unknown as CheckoutLineItem[]) || [];

    const orderResponse = await fetch(`${paypalConfig.apiBase}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            custom_id: session.id,
            amount: {
              currency_code: session.currency || 'EUR',
              value: session.total.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: session.currency || 'EUR',
                  value: session.subtotal.toFixed(2),
                },
                discount:
                  session.discount > 0
                    ? {
                        currency_code: session.currency || 'EUR',
                        value: session.discount.toFixed(2),
                      }
                    : undefined,
              },
            },
            items: items.map((item) => ({
              name: item.name,
              unit_amount: {
                currency_code: session.currency || 'EUR',
                value: item.unitPrice.toFixed(2),
              },
              quantity: item.quantity.toString(),
            })),
          },
        ],
        application_context: {
          brand_name: 'Just Cases',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success?checkoutSessionId=${session.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout`,
        },
      }),
      cache: 'no-store',
    });

    const orderData = await orderResponse.json();
    if (!orderResponse.ok || !orderData.id) {
      return NextResponse.json(
        { error: 'Failed to create PayPal order', message: orderData.message || 'Unknown error' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      providerPaymentId: orderData.id,
      checkoutSessionId: session.id,
      configured: true,
      approveUrl: (orderData.links as Array<{ rel: string; href: string }> | undefined)?.find((l) => l.rel === 'approve')?.href ?? null,
    });
  },
);
