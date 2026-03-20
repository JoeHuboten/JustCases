import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiGuard } from '@/lib/api-guard';
import { strictRateLimit } from '@/lib/rate-limit';
import { adminOrderUpdateSchema } from '@/lib/validation';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';
import { z } from 'zod';
import { writeAuditLog } from '@/lib/audit-log';

const logger = createLogger('api:admin:orders:id');

// PUT - Update order status
export const PUT = withApiGuard<z.infer<typeof adminOrderUpdateSchema>, { params: Promise<{ id: string }> }>(
  {
    requireAdmin: true,
    csrf: true,
    rateLimit: strictRateLimit,
    bodySchema: adminOrderUpdateSchema,
  },
  async (request: NextRequest, context) => {
    try {
      const { id } = await context.params;
      const body = context.body!;

      const order = await prisma.order.update({
        where: { id },
        data: {
          ...(body.status !== undefined && { status: body.status }),
          ...(body.trackingNumber !== undefined && { trackingNumber: body.trackingNumber }),
          ...(body.notes !== undefined && { notes: body.notes }),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

      await writeAuditLog({
        action: 'order.update_status',
        actor: { id: context.user!.id, email: context.user!.email!, role: context.user!.role },
        request,
        targetType: 'order',
        targetId: id,
        metadata: {
          status: body.status,
          trackingNumber: body.trackingNumber,
        },
      });

      return NextResponse.json({ order });
    } catch (error) {
      logger.error('Failed to update order', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 },
      );
    }
  },
);

// DELETE - Delete order
export const DELETE = withApiGuard<unknown, { params: Promise<{ id: string }> }>(
  {
    requireAdmin: true,
    csrf: true,
    rateLimit: strictRateLimit,
  },
  async (request: NextRequest, context) => {
    try {
      const { id } = await context.params;
      await prisma.order.delete({
        where: { id },
      });

      await writeAuditLog({
        action: 'order.delete',
        actor: { id: context.user!.id, email: context.user!.email!, role: context.user!.role },
        request,
        targetType: 'order',
        targetId: id,
      });

      return NextResponse.json({ message: 'Order deleted successfully' });
    } catch (error) {
      logger.error('Failed to delete order', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to delete order' },
        { status: 500 },
      );
    }
  },
);
