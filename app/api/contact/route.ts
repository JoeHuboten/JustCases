import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiRateLimit, strictRateLimit } from '@/lib/rate-limit';
import { contactFormSchema, sanitizeInput } from '@/lib/validation';
import { validateCsrf } from '@/lib/csrf';
import { createLogger, getRequestId, getSafeErrorDetails } from '@/lib/logger';
import { withApiGuard } from '@/lib/api-guard';

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request.headers);
  const logger = createLogger('api:contact').withRequestId(requestId);
  const startTime = Date.now();
  
  logger.debug('POST /api/contact');

  // CSRF protection
  const csrfResult = validateCsrf(request);
  if (!csrfResult.valid) {
    logger.warn('CSRF validation failed');
    return NextResponse.json(
      { error: 'Invalid request. Please refresh and try again.', requestId },
      { status: 403, headers: { 'x-request-id': requestId } }
    );
  }

  // Rate limiting - strict for contact forms
  const rateLimitResult = await strictRateLimit(request);
  if (!rateLimitResult.success) {
    logger.warn('Rate limit exceeded');
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.', requestId },
      { status: 429, headers: { 'x-request-id': requestId } }
    );
  }

  try {
    const body = await request.json();

    // Validate with Zod schema
    const validationResult = contactFormSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(e => e.message).join(', ');
      logger.warn('Validation failed', { errors });
      return NextResponse.json(
        { error: errors, requestId },
        { status: 400, headers: { 'x-request-id': requestId } }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    // Sanitize inputs to prevent XSS
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
    };

    // Save contact message to database
    const contactMessage = await prisma.contactMessage.create({
      data: sanitizedData,
    });

    const duration = Date.now() - startTime;
    logger.info('Contact message saved', { messageId: contactMessage.id, duration: `${duration}ms` });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
        id: contactMessage.id,
        requestId,
      },
      { status: 201, headers: { 'x-request-id': requestId } }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Error submitting contact form', { error: getSafeErrorDetails(error), duration: `${duration}ms` });
    return NextResponse.json(
      { error: 'Failed to submit message. Please try again.', requestId },
      { status: 500, headers: { 'x-request-id': requestId } }
    );
  }
}

// GET endpoint to retrieve contact messages (admin only)
export const GET = withApiGuard(
  {
    requireAdmin: true,
    rateLimit: apiRateLimit,
  },
  async () => {
    try {
      const messages = await prisma.contactMessage.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json(messages);
    } catch (error) {
      const logger = createLogger('api:contact:admin-list');
      logger.error('Error fetching contact messages', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 },
      );
    }
  },
);
