import { NextRequest, NextResponse } from 'next/server';
import { strictRateLimit } from '@/lib/rate-limit';
import { withApiGuard } from '@/lib/api-guard';
import { createCheckoutSession } from '@/lib/checkout';
import { checkoutSessionSchema } from '@/lib/validation';

export const POST = withApiGuard(
  {
    requireAuth: true,
    requireVerifiedEmail: true,
    csrf: true,
    rateLimit: strictRateLimit,
    bodySchema: checkoutSessionSchema,
  },
  async (_request: NextRequest, { user, body }) => {
    const session = await createCheckoutSession(user!.id, {
      items: body!.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        color: item.color ?? null,
        size: item.size ?? null,
      })),
      discountCode: body!.discountCode ?? null,
      shippingAddress: body!.shippingAddress ?? null,
    });
    return NextResponse.json(session, { status: 201 });
  },
);
