# Vercel Deployment Guide for JustCases

## Prerequisites
- GitHub account with JustCases repository
- Vercel account (free tier works)
- Vercel CLI installed ✅ (already installed)

## Quick Start

### Option 1: Automated Deployment (Recommended)

Run the deployment script:

```bash
./deploy-vercel.sh
```

This will guide you through the entire process step by step.

---

## Option 2: Manual Deployment

### Step 1: Login to Vercel

```bash
vercel login
```

This will open a browser window. Login with your GitHub account.

---

### Step 2: Deploy the Project

```bash
cd /Users/nikolay/Documents/JustCases
vercel
```

Answer the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your personal account
- **Link to existing project?** → No
- **What's your project's name?** → justcases (or your choice)
- **In which directory is your code located?** → ./ (press Enter)
- **Want to override settings?** → No

---

### Step 3: Create Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **justcases** project
3. Click **Storage** tab
4. Click **Create Database** → **Postgres**
5. Choose a name: `justcases-db`
6. Select region: **Europe** (closest to Bulgaria)
7. Click **Create**

Vercel will automatically add these environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` ← Use this one for DATABASE_URL
- `POSTGRES_URL_NON_POOLING`

---

### Step 4: Set Environment Variables

Go to: **Settings** → **Environment Variables**

Add these variables (for **Production** environment):

#### Required Variables:

```bash
DATABASE_URL
→ Copy from POSTGRES_PRISMA_URL (automatically created from database)

JWT_SECRET
→ fjMf3bn2EZ4yKDYeDDIizoUtsHFgR6jatU7+2RYkPhc=

NEXTAUTH_SECRET
→ VW2Z+OF+spMSd/kWuC8Agddf0PnkS6D5pICbYYxSPo0=

NEXTAUTH_URL
→ https://justcases.vercel.app (your actual Vercel domain)

NODE_ENV
→ production

NEXT_PUBLIC_APP_URL
→ https://justcases.vercel.app (your actual Vercel domain)
```

#### Optional Variables (add if you have them):

```bash
# Stripe
STRIPE_PUBLISHABLE_KEY → pk_live_...
STRIPE_SECRET_KEY → sk_live_...
STRIPE_WEBHOOK_SECRET → whsec_...

# PayPal
PAYPAL_CLIENT_ID → your_client_id
PAYPAL_CLIENT_SECRET → your_client_secret
PAYPAL_MODE → live

# Email (Resend)
RESEND_API_KEY → re_...
EMAIL_FROM → noreply@yourdomain.com
```

---

### Step 5: Redeploy with Environment Variables

After adding environment variables:

```bash
vercel --prod
```

Wait for deployment to complete.

---

### Step 6: Run Database Migrations

```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database with initial data
npx prisma db seed
```

---

### Step 7: Verify Deployment

1. Open your Vercel URL: https://justcases.vercel.app
2. Check that the homepage loads
3. Try registering a test account
4. Check database connection works

---

## Troubleshooting

### Build fails with "JWT_SECRET required"
- Make sure JWT_SECRET is added in Vercel environment variables
- Redeploy: `vercel --prod`

### Database connection fails
- Check DATABASE_URL is set correctly
- Use POSTGRES_PRISMA_URL value (with connection pooling)
- Make sure it ends with `?pgbouncer=true&connection_limit=1`

### Migrations not applied
- Run `vercel env pull .env.local` first
- Then run `npx prisma migrate deploy`
- Check Vercel logs for migration errors

### 500 errors on production
- Check Vercel logs: `vercel logs`
- Or in dashboard: Project → Deployments → Click deployment → Functions tab

---

## Post-Deployment Steps

### 1. Set up Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your domain: `justcases.bg`
3. Follow DNS configuration instructions

### 2. Create Admin User

```bash
# Local with production database
vercel env pull .env.local
npm run create-admin
```

Or create manually in database.

### 3. Configure Payment Webhooks

#### Stripe:
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://justcases.vercel.app/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to STRIPE_WEBHOOK_SECRET

#### PayPal:
1. PayPal Developer Dashboard → My Apps
2. Configure webhooks: `https://justcases.vercel.app/api/webhooks/paypal`
3. Subscribe to payment events

---

## Useful Commands

```bash
# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Open project in browser
vercel open

# Pull environment variables
vercel env pull

# Remove project
vercel remove
```

---

## Your Generated Secrets

**JWT_SECRET:**
```
fjMf3bn2EZ4yKDYeDDIizoUtsHFgR6jatU7+2RYkPhc=
```

**NEXTAUTH_SECRET:**
```
VW2Z+OF+spMSd/kWuC8Agddf0PnkS6D5pICbYYxSPo0=
```

⚠️ **Keep these secrets safe! Don't commit them to Git.**

---

## Support

If you encounter issues:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
3. Review Vercel logs for error messages

---

**Your app is ready to deploy! 🚀**

Run `./deploy-vercel.sh` to get started!
