import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rate-limit';
import { createLogger, getRequestId, getSafeErrorDetails } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request.headers);
  const logger = createLogger('api:orders').withRequestId(requestId);
  const startTime = Date.now();
  
  logger.debug('GET /api/orders');

  // Rate limiting
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    logger.warn('Rate limit exceeded');
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.', requestId },
      { status: 429, headers: { 'x-request-id': requestId } }
    );
  }

  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      logger.warn('Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized', requestId }, 
        { status: 401, headers: { 'x-request-id': requestId } }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
    const skip = (page - 1) * limit;

    logger.debug('Fetching orders', { page, limit });

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          total: true,
          subtotal: true,
          deliveryFee: true,
          discount: true,
          status: true,
          trackingNumber: true,
          courierService: true,
          estimatedDelivery: true,
          createdAt: true,
          items: {
            select: {
              id: true,
              quantity: true,
              price: true,
              color: true,
              size: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  slug: true,
                  category: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { userId: user.id } }),
    ]);

    const duration = Date.now() - startTime;
    logger.info(`Found ${orders.length} orders`, { page, total, duration: `${duration}ms` });

    return NextResponse.json(
      {
        items: orders,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      { headers: { 'x-request-id': requestId } },
    );
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    logger.error('Error fetching orders', { error: getSafeErrorDetails(error), duration: `${duration}ms` });
    return NextResponse.json(
      { error: 'Failed to fetch orders', requestId },
      { status: 500, headers: { 'x-request-id': requestId } }
    );
  }
}
