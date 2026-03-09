import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rate-limit';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';

const logger = createLogger('api:health');

export async function GET(request: NextRequest) {
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  const timestamp = new Date().toISOString();

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      {
        status: 'healthy',
        timestamp,
        version: process.env.npm_package_version || '1.0.0',
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error('Public health check failed', { error: getSafeErrorDetails(error) });
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp,
      },
      { status: 503 },
    );
  }
}
