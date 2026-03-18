import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/database', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth-utils', () => ({
  verifyPassword: vi.fn(),
  createToken: vi.fn().mockResolvedValue('mock-jwt-token'),
}));

vi.mock('@/lib/rate-limit', () => ({
  authRateLimit: vi.fn().mockResolvedValue({ success: true, remaining: 4, reset: Date.now() + 900000 }),
}));

vi.mock('@/lib/validation', () => ({
  emailSchema: {
    safeParse: vi.fn().mockReturnValue({ success: true }),
  },
}));

vi.mock('@/lib/csrf', () => ({
  validateCsrf: vi.fn().mockReturnValue({ valid: true }),
}));

vi.mock('@/lib/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    withRequestId: vi.fn().mockReturnThis(),
  }),
  getRequestId: vi.fn().mockReturnValue('test-request-id'),
  getSafeErrorDetails: vi.fn().mockReturnValue('mock error'),
}));

import { POST } from '@/app/api/auth/signin/route';
import { prisma } from '@/lib/database';
import { verifyPassword, createToken } from '@/lib/auth-utils';
import { authRateLimit } from '@/lib/rate-limit';
import { emailSchema } from '@/lib/validation';
import { validateCsrf } from '@/lib/csrf';

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/auth/signin', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-csrf-token': 'valid-token',
    },
    body: JSON.stringify(body),
  });
}

describe('Auth Signin API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authRateLimit).mockResolvedValue({ success: true, remaining: 4, reset: Date.now() + 900000 });
    vi.mocked(validateCsrf).mockReturnValue({ valid: true });
    vi.mocked(emailSchema.safeParse).mockReturnValue({ success: true } as any);
  });

  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({ password: 'Test1234' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Email and password are required');
  });

  it('returns 400 when password is missing', async () => {
    const res = await POST(makeRequest({ email: 'test@example.com' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Email and password are required');
  });

  it('returns 400 for invalid email format', async () => {
    vi.mocked(emailSchema.safeParse).mockReturnValue({ success: false } as any);

    const res = await POST(makeRequest({ email: 'bad-email', password: 'Test1234' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Invalid email format');
  });

  it('returns 401 when user is not found', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const res = await POST(makeRequest({ email: 'nobody@example.com', password: 'Test1234' }));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('Invalid credentials');
  });

  it('returns 401 when password is wrong', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'USER',
      emailVerified: true,
      tokenVersion: 0,
    } as any);
    vi.mocked(verifyPassword).mockResolvedValue(false);

    const res = await POST(makeRequest({ email: 'test@example.com', password: 'WrongPass1' }));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('Invalid credentials');
  });

  it('returns 403 when email is not verified', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'USER',
      emailVerified: false,
      tokenVersion: 0,
    } as any);
    vi.mocked(verifyPassword).mockResolvedValue(true);

    const res = await POST(makeRequest({ email: 'test@example.com', password: 'Test1234' }));
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.error).toContain('verify your email');
  });

  it('returns success with user data on valid login', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedPassword',
      role: 'USER',
      emailVerified: true,
      tokenVersion: 0,
    } as any);
    vi.mocked(verifyPassword).mockResolvedValue(true);
    vi.mocked(createToken).mockResolvedValue('mock-jwt-token');

    const res = await POST(makeRequest({ email: 'test@example.com', password: 'Test1234' }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user.email).toBe('test@example.com');
    expect(data.user.name).toBe('Test User');
    expect(data.user.id).toBe('user-1');
  });

  it('sets httpOnly auth-token cookie on success', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedPassword',
      role: 'USER',
      emailVerified: true,
      tokenVersion: 0,
    } as any);
    vi.mocked(verifyPassword).mockResolvedValue(true);
    vi.mocked(createToken).mockResolvedValue('mock-jwt-token');

    const res = await POST(makeRequest({ email: 'test@example.com', password: 'Test1234' }));

    const setCookie = res.headers.getSetCookie();
    const authCookie = setCookie.find((c: string) => c.startsWith('auth-token='));
    expect(authCookie).toBeDefined();
    expect(authCookie).toContain('HttpOnly');
    expect(authCookie).toContain('mock-jwt-token');
  });

  it('creates token with tokenVersion', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedPassword',
      role: 'USER',
      emailVerified: true,
      tokenVersion: 5,
    } as any);
    vi.mocked(verifyPassword).mockResolvedValue(true);

    await POST(makeRequest({ email: 'test@example.com', password: 'Test1234' }));

    expect(createToken).toHaveBeenCalledWith('user-1', 'test@example.com', 'USER', 5);
  });

  it('returns 429 on rate limit exceeded', async () => {
    vi.mocked(authRateLimit).mockResolvedValue({ success: false, remaining: 0, reset: Date.now() + 900000 });

    const res = await POST(makeRequest({ email: 'test@example.com', password: 'Test1234' }));
    const data = await res.json();

    expect(res.status).toBe(429);
    expect(data.error).toContain('Too many login attempts');
  });

  it('returns 403 on CSRF validation failure', async () => {
    vi.mocked(validateCsrf).mockReturnValue({ valid: false, error: 'CSRF token missing' });

    const res = await POST(makeRequest({ email: 'test@example.com', password: 'Test1234' }));
    const data = await res.json();

    expect(res.status).toBe(403);
  });
});
