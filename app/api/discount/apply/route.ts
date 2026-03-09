import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rate-limit';
import { validateCsrf } from '@/lib/csrf';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';

const logger = createLogger('api:discount:apply');

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

    // Find and validate the discount code
    const discountCode = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!discountCode) {
      return NextResponse.json(
        { error: 'Invalid discount code' },
        { status: 404 }
      );
    }

    if (!discountCode.active) {
      return NextResponse.json(
        { error: 'This discount code is not active' },
        { status: 400 }
      );
    }

    if (discountCode.expiresAt && new Date(discountCode.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'This discount code has expired' },
        { status: 400 }
      );
    }

    if (discountCode.maxUses && discountCode.currentUses >= discountCode.maxUses) {
      return NextResponse.json(
        { error: 'This discount code has reached its usage limit' },
        { status: 400 }
      );
    }

    // Increment the usage count
    const updatedCode = await prisma.discountCode.update({
      where: { id: discountCode.id },
      data: {
        currentUses: discountCode.currentUses + 1,
      },
    });

    return NextResponse.json({
      success: true,
      code: updatedCode.code,
      percentage: updatedCode.percentage,
      message: `${updatedCode.percentage}% discount applied successfully!`,
    });
  } catch (error) {
    logger.error('Error applying discount code', { error: getSafeErrorDetails(error) });
    return NextResponse.json(
      { error: 'Failed to apply discount code' },
      { status: 500 }
    );
  }
}
