/**
 * Integration-level test: verifies that the admin products POST route writes
 * an audit log entry when a product is successfully created (OWASP A09).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Module mocks — vi.mock factories are hoisted, so use vi.fn() inline.
// Access the mocks afterwards via vi.mocked().
// ---------------------------------------------------------------------------

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    adminAuditLog: {
      create: vi.fn().mockResolvedValue({ id: 'log-1' }),
    },
  },
  getPaginationParams: vi.fn().mockReturnValue({ take: 20, skip: 0 }),
}));

vi.mock('@/lib/auth-utils', () => ({
  getUserFromRequest: vi.fn().mockResolvedValue({
    id: 'admin-1',
    email: 'admin@justcases.com',
    role: 'ADMIN',
    emailVerified: true,
  }),
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
  }),
  getSafeErrorDetails: vi.fn().mockReturnValue('mock error'),
}));

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------

import { POST } from '@/app/api/admin/products/route';
import { prisma } from '@/lib/prisma';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const validProductBody = {
  name: 'Test Phone Case',
  slug: 'test-phone-case',
  price: 19.99,
  // Must be a full URL to pass `z.string().url()`
  image: 'https://cdn.example.com/images/test.jpg',
  images: 'https://cdn.example.com/images/test.jpg',
  // Must be a valid cuid to pass `z.string().cuid()`
  categoryId: 'clq1234567890abcdefghijklm',
  colors: 'black',
  sizes: 'M',
  inStock: true,
};

function makeAdminRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/admin/products', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-csrf-token': 'valid-token',
      'x-forwarded-for': '10.0.0.1',
    },
    body: JSON.stringify(body),
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('POST /api/admin/products — audit logging', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.adminAuditLog.create).mockResolvedValue({ id: 'log-1' } as never);
    vi.mocked(prisma.product.findUnique).mockResolvedValue(null); // no slug conflict
    vi.mocked(prisma.product.create).mockResolvedValue({
      id: 'prod-new-1',
      ...validProductBody,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);
  });

  it('writes a PRODUCT_CREATE audit log on successful creation', async () => {
    const res = await POST(makeAdminRequest(validProductBody));
    expect(res.status).toBe(201);

    expect(prisma.adminAuditLog.create).toHaveBeenCalledOnce();
    const auditData = vi.mocked(prisma.adminAuditLog.create).mock.calls[0][0].data;
    expect(auditData.action).toBe('PRODUCT_CREATE');
    expect(auditData.actorUserId).toBe('admin-1');
    expect(auditData.actorEmail).toBe('admin@justcases.com');
    expect(auditData.targetType).toBe('Product');
    expect(auditData.method).toBe('POST');
    expect(auditData.route).toBe('/api/admin/products');
  });

  it('does NOT write an audit log when slug already exists (no creation)', async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue({ id: 'existing-prod' } as never);

    const res = await POST(makeAdminRequest(validProductBody));
    expect(res.status).toBe(400);
    expect(prisma.adminAuditLog.create).not.toHaveBeenCalled();
  });

  it('still returns 500 and does not expose internals when prisma.product.create fails', async () => {
    vi.mocked(prisma.product.create).mockRejectedValue(new Error('DB error'));

    const res = await POST(makeAdminRequest(validProductBody));
    expect(res.status).toBe(500);

    const body = await res.json();
    expect(body.error).toBe('Failed to create product');
    // Audit log should not have been called (action did not succeed).
    expect(prisma.adminAuditLog.create).not.toHaveBeenCalled();
  });
});
