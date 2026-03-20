import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiGuard } from '@/lib/api-guard';
import { apiRateLimit } from '@/lib/rate-limit';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';

const logger = createLogger('api:admin:audit-logs');

// GET - Fetch paginated admin audit logs
export const GET = withApiGuard(
  {
    requireAdmin: true,
    rateLimit: apiRateLimit,
  },
  async (request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
      const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
      const action = searchParams.get('action')?.trim() || undefined;
      const actorUserId = searchParams.get('actorUserId')?.trim() || undefined;
      const targetType = searchParams.get('targetType')?.trim() || undefined;
      const skip = (page - 1) * limit;

      const where = {
        ...(action && { action: { contains: action } }),
        ...(actorUserId && { actorUserId }),
        ...(targetType && { targetType }),
      };

      const [logs, total] = await Promise.all([
        prisma.adminAuditLog.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
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
