import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock prisma before importing the module under test
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
}));

import { writeAuditLog, getClientIp } from '@/lib/audit-log';
import { prisma } from '@/lib/prisma';

function makeRequest(
  url: string,
  method: string,
  headers?: Record<string, string>,
): NextRequest {
  return new NextRequest(url, { method, headers });
}

const mockActor = {
  id: 'admin-1',
  email: 'admin@example.com',
  role: 'ADMIN',
};

describe('getClientIp', () => {
  it('returns the first IP from x-forwarded-for', () => {
    const req = makeRequest('http://localhost/api/test', 'GET', {
      'x-forwarded-for': '10.0.0.1, 10.0.0.2',
    });
    expect(getClientIp(req)).toBe('10.0.0.1');
  });

  it('returns x-real-ip when x-forwarded-for is absent', () => {
    const req = makeRequest('http://localhost/api/test', 'GET', {
      'x-real-ip': '192.168.1.5',
    });
    expect(getClientIp(req)).toBe('192.168.1.5');
  });

  it('returns null when no IP headers are present', () => {
    const req = makeRequest('http://localhost/api/test', 'GET');
    expect(getClientIp(req)).toBeNull();
  });

  it('trims whitespace from the extracted IP', () => {
    const req = makeRequest('http://localhost/api/test', 'GET', {
      'x-forwarded-for': '  172.16.0.1  , 10.0.0.1',
    });
    expect(getClientIp(req)).toBe('172.16.0.1');
  });
});

describe('writeAuditLog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.adminAuditLog.create).mockResolvedValue({ id: 'log-1' } as any);
  });

  it('calls prisma.adminAuditLog.create with correct data', async () => {
    const req = makeRequest('http://localhost/api/admin/products', 'POST', {
      'x-forwarded-for': '1.2.3.4',
      'user-agent': 'TestAgent/1.0',
    });

    await writeAuditLog({
      action: 'product.create',
      actor: mockActor,
      request: req,
      targetType: 'product',
      targetId: 'prod-123',
      metadata: { name: 'Test Product' },
    });

    expect(prisma.adminAuditLog.create).toHaveBeenCalledOnce();
    const call = vi.mocked(prisma.adminAuditLog.create).mock.calls[0][0];
    expect(call.data).toMatchObject({
      action: 'product.create',
      actorUserId: 'admin-1',
      actorEmail: 'admin@example.com',
      actorRole: 'ADMIN',
      ipAddress: '1.2.3.4',
      userAgent: 'TestAgent/1.0',
      route: '/api/admin/products',
      method: 'POST',
      targetType: 'product',
      targetId: 'prod-123',
      metadata: { name: 'Test Product' },
    });
  });

  it('does not throw when prisma.adminAuditLog.create rejects', async () => {
    vi.mocked(prisma.adminAuditLog.create).mockRejectedValue(new Error('DB error'));

    const req = makeRequest('http://localhost/api/admin/categories', 'DELETE');

    // Should resolve without throwing
    await expect(
      writeAuditLog({
        action: 'category.delete',
        actor: mockActor,
        request: req,
        targetType: 'category',
        targetId: 'cat-1',
      }),
    ).resolves.toBeUndefined();
  });

  it('stores null for optional fields when not provided', async () => {
    const req = makeRequest('http://localhost/api/admin/orders/1', 'PUT');

    await writeAuditLog({
      action: 'order.update_status',
      actor: mockActor,
      request: req,
    });

    const call = vi.mocked(prisma.adminAuditLog.create).mock.calls[0][0];
    expect(call.data.targetType).toBeNull();
    expect(call.data.targetId).toBeNull();
    expect(call.data.metadata).toBeUndefined();
  });

  it('truncates metadata to MAX_METADATA_KEYS (20) entries', async () => {
    const req = makeRequest('http://localhost/api/admin/products', 'POST');

    // Build an object with 25 keys
    const largeMetadata: Record<string, string> = {};
    for (let i = 0; i < 25; i++) {
      largeMetadata[`key${i}`] = `value${i}`;
    }

    await writeAuditLog({
      action: 'product.create',
      actor: mockActor,
      request: req,
      metadata: largeMetadata,
    });

    const call = vi.mocked(prisma.adminAuditLog.create).mock.calls[0][0];
    expect(Object.keys(call.data.metadata as object)).toHaveLength(20);
  });

  it('truncates user-agent to 500 characters', async () => {
    const longUa = 'A'.repeat(600);
    const req = makeRequest('http://localhost/api/admin/products', 'POST', {
      'user-agent': longUa,
    });

    await writeAuditLog({
      action: 'product.create',
      actor: mockActor,
      request: req,
    });

    const call = vi.mocked(prisma.adminAuditLog.create).mock.calls[0][0];
    expect((call.data.userAgent as string).length).toBe(500);
  });
});
