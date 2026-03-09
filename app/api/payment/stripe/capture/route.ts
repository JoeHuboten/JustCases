import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { withApiGuard } from '@/lib/api-guard';
import { strictRateLimit } from '@/lib/rate-limit';
import { checkoutPaymentCaptureSchema } from '@/lib/validation';
import { finalizeCheckoutSession } from '@/lib/checkout';
import { prisma } from '@/lib/prisma';
import { enqueueEmailJob } from '@/lib/email-jobs';

const STRIPE_CONFIGURED = Boolean(
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_SECRET_KEY !== 'sk_test_...' &&
  process.env.STRIPE_SECRET_KEY.startsWith('sk_'),
);

const stripe = STRIPE_CONFIGURED
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-12-15.clover' as const,
    })
  : null;

export const POST = withApiGuard(
  {
    requireAuth: true,
    requireVerifiedEmail: true,
    csrf: true,
    rateLimit: strictRateLimit,
    bodySchema: checkoutPaymentCaptureSchema,
  },
  async (_request, { user, body }) => {
    if (!STRIPE_CONFIGURED || !stripe) {
      return NextResponse.json(
        { error: 'Payment system not configured', message: 'Stripe is not configured' },
        { status: 503 },
      );
    }

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

    const paymentIntent = await stripe.paymentIntents.retrieve(body!.providerPaymentId);
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment not completed', message: `Payment status: ${paymentIntent.status}` },
        { status: 400 },
      );
    }

    if (paymentIntent.metadata.userId !== user!.id) {
      return NextResponse.json({ error: 'Invalid payment metadata' }, { status: 403 });
    }

    if (paymentIntent.metadata.checkoutSessionId !== body!.checkoutSessionId) {
      return NextResponse.json({ error: 'Checkout session mismatch' }, { status: 400 });
    }

    const finalized = await finalizeCheckoutSession({
      userId: user!.id,
      checkoutSessionId: body!.checkoutSessionId,
      provider: 'CARD',
      providerPaymentId: paymentIntent.id,
      statusNote: 'Payment completed via Stripe. Order is being processed.',
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
      idempotent: finalized.idempotent,
    });
  },
);
