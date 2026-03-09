import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiGuard } from '@/lib/api-guard';
import { apiRateLimit } from '@/lib/rate-limit';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';

// GET - Fetch all users
const logger = createLogger('api:admin:users');

export const GET = withApiGuard(
  {
    requireAdmin: true,
    rateLimit: apiRateLimit,
  },
  async (_request: NextRequest) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phone: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              cartItems: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json({ users });
    } catch (error) {
      logger.error('Failed to fetch users', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 },
      );
    }
  },
);
