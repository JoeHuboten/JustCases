import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock prisma before importing audit-log
vi.mock('@/lib/prisma', () => ({
  prisma: {
    adminAuditLog: {
      create: vi.fn().mockResolvedValue({ id: 'audit-1' }),
    },
  },
  getPaginationParams: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  createLogger: () => ({
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  }),
}));

import { logAdminAction } from '@/lib/audit-log';
import { prisma } from '@/lib/prisma';

function makeRequest(overrides: Partial<{
  url: string;
  method: string;
  headers: Record<string, string>;
}> = {}): Request {
  const url = overrides.url ?? 'http://localhost/api/admin/products';
  const method = overrides.method ?? 'POST';
  const headers = new Headers(overrides.headers ?? {});
  return new Request(url, { method, headers });
}

const actor = {
  id: 'user-1',
  email: 'admin@example.com',
  role: 'ADMIN',
};

describe('logAdminAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('writes an audit log entry with correct core fields', async () => {
    const request = makeRequest();
    await logAdminAction({ action: 'product.create', actor, request });

    expect(prisma.adminAuditLog.create).toHaveBeenCalledOnce();
    const data = (prisma.adminAuditLog.create as ReturnType<typeof vi.fn>).mock.calls[0][0].data;

    expect(data.action).toBe('product.create');
    expect(data.actorUserId).toBe('user-1');
    expect(data.actorEmail).toBe('admin@example.com');
    expect(data.actorRole).toBe('ADMIN');
    expect(data.route).toBe('/api/admin/products');
    expect(data.method).toBe('POST');
  });

  it('captures target type and id', async () => {
    const request = makeRequest();
    await logAdminAction({
      action: 'product.delete',
      actor,
      request,
      target: { type: 'Product', id: 'prod-42' },
    });

    const data = (prisma.adminAuditLog.create as ReturnType<typeof vi.fn>).mock.calls[0][0].data;
    expect(data.targetType).toBe('Product');
    expect(data.targetId).toBe('prod-42');
  });

  it('extracts IP from x-forwarded-for header (first entry)', async () => {
    const request = makeRequest({
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    });
    await logAdminAction({ action: 'order.update', actor, request });

    const data = (prisma.adminAuditLog.create as ReturnType<typeof vi.fn>).mock.calls[0][0].data;
    expect(data.ipAddress).toBe('1.2.3.4');
  });

  it('falls back to x-real-ip when x-forwarded-for is absent', async () => {
    const request = makeRequest({ headers: { 'x-real-ip': '9.9.9.9' } });
    await logAdminAction({ action: 'category.delete', actor, request });

    const data = (prisma.adminAuditLog.create as ReturnType<typeof vi.fn>).mock.calls[0][0].data;
    expect(data.ipAddress).toBe('9.9.9.9');
  });

  it('stores null ipAddress when no IP header is present', async () => {
    const request = makeRequest();
    await logAdminAction({ action: 'category.create', actor, request });

    const data = (prisma.adminAuditLog.create as ReturnType<typeof vi.fn>).mock.calls[0][0].data;
    expect(data.ipAddress).toBeNull();
  });

  it('stores metadata when provided', async () => {
    const request = makeRequest();
    await logAdminAction({
      action: 'product.create',
      actor,
      request,
      metadata: { name: 'Test Product', slug: 'test-product' },
    });

    const data = (prisma.adminAuditLog.create as ReturnType<typeof vi.fn>).mock.calls[0][0].data;
    expect(data.metadata).toMatchObject({ name: 'Test Product', slug: 'test-product' });
  });

  it('stores null metadata when not provided', async () => {
    const request = makeRequest();
    await logAdminAction({ action: 'discount_code.delete', actor, request });

    const data = (prisma.adminAuditLog.create as ReturnType<typeof vi.fn>).mock.calls[0][0].data;
    expect(data.metadata).toBeNull();
  });

  it('does not throw when prisma.create rejects', async () => {
    (prisma.adminAuditLog.create as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('DB connection lost'),
    );

    const request = makeRequest();
    // Must resolve without throwing
    await expect(
      logAdminAction({ action: 'order.delete', actor, request }),
    ).resolves.toBeUndefined();
  });
});
