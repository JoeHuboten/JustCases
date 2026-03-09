import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { withApiGuard } from '@/lib/api-guard';
import { strictRateLimit } from '@/lib/rate-limit';
import { checkoutPaymentCreateSchema } from '@/lib/validation';
import { getCheckoutSessionForUser } from '@/lib/checkout';

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
    bodySchema: checkoutPaymentCreateSchema,
  },
  async (_request, { user, body }) => {
    if (!STRIPE_CONFIGURED || !stripe) {
      return NextResponse.json(
        {
          error: 'Payment system not configured',
          message: 'Stripe keys are missing or invalid. Please contact support.',
          configured: false,
        },
        { status: 503 },
      );
    }

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

    const amount = Math.round(session.total * 100);
    if (amount < 50) {
      return NextResponse.json(
        { error: 'Invalid amount', message: 'Minimum order amount is €0.50' },
        { status: 400 },
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: {
        userId: user!.id,
        checkoutSessionId: session.id,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      configured: true,
      checkoutSessionId: session.id,
    });
  },
);
