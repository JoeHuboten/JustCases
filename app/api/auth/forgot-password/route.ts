import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { strictRateLimit } from '@/lib/rate-limit';
import { enqueueEmailJob } from '@/lib/email-jobs';
import crypto from 'crypto';
import { emailSchema } from '@/lib/validation';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';

const logger = createLogger('api:auth:forgot-password');

export async function POST(request: NextRequest) {
  // Strict rate limiting for password reset requests
  const rateLimitResult = await strictRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Enumeration-safe response for unknown accounts.
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store token in database
    await prisma.verificationToken.create({
      data: {
        identifier: user.email!,
        token: hashedToken,
        expires,
        type: 'PASSWORD_RESET',
      },
    });

    // Queue password reset email
    try {
      await enqueueEmailJob({
        type: 'PASSWORD_RESET',
        to: user.email!,
        payload: {
          name: user.name || 'User',
          resetToken,
          language: 'bg',
        },
      });
    } catch {
      // Delete the token if email fails
      await prisma.verificationToken.deleteMany({
        where: {
          identifier: user.email!,
          token: hashedToken,
          type: 'PASSWORD_RESET',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.',
    });
  } catch (error) {
    logger.error('Password reset request failed', { error: getSafeErrorDetails(error) });
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}
