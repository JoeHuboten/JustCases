import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { getUserFromRequest } from '@/lib/auth-utils';
import { apiRateLimit } from '@/lib/rate-limit';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';

const logger = createLogger('api:orders:track');

export async function GET(request: NextRequest) {
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const trackingNumber = searchParams.get('trackingNumber');

    let order;

    if (orderId) {
      order = await prisma.order.findFirst({
        where: {
          id: orderId,
          userId: user.id,
        },
        include: {
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
          shippingAddress: true,
          statusHistory: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
    } else if (trackingNumber) {
      order = await prisma.order.findFirst({
        where: {
          trackingNumber: trackingNumber,
          userId: user.id,
        },
        include: {
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
          shippingAddress: true,
          statusHistory: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Order ID or tracking number required' },
        { status: 400 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    logger.error('Order tracking error', { error: getSafeErrorDetails(error) });
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
