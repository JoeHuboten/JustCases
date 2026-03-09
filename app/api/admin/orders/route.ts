import { NextRequest, NextResponse } from 'next/server';
import { prisma, getPaginationParams } from '@/lib/prisma';
import { withApiGuard } from '@/lib/api-guard';
import { apiRateLimit } from '@/lib/rate-limit';
import { Prisma } from '@prisma/client';
import { createLogger, getRequestId, getSafeErrorDetails } from '@/lib/logger';

// GET - Fetch orders with pagination
export const GET = withApiGuard(
  {
    requireAdmin: true,
    rateLimit: apiRateLimit,
  },
  async (request: NextRequest) => {
  const requestId = getRequestId(request.headers);
  const logger = createLogger('api:admin:orders').withRequestId(requestId);
  const startTime = Date.now();

  logger.debug('GET /api/admin/orders', {
    query: {
      page: request.nextUrl.searchParams.get('page') || '1',
      limit: request.nextUrl.searchParams.get('limit') || '20',
      status: request.nextUrl.searchParams.get('status') || null,
      hasSearch: Boolean(request.nextUrl.searchParams.get('search')?.trim()),
    },
  });

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const search = searchParams.get('search')?.trim();
    const status = searchParams.get('status');
    
    const { take, skip } = getPaginationParams(page, limit);
    
    // Build where clause
    const where: Prisma.OrderWhereInput = {};
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { trackingNumber: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    
    if (status && status !== 'ALL') {
      where.status = status as import('@prisma/client').OrderStatus;
    }
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
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
          statusHistory: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take,
        skip,
      }),
      prisma.order.count({ where }),
    ]);

    const duration = Date.now() - startTime;
    logger.info(`Found ${orders.length} orders`, { total, page, duration: `${duration}ms` });

    return NextResponse.json({ 
      orders,
      total,
      page,
      limit: take,
      totalPages: Math.ceil(total / take),
      requestId,
    }, { headers: { 'x-request-id': requestId } });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Error fetching orders', { error: getSafeErrorDetails(error), duration: `${duration}ms` });
    return NextResponse.json(
      { error: 'Failed to fetch orders', requestId },
      { status: 500, headers: { 'x-request-id': requestId } }
    );
  }
  },
);
