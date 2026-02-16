import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { strictRateLimit } from '@/lib/rate-limit';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

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

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Return error if user not found
    if (!user) {
      if (process.env.NODE_ENV !== 'production') {
        // Password reset requested for non-existent email
      }
      return NextResponse.json(
        { error: 'No account found with this email address.' },
        { status: 404 }
      );
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
      },
    });

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email!, {
        name: user.name || 'User',
        resetToken,
        language: 'bg',
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Delete the token if email fails
      await prisma.verificationToken.deleteMany({
        where: {
          identifier: user.email!,
          token: hashedToken,
        },
      });
      return NextResponse.json(
        { error: 'Failed to send password reset email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}
