import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    discountCode: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/lib/rate-limit', () => ({
  apiRateLimit: vi.fn().mockResolvedValue({ success: true, remaining: 59, reset: Date.now() + 60000 }),
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

import { POST } from '@/app/api/discount/validate/route';
import { prisma } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rate-limit';
import { validateCsrf } from '@/lib/csrf';

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/discount/validate', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-csrf-token': 'valid-token',
    },
    body: JSON.stringify(body),
  });
}

describe('Discount Validate API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiRateLimit).mockResolvedValue({ success: true, remaining: 59, reset: Date.now() + 60000 });
    vi.mocked(validateCsrf).mockReturnValue({ valid: true });
  });

  it('returns 400 when code is missing', async () => {
    const res = await POST(makeRequest({}));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Discount code is required');
  });

  it('returns 404 for non-existent code', async () => {
    vi.mocked(prisma.discountCode.findUnique).mockResolvedValue(null);

    const res = await POST(makeRequest({ code: 'INVALID' }));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe('Invalid discount code');
  });

  it('returns 400 for inactive code', async () => {
    vi.mocked(prisma.discountCode.findUnique).mockResolvedValue({
      id: 'dc-1',
      code: 'INACTIVE',
      percentage: 15,
      active: false,
      expiresAt: null,
      maxUses: null,
      currentUses: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const res = await POST(makeRequest({ code: 'INACTIVE' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain('not active');
  });

  it('returns 400 for expired code', async () => {
    vi.mocked(prisma.discountCode.findUnique).mockResolvedValue({
      id: 'dc-1',
      code: 'EXPIRED',
      percentage: 10,
      active: true,
      expiresAt: new Date('2020-01-01'),
      maxUses: null,
      currentUses: 0,
    } as any);

    const res = await POST(makeRequest({ code: 'EXPIRED' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain('expired');
  });

  it('returns 400 when max uses reached', async () => {
    vi.mocked(prisma.discountCode.findUnique).mockResolvedValue({
      id: 'dc-1',
      code: 'MAXED',
      percentage: 20,
      active: true,
      expiresAt: null,
      maxUses: 100,
      currentUses: 100,
    } as any);

    const res = await POST(makeRequest({ code: 'MAXED' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain('usage limit');
  });

  it('returns valid discount on success', async () => {
    vi.mocked(prisma.discountCode.findUnique).mockResolvedValue({
      id: 'dc-1',
      code: 'SAVE20',
      percentage: 20,
      active: true,
      expiresAt: new Date('2030-12-31'),
      maxUses: 1000,
      currentUses: 50,
    } as any);

    const res = await POST(makeRequest({ code: 'save20' })); // lowercase input
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.code).toBe('SAVE20');
    expect(data.percentage).toBe(20);
    expect(data.message).toContain('20%');
  });

  it('uppercases the code before lookup', async () => {
    vi.mocked(prisma.discountCode.findUnique).mockResolvedValue(null);

    await POST(makeRequest({ code: 'lowercase' }));

    expect(prisma.discountCode.findUnique).toHaveBeenCalledWith({
      where: { code: 'LOWERCASE' },
    });
  });

  it('returns 429 on rate limit exceeded', async () => {
    vi.mocked(apiRateLimit).mockResolvedValue({ success: false, remaining: 0, reset: Date.now() + 60000 });

    const res = await POST(makeRequest({ code: 'TEST' }));
    expect(res.status).toBe(429);
  });

  it('returns 403 on CSRF failure', async () => {
    vi.mocked(validateCsrf).mockReturnValue({ valid: false, error: 'CSRF token missing' });

    const res = await POST(makeRequest({ code: 'TEST' }));
    expect(res.status).toBe(403);
  });
});
