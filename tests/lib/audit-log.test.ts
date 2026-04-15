import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Module mocks — must be hoisted above imports of the modules under test.
// ---------------------------------------------------------------------------

vi.mock('@/lib/prisma', () => ({
  prisma: {
    adminAuditLog: {
      create: vi.fn().mockResolvedValue({ id: 'log-1' }),
    },
  },
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

import { logAdminAction } from '@/lib/audit-log';
import { prisma } from '@/lib/prisma';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(
  method = 'POST',
  url = 'http://localhost:3000/api/admin/products',
  extraHeaders: Record<string, string> = {},
): NextRequest {
  return new NextRequest(url, {
    method,
    headers: {
      'user-agent': 'TestAgent/1.0',
      'x-forwarded-for': '1.2.3.4',
      ...extraHeaders,
    },
  });
}

const actor = {
  id: 'admin-1',
  email: 'admin@example.com',
  role: 'ADMIN',
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('logAdminAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.adminAuditLog.create).mockResolvedValue({ id: 'log-1' } as never);
  });

  it('writes an audit log entry with correct core fields', async () => {
    await logAdminAction({
      action: 'PRODUCT_CREATE',
      actor,
      request: makeRequest(),
    });

    expect(prisma.adminAuditLog.create).toHaveBeenCalledOnce();
    const data = vi.mocked(prisma.adminAuditLog.create).mock.calls[0][0].data;
    expect(data.action).toBe('PRODUCT_CREATE');
    expect(data.actorUserId).toBe('admin-1');
    expect(data.actorEmail).toBe('admin@example.com');
    expect(data.actorRole).toBe('ADMIN');
    expect(data.route).toBe('/api/admin/products');
    expect(data.method).toBe('POST');
  });

  it('extracts the first IP from a multi-hop x-forwarded-for header', async () => {
    await logAdminAction({
      action: 'PRODUCT_CREATE',
      actor,
      request: makeRequest('POST', 'http://localhost/', { 'x-forwarded-for': '1.2.3.4, 5.6.7.8, 9.9.9.9' }),
    });

    const data = vi.mocked(prisma.adminAuditLog.create).mock.calls[0][0].data;
    expect(data.ipAddress).toBe('1.2.3.4');
  });

  it('falls back to x-real-ip when x-forwarded-for is absent', async () => {
    // Build a request that has x-real-ip but no x-forwarded-for.
    const req = new NextRequest('http://localhost/', {
      method: 'POST',
      headers: { 'x-real-ip': '9.9.9.9', 'user-agent': 'TestAgent/1.0' },
    });
    await logAdminAction({ action: 'PRODUCT_CREATE', actor, request: req });

    const data = vi.mocked(prisma.adminAuditLog.create).mock.calls[0][0].data;
    expect(data.ipAddress).toBe('9.9.9.9');
  });

  it('records target type and id when provided', async () => {
    await logAdminAction({
      action: 'PRODUCT_DELETE',
      actor,
      request: makeRequest('DELETE'),
      target: { type: 'Product', id: 'prod-xyz' },
    });

    const data = vi.mocked(prisma.adminAuditLog.create).mock.calls[0][0].data;
    expect(data.targetType).toBe('Product');
    expect(data.targetId).toBe('prod-xyz');
  });

  it('passes null targetType/targetId when no target is provided', async () => {
    await logAdminAction({ action: 'PRODUCT_CREATE', actor, request: makeRequest() });

    const data = vi.mocked(prisma.adminAuditLog.create).mock.calls[0][0].data;
    expect(data.targetType).toBeNull();
    expect(data.targetId).toBeNull();
  });

  it('bounds metadata — keeps scalar primitives, drops objects and arrays', async () => {
    await logAdminAction({
      action: 'PRODUCT_UPDATE',
      actor,
      request: makeRequest('PUT'),
      metadata: {
        name: 'Widget',
        price: 49.99,
        active: true,
        nullVal: null,
        nested: { deep: 'dropped' },
        arr: [1, 2, 3],
      },
    });

    const data = vi.mocked(prisma.adminAuditLog.create).mock.calls[0][0].data;
    expect(data.metadata).toEqual({ name: 'Widget', price: 49.99, active: true, nullVal: null });
  });

  it('truncates string metadata values that exceed 200 characters', async () => {
    const longString = 'x'.repeat(300);
    await logAdminAction({
      action: 'PRODUCT_UPDATE',
      actor,
      request: makeRequest(),
      metadata: { description: longString },
    });

    const data = vi.mocked(prisma.adminAuditLog.create).mock.calls[0][0].data;
    expect((data.metadata as Record<string, unknown>).description).toHaveLength(200);
  });

  it('stores no payload when no metadata is provided', async () => {
    await logAdminAction({ action: 'PRODUCT_CREATE', actor, request: makeRequest() });

    const data = vi.mocked(prisma.adminAuditLog.create).mock.calls[0][0].data;
    // null or undefined — either way, no payload is dumped.
    expect(data.metadata == null).toBe(true);
  });

  it('does NOT throw when prisma.adminAuditLog.create rejects', async () => {
    vi.mocked(prisma.adminAuditLog.create).mockRejectedValue(new Error('DB unavailable'));

    await expect(
      logAdminAction({ action: 'PRODUCT_CREATE', actor, request: makeRequest() }),
    ).resolves.not.toThrow();
  });

  it('uses "unknown" email when actor.email is null', async () => {
    await logAdminAction({
      action: 'PRODUCT_CREATE',
      actor: { ...actor, email: null },
      request: makeRequest(),
    });

    const data = vi.mocked(prisma.adminAuditLog.create).mock.calls[0][0].data;
    expect(data.actorEmail).toBe('unknown');
  });
});
