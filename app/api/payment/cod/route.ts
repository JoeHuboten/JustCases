import { NextResponse } from 'next/server';
import { withApiGuard } from '@/lib/api-guard';
import { strictRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';
import { finalizeCodOrder } from '@/lib/checkout';

const codOrderSchema = z.object({
  checkoutSessionId: z.string().cuid('Invalid checkout session ID'),
  courierService: z.enum(['SPEEDY', 'ECONT'], { message: 'Courier service is required' }),
});

export const POST = withApiGuard(
  {
    requireAuth: true,
    requireVerifiedEmail: true,
    csrf: true,
    rateLimit: strictRateLimit,
    bodySchema: codOrderSchema,
  },
  async (_request, { user, body }) => {
    const result = await finalizeCodOrder({
      userId: user!.id,
      checkoutSessionId: body!.checkoutSessionId,
      courierService: body!.courierService,
    });
    return NextResponse.json({ orderId: result.orderId }, { status: 201 });
  },
);
