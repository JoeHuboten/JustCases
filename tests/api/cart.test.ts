import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock dependencies before importing the module under test
vi.mock('@/lib/prisma', () => ({
  prisma: {
    cartItem: {
      findMany: vi.fn(),
      createMany: vi.fn(),
      deleteMany: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock('@/lib/auth-utils', () => ({
  getUserFromRequest: vi.fn(),
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

import { GET, POST, DELETE } from '@/app/api/cart/route';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth-utils';
import { apiRateLimit } from '@/lib/rate-limit';
import { validateCsrf } from '@/lib/csrf';

function makeRequest(method: string, body?: unknown, headers: Record<string, string> = {}): NextRequest {
  const url = 'http://localhost:3000/api/cart';
  return new NextRequest(url, {
    method,
    headers: {
      'content-type': 'application/json',
      'x-csrf-token': 'valid-token',
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}

describe('Cart API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiRateLimit).mockResolvedValue({ success: true, remaining: 59, reset: Date.now() + 60000 });
    vi.mocked(validateCsrf).mockReturnValue({ valid: true });
  });

  describe('GET /api/cart', () => {
    it('returns empty items when user is not authenticated', async () => {
      vi.mocked(getUserFromRequest).mockResolvedValue(null);
      const req = makeRequest('GET');
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.items).toEqual([]);
    });

    it('returns cart items for authenticated user', async () => {
      vi.mocked(getUserFromRequest).mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        role: 'USER',
        emailVerified: true,
      } as any);

      vi.mocked(prisma.cartItem.findMany).mockResolvedValue([
        {
          id: 'ci-1',
          userId: 'user-1',
          productId: 'prod-1',
          quantity: 2,
          color: 'black',
          size: null,
          createdAt: new Date(),
          product: {
            id: 'prod-1',
            name: 'Test Case',
            price: 25.99,
            oldPrice: null,
            discount: null,
            image: '/img.jpg',
          },
        },
      ] as any);

      const req = makeRequest('GET');
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.items).toHaveLength(1);
      expect(data.items[0].name).toBe('Test Case');
      expect(data.items[0].price).toBe(25.99);
      expect(data.items[0].quantity).toBe(2);
      expect(data.items[0].color).toBe('black');
    });

    it('applies discount to price calculation', async () => {
      vi.mocked(getUserFromRequest).mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        role: 'USER',
        emailVerified: true,
      } as any);

      vi.mocked(prisma.cartItem.findMany).mockResolvedValue([
        {
          id: 'ci-1',
          userId: 'user-1',
          productId: 'prod-1',
          quantity: 1,
          color: null,
          size: null,
          createdAt: new Date(),
          product: {
            id: 'prod-1',
            name: 'Discounted Case',
            price: 40,
            oldPrice: 50,
            discount: 20,
            image: '/img.jpg',
          },
        },
      ] as any);

      const req = makeRequest('GET');
      const res = await GET(req);
      const data = await res.json();

      expect(data.items[0].price).toBe(32); // 40 * (1 - 20/100)
      expect(data.items[0].discount).toBe(20);
    });

    it('returns 429 on rate limit exceeded', async () => {
      vi.mocked(apiRateLimit).mockResolvedValue({ success: false, remaining: 0, reset: Date.now() + 60000 });

      const req = makeRequest('GET');
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(429);
      expect(data.error).toContain('Too many requests');
    });
  });

  describe('POST /api/cart', () => {
    it('returns 401 when not authenticated', async () => {
      vi.mocked(getUserFromRequest).mockResolvedValue(null);

      const req = makeRequest('POST', { items: [], merge: false });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.error).toBe('Not authenticated');
    });

    it('replaces cart when merge=false', async () => {
      vi.mocked(getUserFromRequest).mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        role: 'USER',
        emailVerified: true,
      } as any);
      vi.mocked(prisma.cartItem.deleteMany).mockResolvedValue({ count: 0 });
      vi.mocked(prisma.cartItem.createMany).mockResolvedValue({ count: 2 });

      const items = [
        { id: 'prod-1', quantity: 1, color: 'red' },
        { id: 'prod-2', quantity: 3 },
      ];

      const req = makeRequest('POST', { items, merge: false });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user-1' } });
      expect(prisma.cartItem.createMany).toHaveBeenCalled();
    });

    it('merges cart when merge=true', async () => {
      vi.mocked(getUserFromRequest).mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        role: 'USER',
        emailVerified: true,
      } as any);

      vi.mocked(prisma.cartItem.findMany).mockResolvedValue([
        { id: 'ci-1', productId: 'prod-1', color: 'red', size: null, quantity: 2 },
      ] as any);
      vi.mocked(prisma.$transaction).mockResolvedValue([]);
      vi.mocked(prisma.cartItem.createMany).mockResolvedValue({ count: 1 });

      const items = [
        { id: 'prod-1', quantity: 1, color: 'red' },
        { id: 'prod-2', quantity: 3 },
      ];

      const req = makeRequest('POST', { items, merge: true });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      // Should update existing and create new
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.cartItem.createMany).toHaveBeenCalled();
    });

    it('rejects with 403 on CSRF failure', async () => {
      vi.mocked(validateCsrf).mockReturnValue({ valid: false, error: 'CSRF token missing' });

      const req = makeRequest('POST', { items: [] });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(403);
      expect(data.error).toContain('CSRF');
    });

    it('returns 429 on rate limit exceeded', async () => {
      vi.mocked(apiRateLimit).mockResolvedValue({ success: false, remaining: 0, reset: Date.now() + 60000 });

      const req = makeRequest('POST', { items: [] });
      const res = await POST(req);

      expect(res.status).toBe(429);
    });
  });

  describe('DELETE /api/cart', () => {
    it('clears user cart', async () => {
      vi.mocked(getUserFromRequest).mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        role: 'USER',
        emailVerified: true,
      } as any);
      vi.mocked(prisma.cartItem.deleteMany).mockResolvedValue({ count: 3 });

      const req = makeRequest('DELETE');
      const res = await DELETE(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user-1' } });
    });

    it('returns 401 when not authenticated', async () => {
      vi.mocked(getUserFromRequest).mockResolvedValue(null);

      const req = makeRequest('DELETE');
      const res = await DELETE(req);
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.error).toBe('Not authenticated');
    });

    it('rejects with 403 on CSRF failure', async () => {
      vi.mocked(validateCsrf).mockReturnValue({ valid: false, error: 'CSRF token mismatch' });

      const req = makeRequest('DELETE');
      const res = await DELETE(req);

      expect(res.status).toBe(403);
    });
  });
});
