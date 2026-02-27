import { Resend } from 'resend';
import nodemailer from 'nodemailer';

// Email provider configuration
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'nodemailer'; // 'resend' or 'nodemailer'

// Initialize Resend
const RESEND_CONFIGURED = process.env.RESEND_API_KEY && 
  process.env.RESEND_API_KEY !== 'your_resend_api_key' &&
  process.env.RESEND_API_KEY.startsWith('re_');

const resend = RESEND_CONFIGURED ? new Resend(process.env.RESEND_API_KEY!) : null;

// Initialize Nodemailer (works with Gmail, Outlook, etc.)
const NODEMAILER_CONFIGURED = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

const transporter = NODEMAILER_CONFIGURED ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
}) : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@justcases.bg';
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Email templates
export const emailTemplates = {
  // Order Confirmation Email
  orderConfirmation: (data: {
    orderId: string;
    customerName: string;
    total: number;
    items: Array<{ name: string; quantity: number; price: number }>;
    trackingNumber?: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const isBulgarian = data.language === 'bg';
    const currency = '€';
    
    const subject = isBulgarian 
      ? `Потвърждение на поръчка #${data.orderId}` 
      : `Order Confirmation #${data.orderId}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .order-details { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .item { border-bottom: 1px solid #e9ecef; padding: 15px 0; }
    .item:last-child { border-bottom: none; }
    .total { font-size: 20px; font-weight: bold; color: #667eea; margin-top: 20px; text-align: right; }
    .button { display: inline-block; background: #667eea; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${isBulgarian ? '✅ Поръчката е потвърдена!' : '✅ Order Confirmed!'}</h1>
      <p>${isBulgarian ? 'Благодарим Ви за поръчката!' : 'Thank you for your order!'}</p>
    </div>
    
    <div class="content">
      <p>${isBulgarian ? 'Здравейте' : 'Hello'} ${data.customerName},</p>
      
      <p>${isBulgarian 
        ? 'Вашата поръчка беше успешно приета и се обработва.' 
        : 'Your order has been successfully received and is being processed.'}</p>
      
      <div class="order-details">
        <h2>${isBulgarian ? 'Детайли на поръчката' : 'Order Details'}</h2>
        <p><strong>${isBulgarian ? 'Номер на поръчка:' : 'Order Number:'}</strong> #${data.orderId}</p>
        ${data.trackingNumber ? `<p><strong>${isBulgarian ? 'Номер за проследяване:' : 'Tracking Number:'}</strong> ${data.trackingNumber}</p>` : ''}
        
        <h3 style="margin-top: 20px;">${isBulgarian ? 'Продукти' : 'Items'}</h3>
        ${data.items.map(item => `
          <div class="item">
            <strong>${item.name}</strong><br>
            ${isBulgarian ? 'Количество:' : 'Quantity:'} ${item.quantity} × ${item.price.toFixed(2)} ${currency}
          </div>
        `).join('')}
        
        <div class="total">
          ${isBulgarian ? 'Обща сума:' : 'Total:'} ${data.total.toFixed(2)} ${currency}
        </div>
      </div>
      
      <center>
        <a href="${SITE_URL}/orders" class="button">
          ${isBulgarian ? 'Виж поръчката' : 'View Order'}
        </a>
      </center>
      
      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        ${isBulgarian 
          ? 'Ще получите ново имейл уведомление, когато поръчката Ви бъде изпратена.' 
          : 'You will receive another email notification when your order is shipped.'}
      </p>
    </div>
    
    <div class="footer">
      <p>Just Cases - ${isBulgarian ? 'Премиум мобилни аксесоари' : 'Premium Mobile Accessories'}</p>
      <p><a href="${SITE_URL}" style="color: #667eea;">www.justcases.bg</a></p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
${isBulgarian ? 'Здравейте' : 'Hello'} ${data.customerName},

${isBulgarian ? 'Поръчката Ви е потвърдена!' : 'Your order has been confirmed!'}

${isBulgarian ? 'Номер на поръчка:' : 'Order Number:'} #${data.orderId}
${data.trackingNumber ? `${isBulgarian ? 'Номер за проследяване:' : 'Tracking Number:'} ${data.trackingNumber}` : ''}

${isBulgarian ? 'Продукти:' : 'Items:'}
${data.items.map(item => `- ${item.name} (${item.quantity} × ${item.price.toFixed(2)} ${currency})`).join('\n')}

${isBulgarian ? 'Обща сума:' : 'Total:'} ${data.total.toFixed(2)} ${currency}

${isBulgarian ? 'Виж поръчката:' : 'View your order:'} ${SITE_URL}/orders

${isBulgarian ? 'Благодарим Ви!' : 'Thank you!'}
Just Cases
    `.trim();

    return { subject, html, text };
  },

  // Order Status Update Email
  orderStatusUpdate: (data: {
    orderId: string;
    customerName: string;
    status: string;
    trackingNumber?: string;
    courierService?: string;
    estimatedDelivery?: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const isBulgarian = data.language === 'bg';
    
    const statusLabels: Record<string, { bg: string; en: string; emoji: string }> = {
      PENDING: { bg: 'В очакване', en: 'Pending', emoji: '⏳' },
      PROCESSING: { bg: 'В обработка', en: 'Processing', emoji: '📦' },
      SHIPPED: { bg: 'Изпратена', en: 'Shipped', emoji: '🚚' },
      DELIVERED: { bg: 'Доставена', en: 'Delivered', emoji: '✅' },
      CANCELLED: { bg: 'Отказана', en: 'Cancelled', emoji: '❌' },
    };

    const statusInfo = statusLabels[data.status] || statusLabels.PENDING;
    const statusText = isBulgarian ? statusInfo.bg : statusInfo.en;
    
    const subject = isBulgarian 
      ? `${statusInfo.emoji} Актуализация на поръчка #${data.orderId}` 
      : `${statusInfo.emoji} Order Update #${data.orderId}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .status-box { background: #f0f4ff; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .button { display: inline-block; background: #667eea; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${statusInfo.emoji} ${isBulgarian ? 'Актуализация на поръчката' : 'Order Update'}</h1>
    </div>
    
    <div class="content">
      <p>${isBulgarian ? 'Здравейте' : 'Hello'} ${data.customerName},</p>
      
      <p>${isBulgarian ? 'Има нова актуализация за поръчка #' : 'There is a new update for order #'}${data.orderId}</p>
      
      <div class="status-box">
        <h2 style="margin-top: 0;">${isBulgarian ? 'Нов статус:' : 'New Status:'} ${statusText}</h2>
        ${data.trackingNumber ? `<p><strong>${isBulgarian ? 'Номер за проследяване:' : 'Tracking Number:'}</strong> ${data.trackingNumber}</p>` : ''}
        ${data.courierService ? `<p><strong>${isBulgarian ? 'Куриер:' : 'Courier:'}</strong> ${data.courierService}</p>` : ''}
        ${data.estimatedDelivery ? `<p><strong>${isBulgarian ? 'Очаквана доставка:' : 'Estimated Delivery:'}</strong> ${new Date(data.estimatedDelivery).toLocaleDateString(isBulgarian ? 'bg-BG' : 'en-US')}</p>` : ''}
      </div>
      
      <center>
        <a href="${SITE_URL}/orders/track?trackingNumber=${data.trackingNumber || data.orderId}" class="button">
          ${isBulgarian ? 'Проследи поръчката' : 'Track Order'}
        </a>
      </center>
    </div>
    
    <div class="footer">
      <p>Just Cases - ${isBulgarian ? 'Премиум мобилни аксесоари' : 'Premium Mobile Accessories'}</p>
      <p><a href="${SITE_URL}" style="color: #667eea;">www.justcases.bg</a></p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
${isBulgarian ? 'Здравейте' : 'Hello'} ${data.customerName},

${isBulgarian ? 'Актуализация на поръчка #' : 'Order update #'}${data.orderId}

${isBulgarian ? 'Нов статус:' : 'New Status:'} ${statusText}
${data.trackingNumber ? `${isBulgarian ? 'Номер за проследяване:' : 'Tracking Number:'} ${data.trackingNumber}` : ''}
${data.courierService ? `${isBulgarian ? 'Куриер:' : 'Courier:'} ${data.courierService}` : ''}

${isBulgarian ? 'Проследи поръчката:' : 'Track your order:'} ${SITE_URL}/orders/track?trackingNumber=${data.trackingNumber || data.orderId}

Just Cases
    `.trim();

    return { subject, html, text };
  },

  // Password Reset Email
  passwordReset: (data: {
    name: string;
    resetToken: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const isBulgarian = data.language === 'bg';
    const resetUrl = `${SITE_URL}/auth/reset-password?token=${data.resetToken}`;
    
    const subject = isBulgarian 
      ? 'Нулиране на парола - Just Cases' 
      : 'Reset Your Password - Just Cases';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .button { display: inline-block; background: #667eea; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 ${isBulgarian ? 'Нулиране на парола' : 'Reset Password'}</h1>
    </div>
    
    <div class="content">
      <p>${isBulgarian ? 'Здравейте' : 'Hello'} ${data.name},</p>
      
      <p>${isBulgarian 
        ? 'Получихме заявка за нулиране на паролата за Вашия акаунт в Just Cases.' 
        : 'We received a request to reset the password for your Just Cases account.'}</p>
      
      <center>
        <a href="${resetUrl}" class="button">
          ${isBulgarian ? 'Нулирай паролата' : 'Reset Password'}
        </a>
      </center>
      
      <p style="font-size: 14px; color: #666;">
        ${isBulgarian ? 'Или копирайте този линк:' : 'Or copy this link:'}<br>
        <a href="${resetUrl}" style="word-break: break-all; color: #667eea;">${resetUrl}</a>
      </p>
      
      <div class="warning">
        <strong>⚠️ ${isBulgarian ? 'Важно:' : 'Important:'}</strong><br>
        ${isBulgarian 
          ? 'Този линк е валиден само 1 час. Ако не сте заявили тази промяна, моля игнорирайте този имейл.' 
          : 'This link is valid for 1 hour only. If you did not request this change, please ignore this email.'}
      </div>
    </div>
    
    <div class="footer">
      <p>Just Cases - ${isBulgarian ? 'Премиум мобилни аксесоари' : 'Premium Mobile Accessories'}</p>
      <p><a href="${SITE_URL}" style="color: #667eea;">www.justcases.bg</a></p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
${isBulgarian ? 'Здравейте' : 'Hello'} ${data.name},

${isBulgarian 
  ? 'Получихме заявка за нулиране на паролата за Вашия акаунт.' 
  : 'We received a request to reset your password.'}

${isBulgarian ? 'Натиснете тук за да нулирате паролата:' : 'Click here to reset your password:'}
${resetUrl}

${isBulgarian 
  ? 'Този линк е валиден само 1 час.' 
  : 'This link is valid for 1 hour only.'}

Just Cases
    `.trim();

    return { subject, html, text };
  },

  // Discount Code Email
  discountCode: (data: {
    name: string;
    code: string;
    percentage: number;
    expiresAt?: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const isBulgarian = data.language === 'bg';
    
    const subject = isBulgarian 
      ? `🎉 Вашият ${data.percentage}% код за отстъпка` 
      : `🎉 Your ${data.percentage}% Discount Code`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .code-box { background: #f0f4ff; border: 2px dashed #667eea; padding: 30px; margin: 20px 0; border-radius: 8px; text-align: center; }
    .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 2px; }
    .button { display: inline-block; background: #667eea; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 ${isBulgarian ? 'Специална отстъпка за Вас!' : 'Special Discount for You!'}</h1>
    </div>
    
    <div class="content">
      <p>${isBulgarian ? 'Здравейте' : 'Hello'} ${data.name},</p>
      
      <p>${isBulgarian 
        ? `Радваме се да Ви предложим <strong>${data.percentage}% отстъпка</strong> за следващата Ви поръчка!` 
        : `We're excited to offer you a <strong>${data.percentage}% discount</strong> on your next purchase!`}</p>
      
      <div class="code-box">
        <p style="margin: 0 0 10px 0; color: #666;">${isBulgarian ? 'Вашият код:' : 'Your code:'}</p>
        <div class="code">${data.code}</div>
      </div>
      
      ${data.expiresAt ? `
        <p style="text-align: center; color: #666;">
          ⏰ ${isBulgarian ? 'Валиден до:' : 'Valid until:'} ${new Date(data.expiresAt).toLocaleDateString(isBulgarian ? 'bg-BG' : 'en-US')}
        </p>
      ` : ''}
      
      <center>
        <a href="${SITE_URL}/shop" class="button">
          ${isBulgarian ? 'Пазарувай сега' : 'Shop Now'}
        </a>
      </center>
    </div>
    
    <div class="footer">
      <p>Just Cases - ${isBulgarian ? 'Премиум мобилни аксесоари' : 'Premium Mobile Accessories'}</p>
      <p><a href="${SITE_URL}" style="color: #667eea;">www.justcases.bg</a></p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
${isBulgarian ? 'Здравейте' : 'Hello'} ${data.name},

🎉 ${isBulgarian ? 'Специална отстъпка!' : 'Special Discount!'}

${isBulgarian ? 'Вашият код за' : 'Your'} ${data.percentage}% ${isBulgarian ? 'отстъпка:' : 'discount code:'}

${data.code}

${data.expiresAt ? `${isBulgarian ? 'Валиден до:' : 'Valid until:'} ${new Date(data.expiresAt).toLocaleDateString(isBulgarian ? 'bg-BG' : 'en-US')}` : ''}

${isBulgarian ? 'Пазарувай сега:' : 'Shop now:'} ${SITE_URL}/shop

Just Cases
    `.trim();

    return { subject, html, text };
  },

  // Newsletter Welcome Email
  newsletterWelcome: (data: {
    email: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const isBulgarian = data.language === 'bg';
    
    const subject = isBulgarian 
      ? '🎉 Добре дошли в Just Cases бюлетина!' 
      : '🎉 Welcome to Just Cases Newsletter!';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; }
    .benefits { background: #f8f9fa; border-radius: 8px; padding: 25px; margin: 25px 0; }
    .benefit-item { padding: 12px 0; display: flex; align-items: start; }
    .benefit-icon { font-size: 24px; margin-right: 12px; }
    .button { display: inline-block; background: #667eea; color: #fff; padding: 14px 35px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .unsubscribe { color: #999; font-size: 11px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 32px;">🎉</h1>
      <h2 style="margin: 10px 0;">${isBulgarian ? 'Добре дошли!' : 'Welcome!'}</h2>
      <p style="margin: 5px 0; opacity: 0.95;">${isBulgarian ? 'Благодарим, че се абонирахте' : 'Thank you for subscribing'}</p>
    </div>
    
    <div class="content">
      <p style="font-size: 16px;">
        ${isBulgarian 
          ? 'Вече сте част от Just Cases семейството! 🎊' 
          : 'You\'re now part of the Just Cases family! 🎊'}
      </p>
      
      <p>
        ${isBulgarian 
          ? 'Като абонат на нашия бюлетин, ще получавате:' 
          : 'As a subscriber, you\'ll receive:'}
      </p>
      
      <div class="benefits">
        <div class="benefit-item">
          <span class="benefit-icon">✨</span>
          <div>
            <strong>${isBulgarian ? 'Ексклузивни отстъпки' : 'Exclusive Discounts'}</strong><br>
            <span style="color: #666; font-size: 14px;">
              ${isBulgarian ? 'Специални оферти само за абонати' : 'Special offers only for subscribers'}
            </span>
          </div>
        </div>
        
        <div class="benefit-item">
          <span class="benefit-icon">🚀</span>
          <div>
            <strong>${isBulgarian ? 'Нови продукти първи' : 'New Products First'}</strong><br>
            <span style="color: #666; font-size: 14px;">
              ${isBulgarian ? 'Бъдете първите, които виждат новите стоки' : 'Be the first to see new arrivals'}
            </span>
          </div>
        </div>
        
        <div class="benefit-item">
          <span class="benefit-icon">🎁</span>
          <div>
            <strong>${isBulgarian ? 'Специални промоции' : 'Special Promotions'}</strong><br>
            <span style="color: #666; font-size: 14px;">
              ${isBulgarian ? 'Сезонни разпродажби и подаръци' : 'Seasonal sales and gifts'}
            </span>
          </div>
        </div>
        
        <div class="benefit-item">
          <span class="benefit-icon">📱</span>
          <div>
            <strong>${isBulgarian ? 'Съвети и новини' : 'Tips & News'}</strong><br>
            <span style="color: #666; font-size: 14px;">
              ${isBulgarian ? 'Полезна информация за мобилни аксесоари' : 'Useful info about mobile accessories'}
            </span>
          </div>
        </div>
      </div>
      
      <p style="margin-top: 30px;">
        ${isBulgarian 
          ? 'Започнете да разглеждате нашите премиум продукти!' 
          : 'Start exploring our premium products!'}
      </p>
      
      <center>
        <a href="${SITE_URL}/shop" class="button">
          ${isBulgarian ? '🛍️ Разгледай магазина' : '🛍️ Browse Shop'}
        </a>
      </center>
      
      <p style="margin-top: 35px; padding-top: 25px; border-top: 1px solid #e9ecef; color: #666; font-size: 14px;">
        ${isBulgarian 
          ? 'Очаквайте скоро първия ни бюлетин с ексклузивни оферти!' 
          : 'Expect our first newsletter soon with exclusive offers!'}
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Just Cases</strong> - ${isBulgarian ? 'Премиум мобилни аксесоари' : 'Premium Mobile Accessories'}</p>
      <p><a href="${SITE_URL}" style="color: #667eea; text-decoration: none;">www.justcases.bg</a></p>
      
      <p class="unsubscribe">
        ${isBulgarian 
          ? 'Ако желаете да се отпишете:' 
          : 'To unsubscribe:'}
        <a href="${SITE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(data.email)}" style="color: #999;">
          ${isBulgarian ? 'отписване' : 'click here'}
        </a>
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
${isBulgarian ? 'Добре дошли в Just Cases!' : 'Welcome to Just Cases!'}

${isBulgarian ? 'Благодарим, че се абонирахте за нашия бюлетин!' : 'Thank you for subscribing to our newsletter!'}

${isBulgarian ? 'Като абонат, ще получавате:' : 'As a subscriber, you\'ll receive:'}

✨ ${isBulgarian ? 'Ексклузивни отстъпки' : 'Exclusive Discounts'}
🚀 ${isBulgarian ? 'Нови продукти първи' : 'New Products First'}
🎁 ${isBulgarian ? 'Специални промоции' : 'Special Promotions'}
📱 ${isBulgarian ? 'Съвети и новини' : 'Tips & News'}

${isBulgarian ? 'Разгледайте магазина:' : 'Browse our shop:'} ${SITE_URL}/shop

${isBulgarian ? 'За отписване:' : 'To unsubscribe:'} ${SITE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(data.email)}

Just Cases - ${isBulgarian ? 'Премиум мобилни аксесоари' : 'Premium Mobile Accessories'}
    `.trim();

    return { subject, html, text };
  },

  // Newsletter Promo Email
  newsletterPromo: (data: {
    subject: string;
    message: string;
    email: string;
    promoCode: string;
    discountPercent: number;
    expiresAt: Date;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const isBulgarian = data.language === 'bg';
    
    const subject = data.subject;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 680px; margin: 24px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 30px rgba(20,30,60,0.08); }
    .header { background: linear-gradient(90deg, #667eea, #764ba2); color: #fff; padding: 32px; text-align: center; }
    .content { padding: 28px; color: #1f2937; line-height: 1.6; }
    .message { font-size: 18px; margin: 16px 0; white-space: pre-wrap; }
    .promo-section { text-align: center; margin: 32px 0; padding: 24px; background: linear-gradient(135deg, #667eea10, #764ba220); border-radius: 12px; }
    .code-box { display: inline-block; background: #f3f4f6; border: 2px dashed #667eea; padding: 16px 24px; border-radius: 8px; font-weight: 700; letter-spacing: 2px; margin: 16px 0; font-size: 24px; color: #667eea; }
    .cta { display: inline-block; margin-top: 18px; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: transform 0.2s; }
    .cta:hover { transform: scale(1.05); }
    .footer { background: #f8fafc; padding: 20px; font-size: 13px; color: #6b7280; text-align: center; }
    .small { font-size: 12px; color: #9ca3af; margin-top: 20px; }
    .highlight { color: #667eea; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">🎉 Just Cases</h1>
      <div style="opacity: 0.95; margin-top: 8px; font-size: 18px;">${data.subject}</div>
    </div>
    
    <div class="content">
      <p>${isBulgarian ? 'Здравейте' : 'Hello'},</p>
      
      <div class="message">${data.message}</div>
      
      <div class="promo-section">
        <p style="font-size: 16px; margin-bottom: 12px;">
          ${isBulgarian ? 'Вашият персонален промо код за' : 'Your personal promo code for'}
          <span class="highlight">${data.discountPercent}% ${isBulgarian ? 'отстъпка' : 'discount'}</span>:
        </p>
        <div class="code-box">${data.promoCode}</div>
        <p style="font-size: 14px; color: #6b7280; margin-top: 12px;">
          ${isBulgarian ? 'Валиден еднократно до' : 'Valid once until'} 
          <strong>${new Date(data.expiresAt).toLocaleDateString(isBulgarian ? 'bg-BG' : 'en-US')}</strong>
        </p>
      </div>
      
      <div style="text-align: center;">
        <a class="cta" href="${SITE_URL}/shop">
          ${isBulgarian ? '🛒 Разгледай магазина' : '🛒 Shop Now'}
        </a>
      </div>
      
      <p class="small">
        ${isBulgarian ? 'Ако искате да се отпишете, посетете' : 'To unsubscribe, visit'}
        <a href="${SITE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(data.email)}" style="color: #667eea;">
          ${isBulgarian ? 'страницата за отписване' : 'unsubscribe page'}
        </a>.
      </p>
    </div>
    
    <div class="footer">
      <p style="margin: 0;">© ${new Date().getFullYear()} Just Cases</p>
      <p style="margin: 4px 0 0;">${isBulgarian ? 'Премиум мобилни аксесоари' : 'Premium Mobile Accessories'}</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const text = `
${data.subject}

${isBulgarian ? 'Здравейте' : 'Hello'},

${data.message}

${isBulgarian ? 'Вашият код:' : 'Your code:'} ${data.promoCode}
${data.discountPercent}% ${isBulgarian ? 'отстъпка — валиден до' : 'discount — valid until'} ${new Date(data.expiresAt).toLocaleDateString(isBulgarian ? 'bg-BG' : 'en-US')}

${isBulgarian ? 'Пазарувай сега:' : 'Shop now:'} ${SITE_URL}/shop

${isBulgarian ? 'За отписване:' : 'To unsubscribe:'} ${SITE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(data.email)}

Just Cases - ${isBulgarian ? 'Премиум мобилни аксесоари' : 'Premium Mobile Accessories'}
    `.trim();

    return { subject, html, text };
  },

  // Newsletter Update Email
  newsletterUpdate: (data: {
    subject: string;
    message: string;
    email: string;
    imageUrl?: string;
    ctaText?: string;
    ctaUrl?: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const isBulgarian = data.language === 'bg';
    
    const subject = data.subject;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 680px; margin: 24px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 30px rgba(20,30,60,0.08); }
    .header { background: linear-gradient(90deg, #667eea, #764ba2); color: #fff; padding: 32px; text-align: center; }
    .content { padding: 28px; color: #1f2937; line-height: 1.6; }
    .message { font-size: 16px; margin: 16px 0; white-space: pre-wrap; }
    .image-section { margin: 24px 0; text-align: center; }
    .image-section img { max-width: 100%; height: auto; border-radius: 8px; }
    .cta { display: inline-block; margin-top: 24px; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: transform 0.2s; }
    .cta:hover { transform: scale(1.05); }
    .footer { background: #f8fafc; padding: 20px; font-size: 13px; color: #6b7280; text-align: center; }
    .small { font-size: 12px; color: #9ca3af; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">📰 Just Cases</h1>
      <div style="opacity: 0.95; margin-top: 8px; font-size: 18px;">${isBulgarian ? 'Новини и актуализации' : 'News & Updates'}</div>
    </div>
    
    <div class="content">
      <h2 style="color: #667eea; margin-top: 0;">${data.subject}</h2>
      
      <p>${isBulgarian ? 'Здравейте' : 'Hello'},</p>
      
      <div class="message">${data.message}</div>
      
      ${data.imageUrl ? `
        <div class="image-section">
          <img src="${data.imageUrl}" alt="${data.subject}" />
        </div>
      ` : ''}
      
      ${data.ctaText && data.ctaUrl ? `
        <div style="text-align: center; margin: 32px 0;">
          <a class="cta" href="${data.ctaUrl}">
            ${data.ctaText}
          </a>
        </div>
      ` : ''}
      
      <p style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        ${isBulgarian ? 'Благодарим, че сте част от общността на Just Cases!' : 'Thank you for being part of the Just Cases community!'}
      </p>
      
      <p class="small">
        ${isBulgarian ? 'Ако искате да се отпишете, посетете' : 'To unsubscribe, visit'}
        <a href="${SITE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(data.email)}" style="color: #667eea;">
          ${isBulgarian ? 'страницата за отписване' : 'unsubscribe page'}
        </a>.
      </p>
    </div>
    
    <div class="footer">
      <p style="margin: 0;">© ${new Date().getFullYear()} Just Cases</p>
      <p style="margin: 4px 0 0;">${isBulgarian ? 'Премиум мобилни аксесоари' : 'Premium Mobile Accessories'}</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const text = `
${data.subject}

${isBulgarian ? 'Здравейте' : 'Hello'},

${data.message}

${data.ctaText && data.ctaUrl ? `${data.ctaText}: ${data.ctaUrl}` : ''}

${isBulgarian ? 'Благодарим, че сте част от общността на Just Cases!' : 'Thank you for being part of the Just Cases community!'}

${isBulgarian ? 'За отписване:' : 'To unsubscribe:'} ${SITE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(data.email)}

Just Cases - ${isBulgarian ? 'Премиум мобилни аксесоари' : 'Premium Mobile Accessories'}
    `.trim();

    return { subject, html, text };
  },

  // Newsletter Product Launch Email
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
    const isBulgarian = data.language === 'bg';
    const currency = isBulgarian ? '€' : 'BGN';
    
    const subject = isBulgarian 
      ? `🚀 Нов продукт: ${data.productName}!`
      : `🚀 New Product Launch: ${data.productName}!`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 680px; margin: 24px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 30px rgba(20,30,60,0.08); }
    .header { background: linear-gradient(90deg, #667eea, #764ba2); color: #fff; padding: 32px; text-align: center; }
    .content { padding: 28px; color: #1f2937; line-height: 1.6; }
    .product-section { background: #f9fafb; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .product-image { width: 100%; max-width: 400px; height: auto; border-radius: 8px; margin: 0 auto 20px; display: block; }
    .product-title { font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 12px; }
    .product-description { font-size: 16px; color: #4b5563; margin: 12px 0; }
    .price-section { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 20px 0; }
    .original-price { font-size: 18px; color: #9ca3af; text-decoration: line-through; }
    .current-price { font-size: 28px; font-weight: 700; color: #667eea; }
    .discount-badge { display: inline-block; background: #ef4444; color: white; padding: 6px 12px; border-radius: 6px; font-size: 14px; font-weight: 600; }
    .cta { display: inline-block; margin-top: 20px; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: transform 0.2s; }
    .cta:hover { transform: scale(1.05); }
    .features { list-style: none; padding: 0; margin: 20px 0; }
    .features li { padding: 8px 0; padding-left: 28px; position: relative; }
    .features li:before { content: "✓"; position: absolute; left: 0; color: #10b981; font-weight: bold; font-size: 18px; }
    .footer { background: #f8fafc; padding: 20px; font-size: 13px; color: #6b7280; text-align: center; }
    .small { font-size: 12px; color: #9ca3af; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">🚀 ${isBulgarian ? 'Ново в Just Cases' : 'New at Just Cases'}</h1>
      <div style="opacity: 0.95; margin-top: 8px; font-size: 18px;">
        ${isBulgarian ? 'Ексклузивен продукт за вас!' : 'Exclusive Product for You!'}
      </div>
    </div>
    
    <div class="content">
      <p>${isBulgarian ? 'Здравейте' : 'Hello'},</p>
      
      <p style="font-size: 18px; font-weight: 500;">
        ${isBulgarian 
          ? 'Развълнувани сме да представим нашия най-нов продукт!' 
          : 'We\'re excited to introduce our latest product!'}
      </p>
      
      <div class="product-section">
        <img src="${data.productImage}" alt="${data.productName}" class="product-image" />
        
        <h2 class="product-title">${data.productName}</h2>
        
        <p class="product-description">${data.productDescription}</p>
        
        <div class="price-section">
          ${data.launchDiscount ? `
            <span class="original-price">${(data.productPrice / (1 - data.launchDiscount / 100)).toFixed(2)} ${currency}</span>
            <span class="current-price">${data.productPrice.toFixed(2)} ${currency}</span>
            <span class="discount-badge">-${data.launchDiscount}%</span>
          ` : `
            <span class="current-price">${data.productPrice.toFixed(2)} ${currency}</span>
          `}
        </div>
        
        ${data.launchDiscount ? `
          <p style="text-align: center; color: #ef4444; font-weight: 600; margin: 16px 0;">
            ⚡ ${isBulgarian ? 'Специална цена при лансиране!' : 'Special Launch Price!'}
          </p>
        ` : ''}
        
        <div style="text-align: center;">
          <a class="cta" href="${data.productUrl}">
            ${isBulgarian ? '🛒 Разгледай продукта' : '🛒 View Product'}
          </a>
        </div>
      </div>
      
      <p style="margin-top: 24px;">
        ${isBulgarian 
          ? 'Бъдете сред първите, които ще притежават този невероятен продукт!' 
          : 'Be among the first to own this amazing product!'}
      </p>
      
      <p class="small" style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        ${isBulgarian ? 'Ако искате да се отпишете, посетете' : 'To unsubscribe, visit'}
        <a href="${SITE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(data.email)}" style="color: #667eea;">
          ${isBulgarian ? 'страницата за отписване' : 'unsubscribe page'}
        </a>.
      </p>
    </div>
    
    <div class="footer">
      <p style="margin: 0;">© ${new Date().getFullYear()} Just Cases</p>
      <p style="margin: 4px 0 0;">${isBulgarian ? 'Премиум мобилни аксесоари' : 'Premium Mobile Accessories'}</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const text = `
${isBulgarian ? 'Ново в Just Cases!' : 'New at Just Cases!'}

${isBulgarian ? 'Здравейте' : 'Hello'},

${isBulgarian ? 'Представяме ви:' : 'Introducing:'} ${data.productName}

${data.productDescription}

${isBulgarian ? 'Цена:' : 'Price:'} ${data.productPrice.toFixed(2)} ${currency}${data.launchDiscount ? ` (-${data.launchDiscount}% ${isBulgarian ? 'при лансиране' : 'launch discount'})` : ''}

${isBulgarian ? 'Разгледайте продукта:' : 'View product:'} ${data.productUrl}

${isBulgarian ? 'Бъдете сред първите, които ще притежават този невероятен продукт!' : 'Be among the first to own this amazing product!'}

${isBulgarian ? 'За отписване:' : 'To unsubscribe:'} ${SITE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(data.email)}

Just Cases - ${isBulgarian ? 'Премиум мобилни аксесоари' : 'Premium Mobile Accessories'}
    `.trim();

    return { subject, html, text };
  },

  // Email Verification
  emailVerification: (data: {
    name: string;
    verificationUrl: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const isBulgarian = data.language === 'bg';
    
    const subject = isBulgarian 
      ? 'Потвърдете имейл адреса си - Just Cases' 
      : 'Verify Your Email Address - Just Cases';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff !important; padding: 14px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; }
    .link-text { color: #667eea; word-break: break-all; font-size: 14px; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${isBulgarian ? '🎉 Добре дошли в Just Cases!' : '🎉 Welcome to Just Cases!'}</h1>
    </div>
    
    <div class="content">
      <p>${isBulgarian ? 'Здравейте' : 'Hi'} ${data.name || (isBulgarian ? 'там' : 'there')},</p>
      
      <p>${isBulgarian 
        ? 'Благодарим Ви, че се регистрирахте в Just Cases! Радваме се, че се присъединихте към нашата общност.' 
        : 'Thank you for registering with Just Cases! We\'re excited to have you join our community.'}</p>
      
      <p>${isBulgarian 
        ? 'За да завършите регистрацията и да получите пълен достъп за покупка на премиум калъфи за телефон, моля потвърдете имейл адреса си, като кликнете на бутона по-долу:' 
        : 'To complete your registration and unlock full access to purchase premium phone cases, please verify your email address by clicking the button below:'}</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.verificationUrl}" class="button">
          ${isBulgarian ? 'Потвърди имейл адреса' : 'Verify Email Address'}
        </a>
      </div>
      
      <p style="font-size: 14px; color: #666;">
        ${isBulgarian ? 'Или копирайте и поставете този линк във вашия браузър:' : 'Or copy and paste this link into your browser:'}<br>
        <a href="${data.verificationUrl}" class="link-text">${data.verificationUrl}</a>
      </p>
      
      <div class="warning">
        <p style="margin: 0; font-size: 14px;">
          ⏰ ${isBulgarian 
            ? 'Този линк ще изтече след 24 часа.' 
            : 'This link will expire in 24 hours.'}
        </p>
      </div>
      
      <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        ${isBulgarian 
          ? 'Ако не сте създали акаунт в Just Cases, можете спокойно да игнорирате този имейл.' 
          : 'If you didn\'t create an account with Just Cases, you can safely ignore this email.'}
      </p>
      
      <p style="margin-top: 30px;">
        ${isBulgarian ? 'Поздрави' : 'Best regards'},<br>
        <strong>${isBulgarian ? 'Екипът на Just Cases' : 'The Just Cases Team'}</strong>
      </p>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} Just Cases. ${isBulgarian ? 'Всички права запазени.' : 'All rights reserved.'}</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const text = `
${isBulgarian ? 'Добре дошли в Just Cases!' : 'Welcome to Just Cases!'}

${isBulgarian ? 'Здравейте' : 'Hi'} ${data.name || (isBulgarian ? 'там' : 'there')},

${isBulgarian 
  ? 'Благодарим Ви, че се регистрирахте в Just Cases! За да завършите регистрацията, моля потвърдете имейл адреса си.' 
  : 'Thank you for registering with Just Cases! To complete your registration, please verify your email address.'}

${isBulgarian ? 'Линк за потвърждение:' : 'Verification link:'}
${data.verificationUrl}

${isBulgarian 
  ? 'Този линк ще изтече след 24 часа. Ако не сте създали акаунт в Just Cases, можете спокойно да игнорирате този имейл.' 
  : 'This link will expire in 24 hours. If you didn\'t create an account with Just Cases, you can safely ignore this email.'}

${isBulgarian ? 'Поздрави,' : 'Best regards,'}
${isBulgarian ? 'Екипът на Just Cases' : 'The Just Cases Team'}
    `.trim();

    return { subject, html, text };
  },

  // Email Verification Success
  emailVerificationSuccess: (data: {
    name: string;
    language?: 'bg' | 'en';
  }): EmailTemplate => {
    const isBulgarian = data.language === 'bg';
    
    const subject = isBulgarian 
      ? '✓ Имейлът е потвърден - Just Cases' 
      : '✓ Email Verified - Just Cases';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .features { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .features ul { margin: 10px 0; padding-left: 20px; }
    .features li { margin: 8px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff !important; padding: 14px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${isBulgarian ? '✓ Имейлът е потвърден!' : '✓ Email Verified!'}</h1>
    </div>
    
    <div class="content">
      <p>${isBulgarian ? 'Здравейте' : 'Hi'} ${data.name || (isBulgarian ? 'там' : 'there')},</p>
      
      <p>${isBulgarian 
        ? 'Отлични новини! Вашият имейл адрес беше успешно потвърден. Сега имате пълен достъп до всички функции на Just Cases, включително:' 
        : 'Great news! Your email has been successfully verified. You now have full access to all features on Just Cases, including:'}</p>
      
      <div class="features">
        <ul>
          <li>${isBulgarian ? 'Разглеждане на нашата колекция от премиум калъфи' : 'Browse our premium phone case collection'}</li>
          <li>${isBulgarian ? 'Добавяне на артикули в количката и извършване на покупки' : 'Add items to cart and make purchases'}</li>
          <li>${isBulgarian ? 'Проследяване на вашите поръчки' : 'Track your orders'}</li>
          <li>${isBulgarian ? 'Оставяне на отзиви и оценки' : 'Leave reviews and ratings'}</li>
          <li>${isBulgarian ? 'Запазване на артикули в списъка с желания' : 'Save items to your wishlist'}</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${SITE_URL}/shop" class="button">
          ${isBulgarian ? 'Започнете пазаруването' : 'Start Shopping'}
        </a>
      </div>
      
      <p style="margin-top: 30px;">
        ${isBulgarian ? 'Поздрави' : 'Best regards'},<br>
        <strong>${isBulgarian ? 'Екипът на Just Cases' : 'The Just Cases Team'}</strong>
      </p>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} Just Cases. ${isBulgarian ? 'Всички права запазени.' : 'All rights reserved.'}</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const text = `
${isBulgarian ? 'Имейлът е потвърден!' : 'Email Verified!'}

${isBulgarian ? 'Здравейте' : 'Hi'} ${data.name || (isBulgarian ? 'там' : 'there')},

${isBulgarian 
  ? 'Отлични новини! Вашият имейл адрес беше успешно потвърден. Сега имате пълен достъп до всички функции на Just Cases.' 
  : 'Great news! Your email has been successfully verified. You now have full access to all features on Just Cases.'}

${isBulgarian ? 'Започнете пазаруването:' : 'Start shopping:'} ${SITE_URL}/shop

${isBulgarian ? 'Поздрави,' : 'Best regards,'}
${isBulgarian ? 'Екипът на Just Cases' : 'The Just Cases Team'}
    `.trim();

    return { subject, html, text };
  },
};

// Send email function
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
  console.log('Preview URL would be available in production');
  return { success: false, error: 'Email service not configured' };
}

// Helper functions for common email scenarios
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
