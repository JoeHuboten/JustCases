import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { strictRateLimit } from '@/lib/rate-limit';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { passwordSchema } from '@/lib/validation';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';

const logger = createLogger('api:auth:reset-password');

export async function POST(request: NextRequest) {
  // Strict rate limiting
  const rateLimitResult = await strictRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with uppercase, lowercase, and number' },
        { status: 400 }
      );
    }

    // Hash the token to match stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find valid token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: hashedToken,
        type: 'PASSWORD_RESET',
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date() > verificationToken.expires) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token: hashedToken },
      });
      return NextResponse.json(
        { error: 'Reset token has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        tokenVersion: { increment: 1 },
      },
    });

    // Delete used token
    await prisma.verificationToken.delete({
      where: { token: hashedToken },
    });

    // Delete all other tokens for this user (invalidate all password reset requests)
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: user.email!,
        type: 'PASSWORD_RESET',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    logger.error('Password reset failed', { error: getSafeErrorDetails(error) });
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
