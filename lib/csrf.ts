import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function getCsrfSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be configured in production for CSRF protection');
  }
  return 'dev-only-csrf-secret-do-not-use-in-production';
}
const CSRF_TOKEN_HEADER = 'x-csrf-token';
const CSRF_COOKIE_NAME = 'csrf-token';

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  const token = crypto.randomBytes(32).toString('hex');
  const signature = crypto
    .createHmac('sha256', getCsrfSecret())
    .update(token)
    .digest('hex');
  return `${token}.${signature}`;
}

/**
 * Verify a CSRF token
 */
export function verifyCsrfToken(token: string): boolean {
  if (!token || !token.includes('.')) return false;
  
  const [tokenValue, signature] = token.split('.');
  const expectedSignature = crypto
    .createHmac('sha256', getCsrfSecret())
    .update(tokenValue)
    .digest('hex');

  if (signature.length !== expectedSignature.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Middleware to validate CSRF token on mutating requests
 */
export function validateCsrf(request: NextRequest): { valid: boolean; error?: string } {
  // Skip CSRF check for safe methods
  const safeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(request.method);
  if (safeMethod) {
    return { valid: true };
  }

  // Get token from header
  const headerToken = request.headers.get(CSRF_TOKEN_HEADER);
  
  // Get token from cookie
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;

  // Both tokens must be present and match
  if (!headerToken || !cookieToken) {
    return { valid: false, error: 'CSRF token missing' };
  }

  if (headerToken !== cookieToken) {
    return { valid: false, error: 'CSRF token mismatch' };
  }

  // Verify the token signature
  if (!verifyCsrfToken(headerToken)) {
    return { valid: false, error: 'Invalid CSRF token' };
  }

  return { valid: true };
}

/**
 * API route to get a new CSRF token
 */
export function getCsrfTokenResponse(): NextResponse {
  const token = generateCsrfToken();
  
  const response = NextResponse.json({ csrfToken: token });
  
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Must be readable by JavaScript
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
  
  return response;
}
