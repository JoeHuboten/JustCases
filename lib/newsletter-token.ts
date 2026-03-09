import crypto from 'crypto';

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

interface NewsletterTokenPayload {
  email: string;
  exp: number;
}

function getTokenSecret(): string {
  const explicitSecret = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET;
  if (explicitSecret) return explicitSecret;

  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret) return jwtSecret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEWSLETTER_UNSUBSCRIBE_SECRET or JWT_SECRET must be configured in production');
  }

  return 'dev-only-newsletter-unsubscribe-secret';
}

function signPayload(encodedPayload: string): string {
  return crypto.createHmac('sha256', getTokenSecret()).update(encodedPayload).digest('base64url');
}

export function createNewsletterUnsubscribeToken(
  email: string,
  ttlSeconds: number = DEFAULT_TTL_SECONDS,
): string {
  const payload: NewsletterTokenPayload = {
    email: email.trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + Math.max(60, Math.floor(ttlSeconds)),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function decodePayload(encodedPayload: string): NewsletterTokenPayload | null {
  try {
    const raw = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const parsed = JSON.parse(raw) as NewsletterTokenPayload;
    if (!parsed || typeof parsed.email !== 'string' || typeof parsed.exp !== 'number') {
      return null;
    }
    return {
      email: parsed.email.trim().toLowerCase(),
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}

export function verifyNewsletterUnsubscribeToken(token: string): { valid: boolean; email?: string } {
  if (!token || !token.includes('.')) return { valid: false };

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return { valid: false };

  const expectedSignature = signPayload(encodedPayload);
  if (signature.length !== expectedSignature.length) return { valid: false };

  const signatureMatch = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  if (!signatureMatch) return { valid: false };

  const payload = decodePayload(encodedPayload);
  if (!payload) return { valid: false };

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) return { valid: false };

  // Basic shape check. Full validation happens via DB lookup.
  if (!payload.email.includes('@') || payload.email.length > 320) {
    return { valid: false };
  }

  return { valid: true, email: payload.email };
}
