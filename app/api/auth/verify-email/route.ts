import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { enqueueEmailJob } from '@/lib/email-jobs';
import { createLogger, getRequestId, getSafeErrorDetails } from '@/lib/logger';
import crypto from 'crypto';
import { strictRateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request.headers);
  const logger = createLogger('api:auth:verify-email').withRequestId(requestId);
  
  try {
    const rateLimitResult = await strictRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.', requestId },
        { status: 429, headers: { 'x-request-id': requestId } },
      );
    }

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required', requestId },
        { status: 400, headers: { 'x-request-id': requestId } }
      );
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: hashedToken,
        type: 'EMAIL_VERIFICATION',
      },
    });

    if (!verificationToken) {
      logger.warn('Invalid verification token');
      return NextResponse.json(
        { error: 'Invalid or expired verification link', requestId },
        { status: 400, headers: { 'x-request-id': requestId } }
      );
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      logger.warn('Expired verification token');
      
      // Delete expired token
      await prisma.verificationToken.delete({ where: { token: hashedToken } });

      return NextResponse.json(
        { error: 'Verification link has expired. Please request a new one.', requestId },
        { status: 400, headers: { 'x-request-id': requestId } }
      );
    }

    // Check if token is for email verification
    if (verificationToken.type !== 'EMAIL_VERIFICATION') {
      return NextResponse.json(
        { error: 'Invalid verification token type', requestId },
        { status: 400, headers: { 'x-request-id': requestId } }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      logger.warn('User not found for verification token');
      return NextResponse.json(
        { error: 'User not found', requestId },
        { status: 404, headers: { 'x-request-id': requestId } }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      logger.info('Email already verified', { userId: user.id });
      
      // Delete token
      await prisma.verificationToken.delete({ where: { token: hashedToken } });

      return NextResponse.json(
        { 
          success: true, 
          message: 'Email already verified. You can now sign in.',
          alreadyVerified: true,
          requestId 
        },
        { headers: { 'x-request-id': requestId } }
      );
    }

    // Update user emailVerified
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    // Delete verification token
    await prisma.verificationToken.delete({ where: { token: hashedToken } });

    try {
      await enqueueEmailJob({
        type: 'EMAIL_VERIFICATION_SUCCESS',
        to: user.email!,
        payload: {
          name: user.name || 'there',
        },
      });
    } catch {
      logger.warn('Failed to queue verification success email', { userId: user.id });
    }

    logger.info('Email verified successfully', { userId: user.id });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now sign in and make purchases.',
      requestId,
    }, { headers: { 'x-request-id': requestId } });
  } catch (error) {
    logger.error('Email verification error', { error: getSafeErrorDetails(error) });
    return NextResponse.json(
      { error: 'Verification failed. Please try again.', requestId },
      { status: 500, headers: { 'x-request-id': requestId } }
    );
  }
}
