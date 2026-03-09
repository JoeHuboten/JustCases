import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { strictRateLimit } from '@/lib/rate-limit';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';
import crypto from 'crypto';

interface InternalHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  checks: {
    database: {
      status: 'up' | 'down';
      latencyMs?: number;
      error?: {
        name: string;
        code?: string | number;
      };
    };
    memory: {
      status: 'ok' | 'warning' | 'critical';
      usage: {
        heapUsedMb: number;
        heapTotalMb: number;
        externalMb: number;
        rssMb: number;
      };
    };
  };
}

const logger = createLogger('api:internal:health');

function getHealthSecret(): string | null {
  return process.env.HEALTHCHECK_SECRET || process.env.JOB_WORKER_SECRET || null;
}

function safeSecretCompare(expected: string, provided: string | null): boolean {
  if (!provided) return false;
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);
  if (expectedBuffer.length !== providedBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}

function isAuthorized(request: NextRequest): boolean {
  const secret = getHealthSecret();
  if (!secret) return false;
  return safeSecretCompare(secret, request.headers.get('x-health-secret'));
}

export async function GET(request: NextRequest) {
  const rateLimitResult = await strictRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  const secretConfigured = Boolean(getHealthSecret());
  if (!secretConfigured) {
    return NextResponse.json(
      { error: 'HEALTHCHECK_SECRET (or JOB_WORKER_SECRET) is not configured' },
      { status: 503 },
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const timestamp = new Date().toISOString();
  let dbStatus: InternalHealthStatus['checks']['database'] = { status: 'down' };

  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = {
      status: 'up',
      latencyMs: Date.now() - start,
    };
  } catch (error) {
    const safe = getSafeErrorDetails(error);
    dbStatus = {
      status: 'down',
      error: {
        name: safe.name,
        ...(safe.code !== undefined && { code: safe.code }),
      },
    };
  }

  const memory = process.memoryUsage();
  const heapUsedMb = Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100;
  const heapTotalMb = Math.round((memory.heapTotal / 1024 / 1024) * 100) / 100;
  const heapPercent = heapTotalMb > 0 ? (heapUsedMb / heapTotalMb) * 100 : 0;

  let memoryStatus: InternalHealthStatus['checks']['memory']['status'] = 'ok';
  if (heapPercent > 90) memoryStatus = 'critical';
  else if (heapPercent > 75) memoryStatus = 'warning';

  let overallStatus: InternalHealthStatus['status'] = 'healthy';
  if (dbStatus.status === 'down' || memoryStatus === 'critical') {
    overallStatus = 'unhealthy';
  } else if (memoryStatus === 'warning') {
    overallStatus = 'degraded';
  }

  const payload: InternalHealthStatus = {
    status: overallStatus,
    timestamp,
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: dbStatus,
      memory: {
        status: memoryStatus,
        usage: {
          heapUsedMb,
          heapTotalMb,
          externalMb: Math.round((memory.external / 1024 / 1024) * 100) / 100,
          rssMb: Math.round((memory.rss / 1024 / 1024) * 100) / 100,
        },
      },
    },
  };

  if (overallStatus !== 'healthy') {
    logger.warn('Internal health degraded', { status: overallStatus, checks: payload.checks });
  }

  const statusCode = overallStatus === 'unhealthy' ? 503 : 200;
  return NextResponse.json(payload, { status: statusCode });
}
