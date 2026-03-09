import { z } from 'zod';

/**
 * Environment variable validation schema
 * Validates required and optional env vars at startup
 */
const envSchema = z.object({
  // Database - required
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // JWT Secret - required for auth
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters for security'),

  // PayPal - required for payments
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: z.string().min(1, 'NEXT_PUBLIC_PAYPAL_CLIENT_ID is required'),
  PAYPAL_CLIENT_SECRET: z.string().optional(),

  // Email configuration - at least one provider should be configured
  EMAIL_PROVIDER: z.enum(['resend', 'nodemailer']).optional().default('nodemailer'),
  RESEND_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),

  // App URL
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default('http://localhost:3000'),
  ALLOWED_ORIGINS: z.string().optional(),
  NEWSLETTER_UNSUBSCRIBE_SECRET: z.string().min(16).optional(),

  // Redis (Upstash REST)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  RATE_LIMIT_FAIL_CLOSED: z.enum(['true', 'false']).optional(),
  JOB_WORKER_SECRET: z.string().min(16).optional(),
  HEALTHCHECK_SECRET: z.string().min(16).optional(),

  // Stripe (optional)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
});

/**
 * Validated environment variables
 * Will throw at startup if required vars are missing
 */
function validateEnv() {
  // Only validate on server side
  if (typeof window !== 'undefined') {
    return {} as z.infer<typeof envSchema>;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.issues
      .map((e) => `  - ${String(e.path.join('.'))}: ${e.message}`)
      .join('\n');

    console.error('❌ Environment validation failed:\n' + errors);

    // In development, just warn but don't crash
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Running in development mode with missing env vars');
      return process.env as unknown as z.infer<typeof envSchema>;
    }

    throw new Error('Invalid environment configuration. Check your .env file.');
  }

  // Validate email provider configuration
  const env = parsed.data;
  if (env.EMAIL_PROVIDER === 'resend' && !env.RESEND_API_KEY) {
    console.warn('⚠️ EMAIL_PROVIDER is "resend" but RESEND_API_KEY is not set');
  }
  if (env.EMAIL_PROVIDER === 'nodemailer' && (!env.SMTP_HOST || !env.SMTP_USER)) {
    console.warn('⚠️ EMAIL_PROVIDER is "nodemailer" but SMTP settings are incomplete');
  }
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN && !env.JOB_WORKER_SECRET) {
    console.warn('⚠️ Redis is configured but JOB_WORKER_SECRET is missing (email queue worker endpoint will be locked)');
  }
  if (env.RATE_LIMIT_FAIL_CLOSED === 'true' && (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN)) {
    console.warn('⚠️ RATE_LIMIT_FAIL_CLOSED is enabled without Redis; it has no effect until Redis is configured');
  }

  return env;
}

export const env = validateEnv();

// Type-safe env access
export type Env = z.infer<typeof envSchema>;

// Helper to check if running in production
export const isProduction = process.env.NODE_ENV === 'production';

// Helper to check if running in development
export const isDevelopment = process.env.NODE_ENV === 'development';
