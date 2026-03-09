import { NextRequest } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './database';
import bcrypt from 'bcryptjs';

// Lazy-evaluated JWT secret - only checked at runtime, not build time
let _jwtSecret: Uint8Array | null = null;

const getJwtSecret = (): Uint8Array => {
  // Return cached value if already computed
  if (_jwtSecret) return _jwtSecret;
  
  const secret = process.env.JWT_SECRET;
  
  // In production, JWT_SECRET must be set - fail fast at runtime (not build time)
  if (process.env.NODE_ENV === 'production') {
    if (!secret) {
      throw new Error('CRITICAL: JWT_SECRET environment variable is required in production. Application startup aborted.');
    }
    if (secret.length < 32) {
      throw new Error('CRITICAL: JWT_SECRET must be at least 32 characters for security. Application startup aborted.');
    }
  }
  
  // In development, allow fallback with warning
  if (!secret) {
    if (typeof window === 'undefined') {
      console.warn('\x1b[33m⚠️  JWT_SECRET not set. Using development fallback. DO NOT deploy without setting JWT_SECRET!\x1b[0m');
    }
    _jwtSecret = new TextEncoder().encode('dev-only-secret-key-do-not-use-in-production-minimum-32-chars');
    return _jwtSecret;
  }
  
  _jwtSecret = new TextEncoder().encode(secret);
  return _jwtSecret;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createToken(
  userId: string,
  email: string,
  role: string,
  tokenVersion?: number,
): Promise<string> {
  let resolvedTokenVersion = tokenVersion;
  if (resolvedTokenVersion === undefined) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tokenVersion: true },
    });
    resolvedTokenVersion = user?.tokenVersion ?? 0;
  }

  return new SignJWT({
    userId,
    email,
    role,
    tokenVersion: resolvedTokenVersion,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(getJwtSecret());
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, getJwtSecret());
    return verified.payload;
  } catch (error) {
    return null;
  }
}

export async function getUserFromRequest(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload || !payload.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        tokenVersion: true,
      },
    });

    if (!user) return null;

    const tokenVersion = Number(payload.tokenVersion ?? 0);
    if (tokenVersion !== user.tokenVersion) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const user = await getUserFromRequest(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return handler(request, { ...context, user });
  };
}

export function requireAdmin(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    return handler(request, { ...context, user });
  };
}

/**
 * Wrapper to add CSRF protection to mutation endpoints
 */
export function withCsrf(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    // Skip CSRF for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return handler(request, context);
    }

    const headerToken = request.headers.get('x-csrf-token');
    const cookieToken = request.cookies.get('csrf-token')?.value;

    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
      return Response.json({ error: 'Invalid request' }, { status: 403 });
    }

    return handler(request, context);
  };
}

/**
 * Sanitize error messages to prevent information leakage
 */
export function safeError(error: unknown, fallbackMessage = 'An error occurred'): string {
  // In development, return the actual error
  if (process.env.NODE_ENV === 'development' && error instanceof Error) {
    return error.message;
  }
  // In production, return generic message
  return fallbackMessage;
}
