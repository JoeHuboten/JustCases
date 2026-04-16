import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { createNewsletterUnsubscribeToken } from '@/lib/newsletter-token';

// Email provider configuration
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'nodemailer'; // 'resend' or 'nodemailer'

// Initialize Resend
const RESEND_CONFIGURED = Boolean(
  process.env.RESEND_API_KEY &&
  process.env.RESEND_API_KEY !== 'your_resend_api_key' &&
  process.env.RESEND_API_KEY !== 're_REPLACE_WITH_YOUR_KEY' &&
  /^re_[A-Za-z0-9]{10,}/.test(process.env.RESEND_API_KEY)
);

const resend = RESEND_CONFIGURED ? new Resend(process.env.RESEND_API_KEY!) : null;

// Initialize Nodemailer (works with Gmail, Outlook, etc.)
const NODEMAILER_CONFIGURED = Boolean(
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_USER !== 'your-email@gmail.com' &&
  process.env.SMTP_PASS &&
  process.env.SMTP_PASS !== 'your-app-password-here'
);

const transporter = NODEMAILER_CONFIGURED ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
}) : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';


function getNewsletterUnsubscribeUrl(email: string): string {
  const token = createNewsletterUnsubscribeToken(email);
  return `${SITE_URL}/api/newsletter?token=${encodeURIComponent(token)}`;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// ─── Shared Design System ───────────────────────────────────────────────────
// Premium dark theme matching AuraCase brand

function emailWrapper(content: string, options?: { unsubscribeUrl?: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#08080d;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#08080d;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#111118;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">
          <!-- Wordmark Header -->
          <tr>
            <td style="padding:28px 32px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);background:linear-gradient(135deg,rgba(20,184,166,0.08) 0%,rgba(139,92,246,0.06) 100%);">
              <a href="${SITE_URL}" target="_blank" style="text-decoration:none;">
                <span style="font-size:11px;font-weight:600;letter-spacing:4px;text-transform:uppercase;color:#14b8a6;display:block;margin-bottom:4px;">JUST</span>
                <span style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-1px;display:block;">CASES<span style="color:#14b8a6;">.</span></span>
              </a>
            </td>
          </tr>
          ${content}
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 28px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">© ${new Date().getFullYear()} Just Cases — Premium Mobile Accessories</p>
              <p style="margin:0;font-size:12px;">
                <a href="${SITE_URL}" style="color:#14b8a6;text-decoration:none;">justcases.bg</a>
                <span style="color:#374151;margin:0 8px;">·</span>
                <a href="${SITE_URL}/support" style="color:#6b7280;text-decoration:none;">Support</a>
                <span style="color:#374151;margin:0 8px;">·</span>
                <a href="${SITE_URL}/privacy" style="color:#6b7280;text-decoration:none;">Privacy</a>
              </p>
              ${options?.unsubscribeUrl ? `<p style="margin:12px 0 0;font-size:11px;color:#4b5563;"><a href="${options.unsubscribeUrl}" style="color:#4b5563;text-decoration:underline;">Unsubscribe</a></p>` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function heroSection(emoji: string, title: string, subtitle?: string): string {
  return `
  <tr>
    <td style="padding:40px 32px 24px;text-align:center;background:linear-gradient(135deg,rgba(20,184,166,0.08) 0%,rgba(139,92,246,0.08) 100%);">
      <div style="font-size:48px;margin-bottom:16px;">${emoji}</div>
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">${title}</h1>
      ${subtitle ? `<p style="margin:0;font-size:16px;color:#9ca3af;line-height:1.5;">${subtitle}</p>` : ''}
    </td>
  </tr>`;
}

function ctaButton(label: string, url: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto;">
    <tr>
      <td style="border-radius:10px;background:linear-gradient(135deg,#14b8a6 0%,#0d9488 100%);">
        <a href="${url}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.3px;">${label}</a>
      </td>
    </tr>
  </table>`;
}

function infoCard(content: string): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
    <tr>
      <td style="background-color:#1a1a24;border-radius:12px;padding:24px;border:1px solid rgba(255,255,255,0.06);">
        ${content}
      </td>
    </tr>
  </table>`;
}

function warningBox(content: string): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
    <tr>
      <td style="background-color:rgba(251,191,36,0.08);border-left:3px solid #f59e0b;border-radius:0 8px 8px 0;padding:16px 20px;">
        <p style="margin:0;font-size:14px;color:#d4d4d8;line-height:1.5;">${content}</p>
      </td>
    </tr>
  </table>`;
}

// ─── Email Templates ────────────────────────────────────────────────────────

export const emailTemplates = {
  // ═══════════════════════════════════════════════════════════════════════════
  // EMAIL VERIFICATION
  // ═══════════════════════════════════════════════════════════════════════════
  emailVerification: (data: {
    name: string;
    verificationUrl: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const bg = data.language !== 'en';
    const name = data.name || (bg ? 'там' : 'there');

    const subject = bg
      ? '✉️ Потвърдете имейл адреса си — Just Cases'
      : '✉️ Verify Your Email — Just Cases';

    const html = emailWrapper(`
      ${heroSection(
        '🔐',
        bg ? 'Потвърдете имейла си' : 'Verify Your Email',
        bg ? 'Само една стъпка ви дели от пълен достъп' : 'Just one step away from full access'
      )}
      <tr>
        <td style="padding:28px 32px 36px;">
          <p style="margin:0 0 20px;font-size:16px;color:#d4d4d8;line-height:1.6;">
            ${bg ? 'Здравейте' : 'Hi'} <strong style="color:#ffffff;">${name}</strong>,
          </p>
          <p style="margin:0 0 8px;font-size:15px;color:#9ca3af;line-height:1.6;">
            ${bg
              ? 'Благодарим ви, че се регистрирахте в Just Cases! Натиснете бутона по-долу, за да потвърдите имейл адреса си и да отключите пълен достъп.'
              : 'Thanks for signing up for Just Cases! Click the button below to verify your email and unlock full access to our store.'}
          </p>

          ${ctaButton(
            bg ? '✓ Потвърди имейл адреса' : '✓ Verify My Email',
            data.verificationUrl
          )}

          <p style="margin:0 0 4px;font-size:13px;color:#6b7280;text-align:center;">
            ${bg ? 'Или копирайте този линк:' : 'Or copy this link:'}
          </p>
          <p style="margin:0;text-align:center;word-break:break-all;">
            <a href="${data.verificationUrl}" style="font-size:12px;color:#14b8a6;text-decoration:none;">${data.verificationUrl}</a>
          </p>

          ${warningBox(
            `⏰ ${bg
              ? 'Този линк е валиден <strong style="color:#f59e0b;">24 часа</strong>. Ако не сте създали акаунт, игнорирайте този имейл.'
              : 'This link expires in <strong style="color:#f59e0b;">24 hours</strong>. If you didn\'t create an account, you can safely ignore this email.'}`
          )}

          ${infoCard(`
            <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#ffffff;">
              ${bg ? '🎁 Какво ви очаква:' : '🎁 What you\'ll unlock:'}
            </p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:6px 0;font-size:14px;color:#9ca3af;">✦ ${bg ? 'Достъп до пълния каталог' : 'Full product catalog access'}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:14px;color:#9ca3af;">✦ ${bg ? 'Проследяване на поръчки' : 'Order tracking'}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:14px;color:#9ca3af;">✦ ${bg ? 'Списък с желания и отзиви' : 'Wishlist & reviews'}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:14px;color:#9ca3af;">✦ ${bg ? 'Ексклузивни оферти за членове' : 'Exclusive member offers'}</td>
              </tr>
            </table>
          `)}
        </td>
      </tr>
    `);

    const text = `
${bg ? 'Потвърдете имейла си — Just Cases' : 'Verify Your Email — Just Cases'}

${bg ? 'Здравейте' : 'Hi'} ${name},

${bg ? 'Благодарим ви, че се регистрирахте! Потвърдете имейла си тук:' : 'Thanks for signing up! Verify your email here:'}
${data.verificationUrl}

${bg ? 'Линкът е валиден 24 часа.' : 'This link expires in 24 hours.'}

Just Cases
    `.trim();

    return { subject, html, text };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EMAIL VERIFICATION SUCCESS
  // ═══════════════════════════════════════════════════════════════════════════
  emailVerificationSuccess: (data: {
    name: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const bg = data.language !== 'en';
    const name = data.name || (bg ? 'там' : 'there');

    const subject = bg
      ? '✅ Имейлът е потвърден — Just Cases'
      : '✅ Email Verified — Just Cases';

    const html = emailWrapper(`
      ${heroSection(
        '🎉',
        bg ? 'Имейлът е потвърден!' : 'Email Verified!',
        bg ? 'Вече имате пълен достъп до Just Cases' : 'You now have full access to Just Cases'
      )}
      <tr>
        <td style="padding:28px 32px 36px;">
          <p style="margin:0 0 20px;font-size:16px;color:#d4d4d8;line-height:1.6;">
            ${bg ? 'Здравейте' : 'Hi'} <strong style="color:#ffffff;">${name}</strong>,
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#9ca3af;line-height:1.6;">
            ${bg
              ? 'Вашият имейл беше успешно потвърден. Вече можете да пазарувате, оставяте отзиви и проследявате поръчки.'
              : 'Your email has been successfully verified. You can now shop, leave reviews, and track orders.'}
          </p>

          ${infoCard(`
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:8px 0;font-size:14px;color:#d4d4d8;">
                  <span style="color:#14b8a6;font-weight:600;">✓</span>&nbsp;&nbsp;${bg ? 'Разглеждане и покупка на продукти' : 'Browse and purchase products'}
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:14px;color:#d4d4d8;">
                  <span style="color:#14b8a6;font-weight:600;">✓</span>&nbsp;&nbsp;${bg ? 'Проследяване на поръчки' : 'Track your orders'}
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:14px;color:#d4d4d8;">
                  <span style="color:#14b8a6;font-weight:600;">✓</span>&nbsp;&nbsp;${bg ? 'Оставяне на отзиви и оценки' : 'Leave reviews and ratings'}
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:14px;color:#d4d4d8;">
                  <span style="color:#14b8a6;font-weight:600;">✓</span>&nbsp;&nbsp;${bg ? 'Запазване в списък с желания' : 'Save to your wishlist'}
                </td>
              </tr>
            </table>
          `)}

          ${ctaButton(
            bg ? '🛍️ Започнете пазаруването' : '🛍️ Start Shopping',
            `${SITE_URL}/shop`
          )}
        </td>
      </tr>
    `);

    const text = `
${bg ? 'Имейлът е потвърден!' : 'Email Verified!'}

${bg ? 'Здравейте' : 'Hi'} ${name},

${bg ? 'Имейлът ви беше успешно потвърден. Вече имате пълен достъп.' : 'Your email has been verified. You now have full access.'}

${bg ? 'Започнете пазаруването:' : 'Start shopping:'} ${SITE_URL}/shop

Just Cases
    `.trim();

    return { subject, html, text };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PASSWORD RESET
  // ═══════════════════════════════════════════════════════════════════════════
  passwordReset: (data: {
    name: string;
    resetToken: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const bg = data.language !== 'en';
    const resetUrl = `${SITE_URL}/auth/reset-password?token=${data.resetToken}`;

    const subject = bg
      ? '🔑 Нулиране на парола — Just Cases'
      : '🔑 Reset Your Password — Just Cases';

    const html = emailWrapper(`
      ${heroSection(
        '🔑',
        bg ? 'Нулиране на парола' : 'Reset Your Password',
        bg ? 'Заявка за промяна на паролата' : 'Password change request'
      )}
      <tr>
        <td style="padding:28px 32px 36px;">
          <p style="margin:0 0 20px;font-size:16px;color:#d4d4d8;line-height:1.6;">
            ${bg ? 'Здравейте' : 'Hello'} <strong style="color:#ffffff;">${data.name}</strong>,
          </p>
          <p style="margin:0 0 8px;font-size:15px;color:#9ca3af;line-height:1.6;">
            ${bg
              ? 'Получихме заявка за нулиране на паролата за вашия акаунт. Натиснете бутона по-долу, за да зададете нова парола.'
              : 'We received a request to reset the password for your account. Click the button below to set a new password.'}
          </p>

          ${ctaButton(
            bg ? '🔐 Нулирай паролата' : '🔐 Reset Password',
            resetUrl
          )}

          <p style="margin:0 0 4px;font-size:13px;color:#6b7280;text-align:center;">
            ${bg ? 'Или копирайте този линк:' : 'Or copy this link:'}
          </p>
          <p style="margin:0 0 24px;text-align:center;word-break:break-all;">
            <a href="${resetUrl}" style="font-size:12px;color:#14b8a6;text-decoration:none;">${resetUrl}</a>
          </p>

          ${warningBox(
            `⚠️ <strong style="color:#f59e0b;">${bg ? 'Важно:' : 'Important:'}</strong> ${bg
              ? 'Този линк е валиден само <strong style="color:#f59e0b;">1 час</strong>. Ако не сте заявили тази промяна, игнорирайте този имейл — паролата ви няма да бъде променена.'
              : 'This link is valid for <strong style="color:#f59e0b;">1 hour</strong> only. If you didn\'t request this, ignore this email — your password will remain unchanged.'}`
          )}
        </td>
      </tr>
    `);

    const text = `
${bg ? 'Нулиране на парола — Just Cases' : 'Reset Your Password — Just Cases'}

${bg ? 'Здравейте' : 'Hello'} ${data.name},

${bg ? 'Натиснете тук за да нулирате паролата:' : 'Click here to reset your password:'}
${resetUrl}

${bg ? 'Този линк е валиден само 1 час.' : 'This link is valid for 1 hour only.'}

Just Cases
    `.trim();

    return { subject, html, text };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ORDER CONFIRMATION
  // ═══════════════════════════════════════════════════════════════════════════
  orderConfirmation: (data: {
    orderId: string;
    customerName: string;
    total: number;
    items: Array<{ name: string; quantity: number; price: number }>;
    trackingNumber?: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const bg = data.language !== 'en';
    const currency = '€';

    const subject = bg
      ? `✅ Поръчка #${data.orderId} е потвърдена`
      : `✅ Order #${data.orderId} Confirmed`;

    const itemRows = data.items.map(item => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#ffffff;">${item.name}</p>
          <p style="margin:0;font-size:13px;color:#6b7280;">${bg ? 'Кол.' : 'Qty'}: ${item.quantity}</p>
        </td>
        <td style="padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right;vertical-align:top;">
          <p style="margin:0;font-size:15px;font-weight:600;color:#14b8a6;">${(item.price * item.quantity).toFixed(2)} ${currency}</p>
        </td>
      </tr>
    `).join('');

    const html = emailWrapper(`
      ${heroSection(
        '✅',
        bg ? 'Поръчката е потвърдена!' : 'Order Confirmed!',
        bg ? 'Благодарим ви за покупката' : 'Thank you for your purchase'
      )}
      <tr>
        <td style="padding:28px 32px 36px;">
          <p style="margin:0 0 20px;font-size:16px;color:#d4d4d8;line-height:1.6;">
            ${bg ? 'Здравейте' : 'Hello'} <strong style="color:#ffffff;">${data.customerName}</strong>,
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#9ca3af;line-height:1.6;">
            ${bg
              ? 'Поръчката ви е приета и се обработва. Ще получите имейл, когато бъде изпратена.'
              : 'Your order has been received and is being processed. You\'ll get an email when it ships.'}
          </p>

          ${infoCard(`
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.06);">
                  <p style="margin:0 0 4px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">${bg ? 'Номер на поръчка' : 'Order Number'}</p>
                  <p style="margin:0;font-size:18px;font-weight:700;color:#14b8a6;">#${data.orderId}</p>
                </td>
              </tr>
              ${data.trackingNumber ? `
              <tr>
                <td style="padding:12px 0 16px;border-bottom:1px solid rgba(255,255,255,0.06);">
                  <p style="margin:0 0 4px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">${bg ? 'Номер за проследяване' : 'Tracking Number'}</p>
                  <p style="margin:0;font-size:16px;font-weight:600;color:#ffffff;">${data.trackingNumber}</p>
                </td>
              </tr>` : ''}
              ${itemRows}
              <tr>
                <td colspan="2" style="padding:20px 0 4px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:16px;font-weight:600;color:#9ca3af;">${bg ? 'Общо' : 'Total'}</td>
                      <td style="text-align:right;font-size:22px;font-weight:700;color:#14b8a6;">${data.total.toFixed(2)} ${currency}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          `)}

          ${ctaButton(
            bg ? '📦 Виж поръчката' : '📦 View Order',
            `${SITE_URL}/orders`
          )}
        </td>
      </tr>
    `);

    const text = `
${bg ? 'Поръчка потвърдена!' : 'Order Confirmed!'}

${bg ? 'Здравейте' : 'Hello'} ${data.customerName},

${bg ? 'Номер на поръчка:' : 'Order:'} #${data.orderId}
${data.items.map(i => `- ${i.name} (${i.quantity} × ${i.price.toFixed(2)} ${currency})`).join('\n')}

${bg ? 'Общо:' : 'Total:'} ${data.total.toFixed(2)} ${currency}

${bg ? 'Виж поръчката:' : 'View order:'} ${SITE_URL}/orders

Just Cases
    `.trim();

    return { subject, html, text };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ORDER STATUS UPDATE
  // ═══════════════════════════════════════════════════════════════════════════
  orderStatusUpdate: (data: {
    orderId: string;
    customerName: string;
    status: string;
    trackingNumber?: string;
    courierService?: string;
    estimatedDelivery?: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const bg = data.language !== 'en';

    const statusLabels: Record<string, { bg: string; en: string; emoji: string; color: string }> = {
      PENDING: { bg: 'В очакване', en: 'Pending', emoji: '⏳', color: '#f59e0b' },
      PROCESSING: { bg: 'В обработка', en: 'Processing', emoji: '⚙️', color: '#3b82f6' },
      SHIPPED: { bg: 'Изпратена', en: 'Shipped', emoji: '🚚', color: '#8b5cf6' },
      DELIVERED: { bg: 'Доставена', en: 'Delivered', emoji: '✅', color: '#10b981' },
      CANCELLED: { bg: 'Отказана', en: 'Cancelled', emoji: '❌', color: '#ef4444' },
    };

    const statusInfo = statusLabels[data.status] || statusLabels.PENDING;
    const statusText = bg ? statusInfo.bg : statusInfo.en;

    const subject = bg
      ? `${statusInfo.emoji} Поръчка #${data.orderId} — ${statusText}`
      : `${statusInfo.emoji} Order #${data.orderId} — ${statusText}`;

    const html = emailWrapper(`
      ${heroSection(
        statusInfo.emoji,
        bg ? 'Актуализация на поръчката' : 'Order Update',
        `${bg ? 'Поръчка' : 'Order'} #${data.orderId}`
      )}
      <tr>
        <td style="padding:28px 32px 36px;">
          <p style="margin:0 0 24px;font-size:16px;color:#d4d4d8;line-height:1.6;">
            ${bg ? 'Здравейте' : 'Hello'} <strong style="color:#ffffff;">${data.customerName}</strong>,
          </p>

          ${infoCard(`
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom:16px;">
                  <p style="margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">${bg ? 'Нов статус' : 'New Status'}</p>
                  <p style="margin:0;font-size:20px;font-weight:700;color:${statusInfo.color};">${statusInfo.emoji} ${statusText}</p>
                </td>
              </tr>
              ${data.trackingNumber ? `
              <tr>
                <td style="padding:12px 0;border-top:1px solid rgba(255,255,255,0.06);">
                  <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">${bg ? 'Номер за проследяване' : 'Tracking Number'}</p>
                  <p style="margin:0;font-size:16px;font-weight:600;color:#ffffff;">${data.trackingNumber}</p>
                </td>
              </tr>` : ''}
              ${data.courierService ? `
              <tr>
                <td style="padding:12px 0;border-top:1px solid rgba(255,255,255,0.06);">
                  <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">${bg ? 'Куриер' : 'Courier'}</p>
                  <p style="margin:0;font-size:15px;color:#ffffff;">${data.courierService}</p>
                </td>
              </tr>` : ''}
              ${data.estimatedDelivery ? `
              <tr>
                <td style="padding:12px 0;border-top:1px solid rgba(255,255,255,0.06);">
                  <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">${bg ? 'Очаквана доставка' : 'Estimated Delivery'}</p>
                  <p style="margin:0;font-size:15px;color:#ffffff;">${new Date(data.estimatedDelivery).toLocaleDateString(bg ? 'bg-BG' : 'en-US')}</p>
                </td>
              </tr>` : ''}
            </table>
          `)}

          ${ctaButton(
            bg ? '📍 Проследи поръчката' : '📍 Track Order',
            `${SITE_URL}/orders/track?trackingNumber=${data.trackingNumber || data.orderId}`
          )}
        </td>
      </tr>
    `);

    const text = `
${statusInfo.emoji} ${bg ? 'Актуализация на поръчка' : 'Order Update'} #${data.orderId}

${bg ? 'Здравейте' : 'Hello'} ${data.customerName},

${bg ? 'Нов статус:' : 'New Status:'} ${statusText}
${data.trackingNumber ? `${bg ? 'Проследяване:' : 'Tracking:'} ${data.trackingNumber}` : ''}
${data.courierService ? `${bg ? 'Куриер:' : 'Courier:'} ${data.courierService}` : ''}

${bg ? 'Проследи:' : 'Track:'} ${SITE_URL}/orders/track?trackingNumber=${data.trackingNumber || data.orderId}

Just Cases
    `.trim();

    return { subject, html, text };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DISCOUNT CODE
  // ═══════════════════════════════════════════════════════════════════════════
  discountCode: (data: {
    name: string;
    code: string;
    percentage: number;
    expiresAt?: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const bg = data.language !== 'en';

    const subject = bg
      ? `🎁 ${data.percentage}% отстъпка специално за вас!`
      : `🎁 ${data.percentage}% Off — Just for You!`;

    const html = emailWrapper(`
      ${heroSection(
        '🎁',
        bg ? 'Специална отстъпка!' : 'Special Discount!',
        bg ? `${data.percentage}% отстъпка за следващата ви поръчка` : `${data.percentage}% off your next order`
      )}
      <tr>
        <td style="padding:28px 32px 36px;">
          <p style="margin:0 0 20px;font-size:16px;color:#d4d4d8;line-height:1.6;">
            ${bg ? 'Здравейте' : 'Hello'} <strong style="color:#ffffff;">${data.name}</strong>,
          </p>
          <p style="margin:0 0 28px;font-size:15px;color:#9ca3af;line-height:1.6;">
            ${bg
              ? `Имаме специална изненада за вас — <strong style="color:#14b8a6;">${data.percentage}% отстъпка</strong> за следващата ви поръчка!`
              : `We have a special treat for you — <strong style="color:#14b8a6;">${data.percentage}% off</strong> your next purchase!`}
          </p>

          <!-- Code Box -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
            <tr>
              <td style="text-align:center;padding:28px;background:linear-gradient(135deg,rgba(20,184,166,0.1) 0%,rgba(139,92,246,0.1) 100%);border:2px dashed #14b8a6;border-radius:12px;">
                <p style="margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">${bg ? 'Вашият код' : 'Your Code'}</p>
                <p style="margin:0;font-size:32px;font-weight:800;color:#14b8a6;letter-spacing:3px;">${data.code}</p>
                ${data.expiresAt ? `<p style="margin:12px 0 0;font-size:13px;color:#6b7280;">⏰ ${bg ? 'Валиден до' : 'Valid until'} ${new Date(data.expiresAt).toLocaleDateString(bg ? 'bg-BG' : 'en-US')}</p>` : ''}
              </td>
            </tr>
          </table>

          ${ctaButton(
            bg ? '🛍️ Пазарувай сега' : '🛍️ Shop Now',
            `${SITE_URL}/shop`
          )}
        </td>
      </tr>
    `);

    const text = `
🎁 ${bg ? 'Специална отстъпка!' : 'Special Discount!'}

${bg ? 'Здравейте' : 'Hello'} ${data.name},

${bg ? 'Вашият код за' : 'Your'} ${data.percentage}% ${bg ? 'отстъпка:' : 'discount code:'}
${data.code}

${data.expiresAt ? `${bg ? 'Валиден до:' : 'Valid until:'} ${new Date(data.expiresAt).toLocaleDateString(bg ? 'bg-BG' : 'en-US')}` : ''}

${bg ? 'Пазарувай:' : 'Shop:'} ${SITE_URL}/shop

Just Cases
    `.trim();

    return { subject, html, text };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NEWSLETTER WELCOME
  // ═══════════════════════════════════════════════════════════════════════════
  newsletterWelcome: (data: {
    email: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const bg = data.language !== 'en';
    const unsubscribeUrl = getNewsletterUnsubscribeUrl(data.email);

    const subject = bg
      ? '🎉 Добре дошли в Just Cases!'
      : '🎉 Welcome to Just Cases!';

    const html = emailWrapper(`
      ${heroSection(
        '👋',
        bg ? 'Добре дошли!' : 'Welcome!',
        bg ? 'Вече сте част от Just Cases семейството' : 'You\'re now part of the Just Cases family'
      )}
      <tr>
        <td style="padding:28px 32px 36px;">
          <p style="margin:0 0 24px;font-size:15px;color:#9ca3af;line-height:1.6;">
            ${bg
              ? 'Благодарим, че се абонирахте! Ето какво ви очаква:'
              : 'Thanks for subscribing! Here\'s what you\'ll get:'}
          </p>

          ${infoCard(`
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0;">
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:36px;font-size:20px;vertical-align:top;">✨</td>
                      <td>
                        <p style="margin:0 0 2px;font-size:15px;font-weight:600;color:#ffffff;">${bg ? 'Ексклузивни отстъпки' : 'Exclusive Discounts'}</p>
                        <p style="margin:0;font-size:13px;color:#6b7280;">${bg ? 'Специални оферти само за абонати' : 'Special offers only for subscribers'}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-top:1px solid rgba(255,255,255,0.06);">
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:36px;font-size:20px;vertical-align:top;">🚀</td>
                      <td>
                        <p style="margin:0 0 2px;font-size:15px;font-weight:600;color:#ffffff;">${bg ? 'Нови продукти първи' : 'New Products First'}</p>
                        <p style="margin:0;font-size:13px;color:#6b7280;">${bg ? 'Бъдете първите, които виждат новите стоки' : 'Be the first to see new arrivals'}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-top:1px solid rgba(255,255,255,0.06);">
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:36px;font-size:20px;vertical-align:top;">🎁</td>
                      <td>
                        <p style="margin:0 0 2px;font-size:15px;font-weight:600;color:#ffffff;">${bg ? 'Промоции и подаръци' : 'Promos & Gifts'}</p>
                        <p style="margin:0;font-size:13px;color:#6b7280;">${bg ? 'Сезонни разпродажби и изненади' : 'Seasonal sales and surprises'}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          `)}

          ${ctaButton(
            bg ? '🛍️ Разгледай магазина' : '🛍️ Browse Shop',
            `${SITE_URL}/shop`
          )}
        </td>
      </tr>
    `, { unsubscribeUrl });

    const text = `
${bg ? 'Добре дошли в Just Cases!' : 'Welcome to Just Cases!'}

${bg ? 'Благодарим, че се абонирахте!' : 'Thanks for subscribing!'}

✨ ${bg ? 'Ексклузивни отстъпки' : 'Exclusive Discounts'}
🚀 ${bg ? 'Нови продукти първи' : 'New Products First'}
🎁 ${bg ? 'Промоции и подаръци' : 'Promos & Gifts'}

${bg ? 'Разгледайте:' : 'Browse:'} ${SITE_URL}/shop
${bg ? 'Отписване:' : 'Unsubscribe:'} ${unsubscribeUrl}

Just Cases
    `.trim();

    return { subject, html, text };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NEWSLETTER PROMO
  // ═══════════════════════════════════════════════════════════════════════════
  newsletterPromo: (data: {
    subject: string;
    message: string;
    email: string;
    promoCode: string;
    discountPercent: number;
    expiresAt: Date;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const bg = data.language !== 'en';
    const unsubscribeUrl = getNewsletterUnsubscribeUrl(data.email);

    const subject = data.subject;

    const html = emailWrapper(`
      ${heroSection(
        '🔥',
        data.subject,
        bg ? `${data.discountPercent}% отстъпка с промо код` : `${data.discountPercent}% off with promo code`
      )}
      <tr>
        <td style="padding:28px 32px 36px;">
          <p style="margin:0 0 20px;font-size:16px;color:#d4d4d8;line-height:1.6;">
            ${bg ? 'Здравейте' : 'Hello'},
          </p>
          <p style="margin:0 0 28px;font-size:15px;color:#9ca3af;line-height:1.6;white-space:pre-wrap;">${data.message}</p>

          <!-- Promo Code Box -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
            <tr>
              <td style="text-align:center;padding:28px;background:linear-gradient(135deg,rgba(20,184,166,0.1) 0%,rgba(139,92,246,0.1) 100%);border:2px dashed #14b8a6;border-radius:12px;">
                <p style="margin:0 0 4px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">${bg ? 'Промо код' : 'Promo Code'}</p>
                <p style="margin:0 0 4px;font-size:32px;font-weight:800;color:#14b8a6;letter-spacing:3px;">${data.promoCode}</p>
                <p style="margin:8px 0 0;font-size:14px;color:#8b5cf6;font-weight:600;">${data.discountPercent}% ${bg ? 'отстъпка' : 'discount'}</p>
                <p style="margin:8px 0 0;font-size:12px;color:#6b7280;">
                  ${bg ? 'Валиден до' : 'Valid until'} ${new Date(data.expiresAt).toLocaleDateString(bg ? 'bg-BG' : 'en-US')}
                </p>
              </td>
            </tr>
          </table>

          ${ctaButton(
            bg ? '🛒 Пазарувай сега' : '🛒 Shop Now',
            `${SITE_URL}/shop`
          )}
        </td>
      </tr>
    `, { unsubscribeUrl });

    const text = `
${data.subject}

${bg ? 'Здравейте' : 'Hello'},

${data.message}

${bg ? 'Промо код:' : 'Promo code:'} ${data.promoCode}
${data.discountPercent}% ${bg ? 'отстъпка — валиден до' : 'discount — valid until'} ${new Date(data.expiresAt).toLocaleDateString(bg ? 'bg-BG' : 'en-US')}

${bg ? 'Пазарувай:' : 'Shop:'} ${SITE_URL}/shop
${bg ? 'Отписване:' : 'Unsubscribe:'} ${unsubscribeUrl}

Just Cases
    `.trim();

    return { subject, html, text };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NEWSLETTER UPDATE
  // ═══════════════════════════════════════════════════════════════════════════
  newsletterUpdate: (data: {
    subject: string;
    message: string;
    email: string;
    imageUrl?: string;
    ctaText?: string;
    ctaUrl?: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const bg = data.language !== 'en';
    const unsubscribeUrl = getNewsletterUnsubscribeUrl(data.email);

    const subject = data.subject;

    const html = emailWrapper(`
      ${heroSection(
        '📰',
        data.subject,
        bg ? 'Новини и актуализации' : 'News & Updates'
      )}
      <tr>
        <td style="padding:28px 32px 36px;">
          <p style="margin:0 0 20px;font-size:16px;color:#d4d4d8;line-height:1.6;">
            ${bg ? 'Здравейте' : 'Hello'},
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#9ca3af;line-height:1.6;white-space:pre-wrap;">${data.message}</p>

          ${data.imageUrl ? `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
            <tr>
              <td style="border-radius:12px;overflow:hidden;">
                <img src="${data.imageUrl}" alt="${data.subject}" width="536" style="display:block;width:100%;height:auto;border-radius:12px;" />
              </td>
            </tr>
          </table>` : ''}

          ${data.ctaText && data.ctaUrl ? ctaButton(data.ctaText, data.ctaUrl) : ''}
        </td>
      </tr>
    `, { unsubscribeUrl });

    const text = `
${data.subject}

${bg ? 'Здравейте' : 'Hello'},

${data.message}

${data.ctaText && data.ctaUrl ? `${data.ctaText}: ${data.ctaUrl}` : ''}

${bg ? 'Отписване:' : 'Unsubscribe:'} ${unsubscribeUrl}

Just Cases
    `.trim();

    return { subject, html, text };
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NEWSLETTER PRODUCT LAUNCH
  // ═══════════════════════════════════════════════════════════════════════════
  newsletterProductLaunch: (data: {
    productName: string;
    productDescription: string;
    productPrice: number;
    productImage: string;
    productUrl: string;
    email: string;
    launchDiscount?: number;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const bg = data.language !== 'en';
    const currency = bg ? '€' : 'BGN';
    const unsubscribeUrl = getNewsletterUnsubscribeUrl(data.email);

    const subject = bg
      ? `🚀 Нов продукт: ${data.productName}!`
      : `🚀 New: ${data.productName}!`;

    const html = emailWrapper(`
      ${heroSection(
        '🚀',
        bg ? 'Нов продукт!' : 'New Product Launch!',
        bg ? 'Ексклузивно за нашите абонати' : 'Exclusive for our subscribers'
      )}
      <tr>
        <td style="padding:28px 32px 36px;">
          <p style="margin:0 0 20px;font-size:16px;color:#d4d4d8;line-height:1.6;">
            ${bg ? 'Здравейте' : 'Hello'},
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#9ca3af;line-height:1.6;">
            ${bg
              ? 'Развълнувани сме да ви представим нашия най-нов продукт!'
              : 'We\'re excited to introduce our latest product!'}
          </p>

          ${infoCard(`
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="text-align:center;padding-bottom:20px;">
                  <img src="${data.productImage}" alt="${data.productName}" width="300" style="display:block;margin:0 auto;max-width:300px;height:auto;border-radius:12px;" />
                </td>
              </tr>
              <tr>
                <td>
                  <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#ffffff;">${data.productName}</h2>
                  <p style="margin:0 0 20px;font-size:14px;color:#9ca3af;line-height:1.5;">${data.productDescription}</p>
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      ${data.launchDiscount ? `
                        <td style="padding-right:12px;">
                          <span style="font-size:16px;color:#6b7280;text-decoration:line-through;">${(data.productPrice / (1 - data.launchDiscount / 100)).toFixed(2)} ${currency}</span>
                        </td>` : ''}
                      <td>
                        <span style="font-size:24px;font-weight:700;color:#14b8a6;">${data.productPrice.toFixed(2)} ${currency}</span>
                      </td>
                      ${data.launchDiscount ? `
                        <td style="padding-left:12px;">
                          <span style="display:inline-block;background:#ef4444;color:#fff;padding:4px 10px;border-radius:6px;font-size:13px;font-weight:600;">-${data.launchDiscount}%</span>
                        </td>` : ''}
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          `)}

          ${ctaButton(
            bg ? '🛒 Разгледай продукта' : '🛒 View Product',
            data.productUrl
          )}
        </td>
      </tr>
    `, { unsubscribeUrl });

    const text = `
🚀 ${bg ? 'Нов продукт:' : 'New:'} ${data.productName}

${data.productDescription}

${bg ? 'Цена:' : 'Price:'} ${data.productPrice.toFixed(2)} ${currency}${data.launchDiscount ? ` (-${data.launchDiscount}%)` : ''}

${bg ? 'Виж:' : 'View:'} ${data.productUrl}
${bg ? 'Отписване:' : 'Unsubscribe:'} ${unsubscribeUrl}

Just Cases
    `.trim();

    return { subject, html, text };
  },
};

// ─── Send Email Function ────────────────────────────────────────────────────

export async function sendEmail(to: string, template: EmailTemplate) {
  // Try Nodemailer first if configured
  if (EMAIL_PROVIDER === 'nodemailer' && transporter && NODEMAILER_CONFIGURED) {
    try {
      const result = await transporter.sendMail({
        from: FROM_EMAIL,
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      console.log('✅ Email sent via Nodemailer:', result.messageId);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Error sending email via Nodemailer:', error);
      return { success: false, error };
    }
  }

  // Fallback to Resend
  if (resend && RESEND_CONFIGURED) {
    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      console.log('✅ Email sent via Resend:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Error sending email via Resend:', error);
      return { success: false, error };
    }
  }

  // No email service configured
  console.warn('⚠️ No email service configured. Email would have been sent to:', to);
  console.log('Subject:', template.subject);
  return { success: false, error: 'Email service not configured' };
}

// ─── Helper Functions ───────────────────────────────────────────────────────

export async function sendOrderConfirmationEmail(
  email: string,
  orderData: Parameters<typeof emailTemplates.orderConfirmation>[0]
) {
  const template = emailTemplates.orderConfirmation(orderData);
  return sendEmail(email, template);
}

export async function sendOrderStatusUpdateEmail(
  email: string,
  statusData: Parameters<typeof emailTemplates.orderStatusUpdate>[0]
) {
  const template = emailTemplates.orderStatusUpdate(statusData);
  return sendEmail(email, template);
}

export async function sendPasswordResetEmail(
  email: string,
  resetData: Parameters<typeof emailTemplates.passwordReset>[0]
) {
  const template = emailTemplates.passwordReset(resetData);
  return sendEmail(email, template);
}

export async function sendDiscountCodeEmail(
  email: string,
  discountData: Parameters<typeof emailTemplates.discountCode>[0]
) {
  const template = emailTemplates.discountCode(discountData);
  return sendEmail(email, template);
}

export async function sendNewsletterWelcomeEmail(
  email: string,
  data: Parameters<typeof emailTemplates.newsletterWelcome>[0]
) {
  const template = emailTemplates.newsletterWelcome(data);
  return sendEmail(email, template);
}

export async function sendEmailVerification(
  email: string,
  data: Parameters<typeof emailTemplates.emailVerification>[0]
) {
  if (process.env.NODE_ENV !== 'production' && !RESEND_CONFIGURED && !NODEMAILER_CONFIGURED) {
    console.log(
      '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
      '📧  DEV: No email provider configured — copy this link to verify:\n' +
      `     To:   ${email}\n` +
      `     URL:  ${data.verificationUrl}\n` +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
    );
  }
  const template = emailTemplates.emailVerification(data);
  return sendEmail(email, template);
}

export async function sendEmailVerificationSuccess(
  email: string,
  data: Parameters<typeof emailTemplates.emailVerificationSuccess>[0]
) {
  const template = emailTemplates.emailVerificationSuccess(data);
  return sendEmail(email, template);
}

export async function sendNewsletterPromo(
  email: string,
  data: Parameters<typeof emailTemplates.newsletterPromo>[0]
) {
  const template = emailTemplates.newsletterPromo(data);
  return sendEmail(email, template);
}

export async function sendNewsletterUpdate(
  email: string,
  data: Parameters<typeof emailTemplates.newsletterUpdate>[0]
) {
  const template = emailTemplates.newsletterUpdate(data);
  return sendEmail(email, template);
}

export async function sendNewsletterProductLaunch(
  email: string,
  data: Parameters<typeof emailTemplates.newsletterProductLaunch>[0]
) {
  const template = emailTemplates.newsletterProductLaunch(data);
  return sendEmail(email, template);
}
