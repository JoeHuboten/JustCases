import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiGuard } from '@/lib/api-guard';
import { apiRateLimit } from '@/lib/rate-limit';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';

const logger = createLogger('api:admin:newsletter:subscribers');

export const GET = withApiGuard(
  {
    requireAdmin: true,
    rateLimit: apiRateLimit,
  },
  async (_req: NextRequest) => {
    try {
      const subscribers = await prisma.newsletterSubscription.findMany({
        orderBy: { subscribedAt: 'desc' },
      });

      return NextResponse.json({ subscribers });
    } catch (error) {
      logger.error('Failed to fetch subscribers', { error: getSafeErrorDetails(error) });
      return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }
  },
);
