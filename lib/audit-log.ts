/**
 * Admin audit logging utility for Just Cases
 * Records admin actions for OWASP A09 compliance (Security Logging and Monitoring)
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createLogger } from '@/lib/logger';

const logger = createLogger('audit-log');

export interface AuditActor {
  id: string;
  email: string;
  role: string;
}

export interface AuditTarget {
  type: string;
  id?: string;
}

export interface LogAdminActionParams {
  action: string;
  actor: AuditActor;
  request: NextRequest;
  target?: AuditTarget;
  metadata?: Record<string, unknown>;
}

/**
 * Safely extract the client IP address from a request.
 * Prefers the first entry in X-Forwarded-For (set by proxies/load balancers),
 * then falls back to other standard headers.
 */
function extractIpAddress(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0].trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return null;
}

/**
 * Log an admin action to persistent storage.
 * This function never throws — failures are caught and logged via the
 * existing structured logger so they never interrupt the main request.
 */
export async function logAdminAction({
  action,
  actor,
  request,
  target,
  metadata,
}: LogAdminActionParams): Promise<void> {
  try {
    const ipAddress = extractIpAddress(request);
    const userAgent = request.headers.get('user-agent') ?? null;
    const route = new URL(request.url).pathname;
    const method = request.method;

    // Bound metadata to prevent excessively large payloads (4 KB limit)
    let safeMeta: Record<string, unknown> | null = null;
    if (metadata !== undefined) {
      const serialized = JSON.stringify(metadata);
      safeMeta = serialized.length <= 4096 ? metadata : null;
    }

    await prisma.adminAuditLog.create({
      data: {
        action,
        actorUserId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        ipAddress,
        userAgent,
        route,
        method,
        targetType: target?.type ?? null,
        targetId: target?.id ?? null,
        metadata: safeMeta,
      },
    });
  } catch (err) {
    // Audit log failures must never break the main request
    logger.error('Failed to write admin audit log', { error: String(err) });
  }
}
