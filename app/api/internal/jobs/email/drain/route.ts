import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  getEmailQueueStats,
  isEmailQueueRedisBacked,
  processEmailJobs,
} from '@/lib/email-jobs';
import { strictRateLimit } from '@/lib/rate-limit';

function safeSecretCompare(expected: string, provided: string | null): boolean {
  if (!provided) return false;
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);
  if (expectedBuffer.length !== providedBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.JOB_WORKER_SECRET;
  if (!secret) return false;
  const headerSecret = request.headers.get('x-worker-secret');
  return safeSecretCompare(secret, headerSecret);
}

function isWorkerSecretConfigured(): boolean {
  return Boolean(process.env.JOB_WORKER_SECRET);
}

export async function GET(request: NextRequest) {
  if (!isWorkerSecretConfigured()) {
    return NextResponse.json({ error: 'JOB_WORKER_SECRET is not configured' }, { status: 503 });
  }

  const rateLimitResult = await strictRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stats = await getEmailQueueStats();
  return NextResponse.json({
    redisBacked: isEmailQueueRedisBacked(),
    ...stats,
  });
}

export async function POST(request: NextRequest) {
  if (!isWorkerSecretConfigured()) {
    return NextResponse.json({ error: 'JOB_WORKER_SECRET is not configured' }, { status: 503 });
  }

  const rateLimitResult = await strictRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let limit = 25;
  try {
    const rawBody = await request.json();
    const parsedLimit = Number(rawBody?.limit);
    if (Number.isFinite(parsedLimit) && parsedLimit > 0) {
      limit = Math.min(100, Math.floor(parsedLimit));
    }
  } catch {
    // Body is optional.
  }

  const summary = await processEmailJobs({ limit });
  return NextResponse.json({
    redisBacked: isEmailQueueRedisBacked(),
    ...summary,
  });
}
