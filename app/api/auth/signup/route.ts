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
      // TEMP: email verification disabled — auto-verify existing unverified accounts
      if (!existingUser.emailVerified) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { emailVerified: new Date() },
        });
      }

      return NextResponse.json(
        {
          success: true,
          message: genericSignupMessage,
          requiresVerification: false,
          requestId,
        },
        { status: 200, headers: { 'x-request-id': requestId } },
      );
    }

    const hashedPassword = await hashPassword(password);

    // TEMP: auto-verify users on signup (email verification disabled)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: 'USER',
        emailVerified: new Date(), // TEMP: auto-verified
      },
    });

    logger.info('User registered successfully (auto-verified)', { userId: user.id });

    return NextResponse.json({
      success: true,
      message: genericSignupMessage,
      requiresVerification: false,
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
