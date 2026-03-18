import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth-utils', () => ({
  getUserFromRequest: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  apiRateLimit: vi.fn().mockResolvedValue({ success: true, remaining: 59, reset: Date.now() + 60000 }),
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

import { GET } from '@/app/api/orders/route';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth-utils';
import { apiRateLimit } from '@/lib/rate-limit';

function makeRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL('http://localhost:3000/api/orders');
  for (const [key, val] of Object.entries(params)) {
    url.searchParams.set(key, val);
  }
  return new NextRequest(url);
}

const mockOrders = [
  {
    id: 'order-1',
    total: 49.99,
    subtotal: 45.99,
    deliveryFee: 4.0,
    discount: 0,
    status: 'PENDING',
    trackingNumber: null,
    courierService: null,
    estimatedDelivery: null,
    createdAt: new Date('2025-01-15'),
    items: [
      {
        id: 'oi-1',
        quantity: 2,
        price: 22.99,
        color: 'black',
        size: null,
        product: {
          id: 'prod-1',
          name: 'Phone Case',
          image: '/img.jpg',
          slug: 'phone-case',
          category: { id: 'cat-1', name: 'Cases' },
        },
      },
    ],
  },
];

describe('Orders API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiRateLimit).mockResolvedValue({ success: true, remaining: 59, reset: Date.now() + 60000 });
  });

  describe('GET /api/orders', () => {
    it('returns 401 when user is not authenticated', async () => {
      vi.mocked(getUserFromRequest).mockResolvedValue(null);

      const res = await GET(makeRequest());
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('returns paginated orders for authenticated user', async () => {
      vi.mocked(getUserFromRequest).mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        role: 'USER',
        emailVerified: true,
      } as any);

      vi.mocked(prisma.order.findMany).mockResolvedValue(mockOrders as any);
      vi.mocked(prisma.order.count).mockResolvedValue(1);

      const res = await GET(makeRequest());
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.items).toHaveLength(1);
      expect(data.total).toBe(1);
      expect(data.page).toBe(1);
      expect(data.totalPages).toBe(1);
      expect(data.items[0].id).toBe('order-1');
      expect(data.items[0].status).toBe('PENDING');
    });

    it('handles pagination parameters', async () => {
      vi.mocked(getUserFromRequest).mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        role: 'USER',
        emailVerified: true,
      } as any);
      vi.mocked(prisma.order.findMany).mockResolvedValue([]);
      vi.mocked(prisma.order.count).mockResolvedValue(60);

      const res = await GET(makeRequest({ page: '2', limit: '10' }));
      const data = await res.json();

      expect(data.page).toBe(2);
      expect(data.limit).toBe(10);
      expect(data.totalPages).toBe(6);

      // Verify that skip was calculated correctly for page 2
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });

    it('clamps limit to max 50', async () => {
      vi.mocked(getUserFromRequest).mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        role: 'USER',
        emailVerified: true,
      } as any);
      vi.mocked(prisma.order.findMany).mockResolvedValue([]);
      vi.mocked(prisma.order.count).mockResolvedValue(0);

      const res = await GET(makeRequest({ limit: '999' }));
      const data = await res.json();

      expect(data.limit).toBe(50);
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 50 }),
      );
    });

    it('returns 429 on rate limit exceeded', async () => {
      vi.mocked(apiRateLimit).mockResolvedValue({ success: false, remaining: 0, reset: Date.now() + 60000 });

      const res = await GET(makeRequest());
      expect(res.status).toBe(429);
    });

    it('returns 500 on database error', async () => {
      vi.mocked(getUserFromRequest).mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        role: 'USER',
        emailVerified: true,
      } as any);
      vi.mocked(prisma.order.findMany).mockRejectedValue(new Error('DB connection lost'));

      const res = await GET(makeRequest());
      const data = await res.json();

      expect(res.status).toBe(500);
      expect(data.error).toBe('Failed to fetch orders');
    });

    it('only returns orders belonging to the authenticated user', async () => {
      const user = {
        id: 'user-1',
        email: 'test@test.com',
        role: 'USER',
        emailVerified: true,
      };
      vi.mocked(getUserFromRequest).mockResolvedValue(user as any);
      vi.mocked(prisma.order.findMany).mockResolvedValue([]);
      vi.mocked(prisma.order.count).mockResolvedValue(0);

      await GET(makeRequest());

      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1' },
        }),
      );
      expect(prisma.order.count).toHaveBeenCalledWith({ where: { userId: 'user-1' } });
    });
  });
});
