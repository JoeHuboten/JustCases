import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { z } from 'zod';
import { enqueueEmailJob } from '@/lib/email-jobs';
import { apiRateLimit } from '@/lib/rate-limit';
import { validateCsrf } from '@/lib/csrf';
import { verifyNewsletterUnsubscribeToken } from '@/lib/newsletter-token';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';

const newsletterSchema = z.object({
  email: z.string().email('Невалиден имейл адрес'),
});

const logger = createLogger('api:newsletter');

const GENERIC_SUBSCRIBE_RESPONSE = {
  success: true,
  message: 'If this email can receive updates, the subscription request has been processed.',
};

const GENERIC_UNSUBSCRIBE_RESPONSE = {
  success: true,
  message: 'If this request is valid, your unsubscription has been processed.',
};

async function processUnsubscribeToken(token: string | null): Promise<void> {
  if (!token) return;
  const verification = verifyNewsletterUnsubscribeToken(token);
  if (!verification.valid || !verification.email) return;

  await prisma.newsletterSubscription.updateMany({
    where: { email: verification.email, active: true },
    data: { active: false },
  });
}

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
    
    // Validate email
    const result = newsletterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const email = result.data.email.trim().toLowerCase();
    
    // Check if already subscribed
    const existingSubscription = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });
    
    if (existingSubscription) {
      if (!existingSubscription.active) {
        // Reactivate subscription
        await prisma.newsletterSubscription.update({
          where: { email },
          data: { active: true, subscribedAt: new Date() },
        });
        
        try {
          await enqueueEmailJob({
            type: 'NEWSLETTER_WELCOME',
            to: email,
            payload: { email, language: 'bg' },
          });
        } catch {
          // Subscription should succeed even if the queue is temporarily unavailable.
        }
      }
      return NextResponse.json(GENERIC_SUBSCRIBE_RESPONSE, { status: 200 });
    }
    
    // Create new subscription
    await prisma.newsletterSubscription.create({
      data: { email },
    });
    
    try {
      await enqueueEmailJob({
        type: 'NEWSLETTER_WELCOME',
        to: email,
        payload: { email, language: 'bg' },
      });
    } catch {
      // Subscription should succeed even if the queue is temporarily unavailable.
    }
    
    return NextResponse.json(GENERIC_SUBSCRIBE_RESPONSE, { status: 200 });
  } catch (error) {
    logger.error('Newsletter subscription failed', { error: getSafeErrorDetails(error) });
    return NextResponse.json(
      { error: 'Възникна грешка. Моля, опитайте отново.' },
      { status: 500 }
    );
  }
}

// Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    await processUnsubscribeToken(token);

    return NextResponse.json(GENERIC_UNSUBSCRIBE_RESPONSE, { status: 200 });
  } catch (error) {
    logger.error('Newsletter unsubscribe failed', { error: getSafeErrorDetails(error) });
    return NextResponse.json(
      { error: 'Възникна грешка. Моля, опитайте отново.' },
      { status: 500 }
    );
  }
}

// One-click unsubscribe support from email links.
export async function GET(request: NextRequest) {
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    await processUnsubscribeToken(token);

    return NextResponse.json(GENERIC_UNSUBSCRIBE_RESPONSE, { status: 200 });
  } catch (error) {
    logger.error('Newsletter one-click unsubscribe failed', { error: getSafeErrorDetails(error) });
    return NextResponse.json(
      { error: 'Възникна грешка. Моля, опитайте отново.' },
      { status: 500 },
    );
  }
}
