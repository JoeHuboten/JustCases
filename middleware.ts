import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Paths that require the user to be authenticated
const AUTH_PATHS = [
  '/account',
  '/orders',
  '/checkout',
  '/wishlist',
  '/payments',
  '/deliveries',
  '/delivery',
];

// Paths that additionally require the ADMIN role
const ADMIN_PATHS = ['/admin'];

function getSecret(): Uint8Array {
  const secret =
    process.env.JWT_SECRET ||
    'dev-only-secret-key-do-not-use-in-production-minimum-32-chars';
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const isAuthPath =
    isAdminPath ||
    AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!isAuthPath) return NextResponse.next();

  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());

    if (isAdminPath && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch {
    // Token invalid or expired — redirect to sign-in
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: [
    '/account/:path*',
    '/orders/:path*',
    '/checkout/:path*',
    '/wishlist/:path*',
    '/payments/:path*',
    '/deliveries/:path*',
    '/delivery/:path*',
    '/admin/:path*',
  ],
};
