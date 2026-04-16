import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { hashPassword } from '@/lib/auth-utils';
import { authRateLimit } from '@/lib/rate-limit';
import { emailSchema, passwordSchema } from '@/lib/validation';
import { enqueueEmailJob } from '@/lib/email-jobs';
import { createLogger, getRequestId, getSafeErrorDetails } from '@/lib/logger';
import crypto from 'crypto';
import { validateCsrf } from '@/lib/csrf';

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request.headers);
  const logger = createLogger('api:auth:signup').withRequestId(requestId);
  const genericSignupMessage =
    'If the account can be registered, check your email for verification instructions.';
  
  // Rate limiting - 5 attempts per 15 minutes
  const rateLimitResult = await authRateLimit(request);
  if (!rateLimitResult.success) {
    logger.warn('Rate limit exceeded');
    return NextResponse.json(
      { error: 'Too many signup attempts. Please try again later.', requestId },
      { status: 429, headers: { 'x-request-id': requestId } }
    );
  }

  const csrfResult = validateCsrf(request);
  if (!csrfResult.valid) {
    return NextResponse.json(
      { error: csrfResult.error || 'Invalid request', requestId },
      { status: 403, headers: { 'x-request-id': requestId } }
    );
  }

  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required', requestId },
        { status: 400, headers: { 'x-request-id': requestId } }
      );
    }

    // Validate email
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      return NextResponse.json(
        { error: 'Invalid email format', requestId },
        { status: 400, headers: { 'x-request-id': requestId } }
      );
    }

    // Validate password strength
    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with uppercase, lowercase, and number', requestId },
        { status: 400, headers: { 'x-request-id': requestId } }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Don't reveal that user exists - return same generic message
      return NextResponse.json(
        {
          success: true,
          message: genericSignupMessage,
          requiresVerification: true,
          requestId,
        },
        { status: 200, headers: { 'x-request-id': requestId } },
      );
    }

    const hashedPassword = await hashPassword(password);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: 'USER',
        emailVerified: null,
      },
    });

    // Create verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: tokenExpiry,
        type: 'EMAIL_VERIFICATION',
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`;

    // Send verification email
    await enqueueEmailJob({
      type: 'EMAIL_VERIFICATION',
      to: email,
      payload: {
        name: name || email.split('@')[0],
        verificationUrl,
      },
    });

    logger.info('User registered, verification email sent', { userId: user.id });

    return NextResponse.json({
      success: true,
      message: genericSignupMessage,
      requiresVerification: true,
      requestId,
    }, { headers: { 'x-request-id': requestId } });
  } catch (error) {
    logger.error('Sign up error', { error: getSafeErrorDetails(error) });
    return NextResponse.json(
      { error: 'Registration failed. Please try again.', requestId },
      { status: 500, headers: { 'x-request-id': requestId } }
    );
  }
}
