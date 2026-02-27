#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  const subs = await prisma.newsletterSubscription.findMany();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, 'backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `newsletter-send-backup-${timestamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(subs, null, 2), 'utf8');
  console.log(`Backed up ${subs.length} subscriptions to ${backupPath}`);

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  const smtpSecure = process.env.SMTP_SECURE === 'true';
  const fromEmail = process.env.FROM_EMAIL || 'noreply@justcases.bg';

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
    const to = s.email;
      const subject = 'кво става халки';
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
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
      .cta { display:inline-block; margin-top:18px; background:#667eea; color:#fff; padding:12px 20px; border-radius:8px; text-decoration:none; }
      .footer { background:#f8fafc; padding:18px; font-size:13px; color:#6b7280; text-align:center; }
      .small { font-size:12px; color:#9ca3af; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin:0; font-size:28px;">JUSTCASES</h1>
        <div style="opacity:.95; margin-top:6px;">Бърз ъпдейт от нашия екип</div>
      </div>
      <div class="content">
        <p class="message">кво става халки</p>
        <p>Здравейте,</p>
        <p>Това е кратко съобщение, изпратено до нашите абонати — просто да ви кажем <strong>кво става халки</strong> 🙂</p>
        <a class="cta" href="${appUrl}/shop">Разгледай магазина</a>
        <p style="margin-top:18px;" class="small">Ако искате да се отпишете, посетете <a href="${appUrl}/newsletter/unsubscribe">страницата за отписване</a>.</p>
      </div>
      <div class="footer">
        JUSTCASES — Премиум мобилни аксесоари
      </div>
    </div>
  </body>
  </html>`;

      const text = 'кво става халки — вижте влизащото писмо за повече информация.';

    try {
      const res = await transporter.sendMail({ from: fromEmail, to, subject, html, text });
      console.log(`Sent to ${to}: ${res.messageId}`);
      results.push({ email: to, success: true, id: res.messageId });
    } catch (err) {
      console.error(`Failed to send to ${to}:`, err?.message || err);
      results.push({ email: to, success: false, error: (err && err.message) || String(err) });
    }
  }

  const reportPath = path.join(backupDir, `newsletter-send-report-${timestamp}.json`);
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
