import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rate-limit';
import { validateCsrf } from '@/lib/csrf';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';

const logger = createLogger('api:discount:validate');

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // CSRF protection
  const csrfResult = validateCsrf(request);
  if (!csrfResult.valid) {
    return NextResponse.json(
      { error: csrfResult.error || 'Invalid request' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Discount code is required' },
        { status: 400 }
      );
    }

    // Find the discount code
    const discountCode = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!discountCode) {
      return NextResponse.json(
        { error: 'Invalid discount code' },
        { status: 404 }
      );
    }

    // Check if code is active
    if (!discountCode.active) {
      return NextResponse.json(
        { error: 'This discount code is not active' },
        { status: 400 }
      );
    }

    // Check if code has expired
    if (discountCode.expiresAt && new Date(discountCode.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'This discount code has expired' },
        { status: 400 }
      );
    }

    // Check if code has reached max uses
    if (discountCode.maxUses && discountCode.currentUses >= discountCode.maxUses) {
      return NextResponse.json(
        { error: 'This discount code has reached its usage limit' },
        { status: 400 }
      );
    }

    // Return valid discount code
    return NextResponse.json({
      success: true,
      code: discountCode.code,
      percentage: discountCode.percentage,
      message: `${discountCode.percentage}% discount applied!`,
    });
  } catch (error) {
    logger.error('Error validating discount code', { error: getSafeErrorDetails(error) });
    return NextResponse.json(
      { error: 'Failed to validate discount code' },
      { status: 500 }
    );
  }
}
