#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
require('dotenv').config();

const prisma = new PrismaClient();

function genCode(prefix = 'HALKI') {
  return `${prefix}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

async function safeCreateDiscount(code, opts) {
  // try a few times if unique conflict
  for (let i = 0; i < 5; i++) {
    try {
      const dc = await prisma.discountCode.create({ data: { code, ...opts } });
      return dc;
    } catch (err) {
      if (err && err.code === 'P2002') {
        code = genCode();
        continue;
      }
      throw err;
    }
  }
  throw new Error('Unable to create unique discount code after retries');
}

async function main() {
  const subs = await prisma.newsletterSubscription.findMany();
  if (!subs.length) {
    console.log('No subscribers found.');
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, 'backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `newsletter-promo-backup-${timestamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(subs, null, 2), 'utf8');
  console.log(`Backed up ${subs.length} subscriptions to ${backupPath}`);

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  const smtpSecure = process.env.SMTP_SECURE === 'true';
  const fromEmail = process.env.FROM_EMAIL || 'noreply@justcases.bg';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn('SMTP not configured. Aborting send.');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const results = [];
  for (const s of subs) {
    const email = s.email;
    // generate unique code and create DiscountCode record
    const codeBase = genCode('HALKI');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    let discount;
    try {
      discount = await safeCreateDiscount(codeBase, {
        percentage: 67,
        active: true,
        expiresAt,
        maxUses: 1,
      });
    } catch (err) {
      console.error(`Failed to create discount for ${email}:`, err.message || err);
      results.push({ email, success: false, error: 'create_discount_failed' });
      continue;
    }

    const subject = 'За всички халки леко намаление';
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
    .message { font-size: 20px; font-weight: 600; margin: 8px 0 18px; }
    .code { display:inline-block; background:#f3f4f6; border:1px dashed #d1d5db; padding:12px 16px; border-radius:8px; font-weight:700; letter-spacing:1px; margin-top:12px; }
    .cta { display:inline-block; margin-top:18px; background:#667eea; color:#fff; padding:12px 20px; border-radius:8px; text-decoration:none; }
    .footer { background:#f8fafc; padding:18px; font-size:13px; color:#6b7280; text-align:center; }
    .small { font-size:12px; color:#9ca3af; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0; font-size:28px;">JUSTCASES</h1>
      <div style="opacity:.95; margin-top:6px;">За всички халки леко намаление</div>
    </div>
    <div class="content">
      <p class="message">За всички халки леко намаление</p>
      <p>Здравейте,</p>
      <p>Ето вашият персонален промо код за <strong>67% намаление</strong> — валиден еднократно до <strong>${expiresAt.toLocaleDateString('bg-BG')}</strong>:</p>
      <div class="code">${discount.code}</div>
      <p style="margin-top:16px;">Използвайте кода при плащане на страницата за поръчка.</p>
      <a class="cta" href="${appUrl}/shop">Пазарувай сега</a>
      <p style="margin-top:18px;" class="small">Ако искате да се отпишете, посетете <a href="${appUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}">страницата за отписване</a>.</p>
    </div>
    <div class="footer">
      JUSTCASES — Премиум мобилни аксесоари
    </div>
  </div>
</body>
</html>`;

    const text = `За всички халки леко намаление\n\nВашият код: ${discount.code}\n67% намаление — валиден до ${expiresAt.toLocaleDateString('bg-BG')}`;

    try {
      const res = await transporter.sendMail({ from: fromEmail, to: email, subject, html, text });
      console.log(`Sent promo to ${email}: ${res.messageId}`);
      results.push({ email, success: true, messageId: res.messageId, code: discount.code, discountId: discount.id });
    } catch (err) {
      console.error(`Failed to send to ${email}:`, err?.message || err);
      results.push({ email, success: false, error: (err && err.message) || String(err), code: discount.code, discountId: discount.id });
    }
  }

  const reportPath = path.join(backupDir, `newsletter-promo-report-${timestamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`Done. Report saved to ${reportPath}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
