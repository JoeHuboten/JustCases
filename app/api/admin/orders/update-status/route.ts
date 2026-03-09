import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { withApiGuard } from '@/lib/api-guard';
import { adminOrderStatusUpdateSchema } from '@/lib/validation';
import { sendOrderStatusUpdateEmail } from '@/lib/email';
import { apiRateLimit, strictRateLimit } from '@/lib/rate-limit';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';
import { z } from 'zod';

const logger = createLogger('api:admin:orders:update-status');

export const POST = withApiGuard<z.infer<typeof adminOrderStatusUpdateSchema>>(
  {
    requireAdmin: true,
    csrf: true,
    rateLimit: strictRateLimit,
    bodySchema: adminOrderStatusUpdateSchema,
  },
  async (_request: NextRequest, context) => {
    try {
      const body = context.body!;
      const user = context.user!;
      const { orderId, status, notes, trackingNumber, courierService, estimatedDelivery } = body;

      const updateData: Record<string, unknown> = {
        status,
        updatedAt: new Date(),
      };

      if (trackingNumber !== undefined) {
        updateData.trackingNumber = trackingNumber;
      }
      if (courierService !== undefined) {
        updateData.courierService = courierService;
      }
      if (estimatedDelivery !== undefined) {
        updateData.estimatedDelivery = estimatedDelivery ? new Date(estimatedDelivery) : null;
      }

      if (status === 'DELIVERED') {
        updateData.actualDelivery = new Date();
      }

      if (status === 'CANCELLED') {
        updateData.cancelledAt = new Date();
        if (notes) {
          updateData.cancelReason = notes;
        }
      }

      const order = await prisma.order.update({
        where: { id: orderId },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      await prisma.orderStatusHistory.create({
        data: {
          orderId,
          status,
          notes: notes || null,
          createdBy: user.id,
        },
      });

      try {
        if (order.user.email) {
          await sendOrderStatusUpdateEmail(order.user.email, {
            orderId: order.id,
            customerName: order.user.name || 'Customer',
            status,
            trackingNumber: order.trackingNumber || undefined,
            courierService: order.courierService || undefined,
            estimatedDelivery: order.estimatedDelivery?.toISOString(),
            language: 'bg',
          });
        }
      } catch (emailError) {
        logger.warn('Failed to send status update email', { error: getSafeErrorDetails(emailError) });
      }

      return NextResponse.json({
        success: true,
        order,
        message: `Order status updated to ${status}`,
      });
    } catch (error) {
      logger.error('Failed to update order status', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 },
      );
    }
  },
);

export const GET = withApiGuard(
  {
    requireAdmin: true,
    rateLimit: apiRateLimit,
  },
  async (request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const orderId = searchParams.get('orderId');

      if (!orderId) {
        return NextResponse.json(
          { error: 'Order ID required' },
          { status: 400 },
        );
      }

      const statusHistory = await prisma.orderStatusHistory.findMany({
        where: { orderId },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ statusHistory });
    } catch (error) {
      logger.error('Failed to fetch status history', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to fetch status history' },
        { status: 500 },
      );
    }
  },
);
