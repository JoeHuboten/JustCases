import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiGuard } from '@/lib/api-guard';
import { apiRateLimit } from '@/lib/rate-limit';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';
import { Prisma } from '@prisma/client';

const logger = createLogger('api:admin:audit-logs');

// Maximum records per page for the audit log viewer.
const MAX_PAGE_SIZE = 50;

/**
 * GET /api/admin/audit-logs
 *
 * Paginated, newest-first listing of admin audit log entries.
 * Supports optional filtering by action, actorUserId, and date range.
 *
 * Query params:
 *   page        (default 1)
 *   limit       (default 25, max 50)
 *   action      e.g. PRODUCT_CREATE
 *   actorUserId admin user ID to filter by
 *   from        ISO date string (inclusive lower bound on createdAt)
 *   to          ISO date string (inclusive upper bound on createdAt)
 */
export const GET = withApiGuard(
  {
    requireAdmin: true,
    rateLimit: apiRateLimit,
  },
  async (request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url);

      const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
      const limit = Math.min(
        MAX_PAGE_SIZE,
        Math.max(1, parseInt(searchParams.get('limit') ?? '25', 10)),
      );
      const skip = (page - 1) * limit;

      const action = searchParams.get('action')?.trim() || undefined;
      const actorUserId = searchParams.get('actorUserId')?.trim() || undefined;
      const from = searchParams.get('from');
      const to = searchParams.get('to');

      const where: Prisma.AdminAuditLogWhereInput = {};

      if (action) {
        where.action = { contains: action, mode: 'insensitive' };
      }

      if (actorUserId) {
        where.actorUserId = actorUserId;
      }

      if (from || to) {
        where.createdAt = {
          ...(from ? { gte: new Date(from) } : {}),
          ...(to ? { lte: new Date(to) } : {}),
        };
      }

      const [logs, total] = await Promise.all([
        prisma.adminAuditLog.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
          // Never expose metadata that could include sensitive details in bulk
          // listings — return the bounded summary fields only.
          select: {
            id: true,
            createdAt: true,
            action: true,
            actorUserId: true,
            actorEmail: true,
            actorRole: true,
            ipAddress: true,
            route: true,
            method: true,
            targetType: true,
            targetId: true,
            // userAgent and metadata are omitted from list view to keep the
            // payload small; they can be added to a future detail endpoint.
          },
        }),
        prisma.adminAuditLog.count({ where }),
      ]);

      return NextResponse.json({
        logs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      logger.error('Failed to fetch audit logs', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to fetch audit logs' },
        { status: 500 },
      );
    }
  },
);
