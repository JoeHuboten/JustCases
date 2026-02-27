# Email Setup Guide

This project supports two email providers: **Nodemailer (SMTP)** and **Resend**.

## Recommended: Nodemailer with Gmail (FREE)

Nodemailer allows sending emails to **any recipient** using your Gmail account (or any SMTP provider).

### Gmail Setup (5 minutes)

1. **Enable 2-Factor Authentication** on your Google account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Create an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "JustCases" as the name
   - Click "Generate"
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

3. **Update your `.env` file**:
   ```env
   EMAIL_PROVIDER="nodemailer"
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="nstoyanov639@gmail.com"
   SMTP_PASS="abcd efgh ijkl mnop"  # Your app password from step 2
   FROM_EMAIL="nstoyanov639@gmail.com"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Restart your dev server** (Ctrl+C and `npm run dev`)

5. **Test**: Now you can send password reset emails to ANY email address!

### Gmail Limits
- **Free tier**: 500 emails/day
- **Perfect for**: Development and small production sites
- **No recipient restrictions**: Send to anyone

---

## Alternative: Resend (Paid)

Resend is easier to set up but **requires a paid plan** ($20/month) to send to multiple recipients.

### Resend Setup

1. **Get API Key**: https://resend.com/api-keys

2. **Update `.env`**:
   ```env
   EMAIL_PROVIDER="resend"
   RESEND_API_KEY="re_your_key_here"
   FROM_EMAIL="onboarding@resend.dev"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Free tier limitation**: Only sends to your verified email
4. **Paid tier** ($20/month): Unlimited recipients

---

## Other SMTP Providers

You can use any SMTP provider with Nodemailer:

### Outlook/Hotmail
```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_USER="your-email@outlook.com"
SMTP_PASS="your-password"
```

### SendGrid SMTP (100 emails/day free)
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
```

### Mailgun SMTP (100 emails/day free)
```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_USER="your-mailgun-username"
SMTP_PASS="your-mailgun-password"
```

---

## Testing

After setup, test the password reset flow:

1. Go to http://localhost:3000/auth/forgot-password
2. Enter any email address
3. Check that email's inbox
4. Click the reset link
5. Set a new password

The email should arrive within seconds!
