import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withApiGuard } from '@/lib/api-guard';
import { strictRateLimit } from '@/lib/rate-limit';
import { enqueueEmailJobs } from '@/lib/email-jobs';
import { createNewsletterUnsubscribeToken } from '@/lib/newsletter-token';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const newsletterSendSchema = z.object({
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
  type: z.enum(['custom', 'promo']).optional().default('custom'),
  discountPercent: z.coerce.number().int().min(1).max(99).optional(),
});

function generatePromoCode(prefix = 'HALKI'): string {
  return `${prefix}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

async function createUniqueDiscountCode(percentage: number, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    const code = generatePromoCode();
    try {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const discount = await prisma.discountCode.create({
        data: {
          code,
          percentage,
          active: true,
          expiresAt,
          maxUses: 1,
        },
      });
      return discount;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error as { code?: string }).code === 'P2002'
      ) {
        continue;
      }
      throw error;
    }
  }
  throw new Error('Failed to generate unique discount code');
}

function createEmailTemplate(data: {
  subject: string;
  message: string;
  email: string;
  promoCode?: string;
  discountPercent?: number;
  expiresAt?: Date;
}) {
  const { subject, message, email, promoCode, discountPercent, expiresAt } = data;
  const unsubscribeUrl = `${SITE_URL}/api/newsletter?token=${encodeURIComponent(
    createNewsletterUnsubscribeToken(email),
  )}`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: Arial, Helvetica, sans-serif; background: #f4f6fb; margin: 0; padding: 0; }
    .container { max-width: 680px; margin: 24px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 30px rgba(20,30,60,0.08); }
    .header { background: linear-gradient(90deg,#667eea,#764ba2); color: white; padding: 32px; text-align: center; }
    .content { padding: 28px; color: #1f2937; line-height: 1.6; }
    .message { font-size: 18px; margin: 16px 0; white-space: pre-wrap; }
    .code-box { display:inline-block; background:#f3f4f6; border:2px dashed #667eea; padding:16px 20px; border-radius:8px; font-weight:700; letter-spacing:1px; margin:20px 0; font-size:20px; color:#667eea; }
    .cta { display:inline-block; margin-top:18px; background:#667eea; color:#fff; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:600; }
    .footer { background:#f8fafc; padding:18px; font-size:13px; color:#6b7280; text-align:center; }
    .small { font-size:12px; color:#9ca3af; margin-top:20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0; font-size:28px;">Just Cases</h1>
      <div style="opacity:.95; margin-top:6px;">${subject}</div>
    </div>
    <div class="content">
      <p>Здравейте,</p>
      <div class="message">${message}</div>
      ${
        promoCode
          ? `
        <div style="text-align:center; margin:24px 0;">
          <p style="margin-bottom:12px;">Вашият персонален промо код за <strong>${discountPercent}% намаление</strong>:</p>
          <div class="code-box">${promoCode}</div>
          <p style="font-size:14px; color:#6b7280; margin-top:12px;">
            Валиден еднократно до <strong>${expiresAt ? new Date(expiresAt).toLocaleDateString('bg-BG') : ''}</strong>
          </p>
        </div>
      `
          : ''
      }
      <div style="text-align:center;">
        <a class="cta" href="${SITE_URL}/shop">Разгледай магазина</a>
      </div>
      <p class="small">
        Ако искате да се отпишете, посетете
        <a href="${unsubscribeUrl}" style="color:#667eea;">
          страницата за отписване
        </a>.
      </p>
    </div>
    <div class="footer">
      Just Cases — Премиум мобилни аксесоари
    </div>
  </div>
</body>
</html>`;

  const text = `${subject}\n\n${message}${
    promoCode
      ? `\n\nВашият код: ${promoCode}\n${discountPercent}% намаление — валиден до ${
          expiresAt ? new Date(expiresAt).toLocaleDateString('bg-BG') : ''
        }`
      : ''
  }\n\nЗа отписване: ${unsubscribeUrl}`;

  return { subject, html, text };
}

export const POST = withApiGuard(
  {
    requireAdmin: true,
    csrf: true,
    rateLimit: strictRateLimit,
    bodySchema: newsletterSendSchema,
  },
  async (_request, { body }) => {
    const { subject, message, type = 'custom', discountPercent } = body!;

    if (type === 'promo' && !discountPercent) {
      return NextResponse.json(
        { error: 'discountPercent is required for promo newsletters' },
        { status: 400 },
      );
    }

    const subscribers = await prisma.newsletterSubscription.findMany({
      where: { active: true },
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers found' }, { status: 400 });
    }

    const jobs: Array<{
      type: 'RAW_TEMPLATE';
      to: string;
      payload: { subject: string; html: string; text: string };
    }> = [];
    const skipped: Array<{ email: string; reason: string }> = [];

    for (const subscriber of subscribers) {
      try {
        if (type === 'promo' && discountPercent) {
          const discount = await createUniqueDiscountCode(discountPercent);
          const payload = createEmailTemplate({
            subject,
            message,
            email: subscriber.email,
            promoCode: discount.code,
            discountPercent,
            expiresAt: discount.expiresAt || undefined,
          });
          jobs.push({
            type: 'RAW_TEMPLATE',
            to: subscriber.email,
            payload,
          });
        } else {
          const payload = createEmailTemplate({
            subject,
            message,
            email: subscriber.email,
          });
          jobs.push({
            type: 'RAW_TEMPLATE',
            to: subscriber.email,
            payload,
          });
        }
      } catch (error) {
        skipped.push({
          email: subscriber.email,
          reason: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    if (jobs.length === 0) {
      return NextResponse.json(
        { error: 'Failed to queue newsletter emails', skipped },
        { status: 500 },
      );
    }

    const batchSize = 200;
    for (let i = 0; i < jobs.length; i += batchSize) {
      await enqueueEmailJobs(jobs.slice(i, i + batchSize));
    }

    return NextResponse.json({
      success: true,
      queued: jobs.length,
      skipped: skipped.length,
      message: `Добавени в опашката: ${jobs.length}${skipped.length > 0 ? `, пропуснати: ${skipped.length}` : ''}`,
      skippedDetails: skipped,
    });
  },
);
