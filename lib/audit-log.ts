/**
 * Admin audit logging utility (A09 – Security Logging & Monitoring)
 *
 * Writes a record to AdminAuditLog for every sensitive admin action.
 * This function is designed to be fire-and-forget: it must not throw or
 * interrupt the main request flow. Any database error is swallowed and
 * emitted through the existing structured logger instead.
 */

import { prisma } from '@/lib/prisma';
import { createLogger } from '@/lib/logger';
import { NextRequest } from 'next/server';

const logger = createLogger('audit-log');

/** Maximum number of characters stored for the User-Agent header. */
const MAX_USER_AGENT_LENGTH = 500;

/** Maximum number of keys allowed in the metadata object. */
const MAX_METADATA_KEYS = 20;

export interface AuditActor {
  id: string;
  email: string;
  role: string;
}

export interface AuditLogParams {
  /** Dot-separated action identifier, e.g. "product.create". */
  action: string;
  actor: AuditActor;
  request: NextRequest;
  /** The type of the resource being acted upon, e.g. "product". */
  targetType?: string;
  /** The ID of the resource being acted upon. */
  targetId?: string;
  /** Bounded key/value metadata (no secrets, no large payloads). */
  metadata?: Record<string, unknown>;
}

/**
 * Extract the real client IP address from the request, respecting common
 * reverse-proxy headers (x-forwarded-for, x-real-ip).
 */
export function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for may be a comma-separated list; take the first entry.
    const first = forwarded.split(',')[0].trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip') || null;
}

/**
 * Clamp metadata to a bounded object to avoid storing huge payloads.
 * Only the first MAX_METADATA_KEYS keys are retained.
 */
function sanitizeMetadata(
  metadata: Record<string, unknown>,
): Record<string, unknown> {
  const keys = Object.keys(metadata).slice(0, MAX_METADATA_KEYS);
  const result: Record<string, unknown> = {};
  for (const key of keys) {
    result[key] = metadata[key];
  }
  return result;
}

/**
 * Write an admin audit log entry.
 *
 * Failures are silently logged via the structured logger so that the main
 * request handler is never interrupted.
 */
export async function writeAuditLog(params: AuditLogParams): Promise<void> {
  try {
    const { action, actor, request, targetType, targetId, metadata } = params;
    const url = new URL(request.url);

    await prisma.adminAuditLog.create({
      data: {
        action,
        actorUserId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        ipAddress: getClientIp(request),
        userAgent:
          request.headers.get('user-agent')?.slice(0, MAX_USER_AGENT_LENGTH) ??
          null,
        route: url.pathname,
        method: request.method,
        targetType: targetType ?? null,
        targetId: targetId ?? null,
        metadata: metadata ? sanitizeMetadata(metadata) : undefined,
      },
    });
  } catch (error) {
    logger.error('Failed to write audit log entry', { error });
  }
}
