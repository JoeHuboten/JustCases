import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

vi.mock('@/lib/auth-utils', () => ({
  getUserFromRequest: vi.fn(),
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
  getSafeErrorDetails: vi.fn().mockReturnValue('mock error'),
}));

import { withApiGuard } from '@/lib/api-guard';
import { getUserFromRequest } from '@/lib/auth-utils';
import { validateCsrf } from '@/lib/csrf';
import { z } from 'zod';

function makeRequest(method: string, body?: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/test', {
    method,
    headers: { 'content-type': 'application/json' },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}

const mockRateLimiter = vi.fn().mockResolvedValue({ success: true, remaining: 59, reset: Date.now() + 60000 });

describe('withApiGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(validateCsrf).mockReturnValue({ valid: true });
    mockRateLimiter.mockResolvedValue({ success: true, remaining: 59, reset: Date.now() + 60000 });
  });

  it('calls handler when no guards are configured', async () => {
    const handler = vi.fn().mockResolvedValue(NextResponse.json({ ok: true }));
    const guarded = withApiGuard({}, handler);

    const res = await guarded(makeRequest('GET'));
    const data = await res.json();

    expect(handler).toHaveBeenCalled();
    expect(data.ok).toBe(true);
  });

  it('returns 429 when rate limiter rejects', async () => {
    mockRateLimiter.mockResolvedValue({ success: false, remaining: 0, reset: Date.now() + 60000 });
    const handler = vi.fn();
    const guarded = withApiGuard({ rateLimit: mockRateLimiter }, handler);

    const res = await guarded(makeRequest('GET'));

    expect(res.status).toBe(429);
    expect(handler).not.toHaveBeenCalled();
  });

  it('returns 403 when CSRF check fails', async () => {
    vi.mocked(validateCsrf).mockReturnValue({ valid: false, error: 'CSRF token missing' });
    const handler = vi.fn();
    const guarded = withApiGuard({ csrf: true }, handler);

    const res = await guarded(makeRequest('POST'));

    expect(res.status).toBe(403);
    expect(handler).not.toHaveBeenCalled();
  });

  it('returns 401 when requireAuth and user not authenticated', async () => {
    vi.mocked(getUserFromRequest).mockResolvedValue(null);
    const handler = vi.fn();
    const guarded = withApiGuard({ requireAuth: true }, handler);

    const res = await guarded(makeRequest('GET'));

    expect(res.status).toBe(401);
    expect(handler).not.toHaveBeenCalled();
  });

  it('returns 403 when requireAdmin and user is not admin', async () => {
    vi.mocked(getUserFromRequest).mockResolvedValue({
      id: 'user-1',
      email: 'test@test.com',
      role: 'USER',
      emailVerified: true,
    } as any);
    const handler = vi.fn();
    const guarded = withApiGuard({ requireAdmin: true }, handler);

    const res = await guarded(makeRequest('GET'));

    expect(res.status).toBe(403);
    expect(handler).not.toHaveBeenCalled();
  });

  it('passes when requireAdmin and user is admin', async () => {
    vi.mocked(getUserFromRequest).mockResolvedValue({
      id: 'admin-1',
      email: 'admin@test.com',
      role: 'ADMIN',
      emailVerified: true,
    } as any);
    const handler = vi.fn().mockResolvedValue(NextResponse.json({ ok: true }));
    const guarded = withApiGuard({ requireAdmin: true }, handler);

    const res = await guarded(makeRequest('GET'));

    expect(res.status).toBe(200);
    expect(handler).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ user: expect.objectContaining({ role: 'ADMIN' }) }),
    );
  });

  it('returns 403 when requireVerifiedEmail and email not verified', async () => {
    vi.mocked(getUserFromRequest).mockResolvedValue({
      id: 'user-1',
      email: 'test@test.com',
      role: 'USER',
      emailVerified: false,
    } as any);
    const handler = vi.fn();
    const guarded = withApiGuard({ requireAuth: true, requireVerifiedEmail: true }, handler);

    const res = await guarded(makeRequest('GET'));
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.error).toContain('Email verification');
  });

  it('validates body against Zod schema', async () => {
    vi.mocked(getUserFromRequest).mockResolvedValue({
      id: 'user-1',
      email: 'test@test.com',
      role: 'USER',
      emailVerified: true,
    } as any);

    const schema = z.object({
      name: z.string().min(2),
      quantity: z.number().int().positive(),
    });

    const handler = vi.fn().mockResolvedValue(NextResponse.json({ ok: true }));
    const guarded = withApiGuard({ requireAuth: true, bodySchema: schema }, handler);

    const res = await guarded(makeRequest('POST', { name: 'Test', quantity: 5 }));

    expect(res.status).toBe(200);
    expect(handler).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: { name: 'Test', quantity: 5 },
      }),
    );
  });

  it('returns 400 on Zod validation failure', async () => {
    const schema = z.object({
      name: z.string().min(2),
    });

    const handler = vi.fn();
    const guarded = withApiGuard({ bodySchema: schema }, handler);

    const res = await guarded(makeRequest('POST', { name: '' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.details).toBeDefined();
    expect(handler).not.toHaveBeenCalled();
  });

  it('composes multiple guards in correct order', async () => {
    vi.mocked(getUserFromRequest).mockResolvedValue({
      id: 'admin-1',
      email: 'admin@test.com',
      role: 'ADMIN',
      emailVerified: true,
    } as any);

    const schema = z.object({ action: z.string() });
    const handler = vi.fn().mockResolvedValue(NextResponse.json({ ok: true }));

    const guarded = withApiGuard(
      {
        rateLimit: mockRateLimiter,
        csrf: true,
        requireAuth: true,
        requireAdmin: true,
        requireVerifiedEmail: true,
        bodySchema: schema,
      },
      handler,
    );

    const res = await guarded(makeRequest('POST', { action: 'delete' }));

    expect(res.status).toBe(200);
    expect(mockRateLimiter).toHaveBeenCalled();
    expect(validateCsrf).toHaveBeenCalled();
    expect(getUserFromRequest).toHaveBeenCalled();
    expect(handler).toHaveBeenCalled();
  });

  it('returns 500 on unexpected handler error', async () => {
    const handler = vi.fn().mockImplementation(() => { throw new Error('Unexpected crash'); });
    const guarded = withApiGuard({}, handler);

    const res = await guarded(makeRequest('GET'));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
