import { NextResponse } from 'next/server';

/**
 * Backward-compatible endpoint.
 * New clients should call /api/payment/stripe/create-intent.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'Deprecated endpoint',
      message: 'Use /api/payment/stripe/create-intent with checkoutSessionId.',
    },
    { status: 410 },
  );
}
