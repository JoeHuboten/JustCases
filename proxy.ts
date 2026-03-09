import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that require authentication
const protectedRoutes = ['/account', '/orders', '/checkout', '/wishlist'];

// Routes that require admin access
const adminRoutes = ['/admin'];

// Routes that should redirect to home if already authenticated
const authRoutes = ['/auth/signin', '/auth/signup'];

function getAllowedOrigins(): string[] {
  const explicit = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) explicit.push(appUrl);
  return Array.from(new Set(explicit));
}

function applyCorsHeaders(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get('origin');
  const allowedOrigins = getAllowedOrigins();

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Vary', 'Origin');
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-csrf-token, x-request-id',
  );
}

async function verifyToken(token: string): Promise<{ userId: string; role: string } | null> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET not configured');
      return null;
    }
    
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    
    return {
      userId: payload.userId as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

// Default export function for Next.js 16 proxy
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API CORS preflight handling
  if (pathname.startsWith('/api/') && request.method === 'OPTIONS') {
    const preflight = new NextResponse(null, { status: 204 });
    applyCorsHeaders(request, preflight);
    return preflight;
  }
  
  // Get auth token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // Check if user is authenticated
  let user: { userId: string; role: string } | null = null;
  if (token) {
    user = await verifyToken(token);
  }
  
  // Admin route protection - server-side redirect if not admin
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!user) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    
    if (user.role !== 'ADMIN') {
      // Redirect non-admin users to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // Protected routes - require authentication
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!user) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  // Auth routes - redirect to home if already authenticated
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  const nonce = crypto.randomUUID().replace(/-/g, '');
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  // Create response with security headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (pathname.startsWith('/api/')) {
    applyCorsHeaders(request, response);
  }
  
  // Security Headers
  const headers = response.headers;

  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');

  // Enable XSS filter in browsers
  headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer policy - don't leak referrer to external sites
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy - restrict browser features
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // Content Security Policy
  const cspDirectives = [
    "default-src 'self'",
    // Use request nonce for first-party scripts and allow trusted payment providers.
    `script-src 'self' 'nonce-${nonce}' https://www.paypal.com https://www.sandbox.paypal.com https://*.paypal.com https://js.stripe.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https: http:",
    // Allow PayPal and Stripe API connections
    "connect-src 'self' https://www.paypal.com https://www.sandbox.paypal.com https://*.paypal.com https://api-m.paypal.com https://api-m.sandbox.paypal.com https://api.stripe.com",
    // Allow PayPal and Stripe frames
    "frame-src 'self' https://www.paypal.com https://www.sandbox.paypal.com https://*.paypal.com https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];

  if (process.env.NODE_ENV === 'production') {
    cspDirectives.push('upgrade-insecure-requests');
  }

  const csp = cspDirectives.join('; ');

  headers.set('Content-Security-Policy', csp);

  // Strict Transport Security (HTTPS only)
  if (process.env.NODE_ENV === 'production') {
    headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
