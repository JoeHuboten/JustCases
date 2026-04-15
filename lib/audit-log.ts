/**
 * Admin Audit Logging — OWASP A09
 *
 * Persists a tamper-evident record of every admin mutation to the
 * AdminAuditLog table so that security incidents can be investigated.
 *
 * Design constraints:
 *  - This function MUST NOT throw. Audit-log failures are captured and
 *    forwarded to the application logger, but they never break the
 *    originating request.
 *  - Metadata is strictly bounded: only scalar primitives (IDs, names,
 *    counts) are stored. Raw request bodies, tokens, passwords, card
 *    numbers, and payment payloads MUST NOT be passed as metadata.
 *  - IP addresses are collected on a best-effort basis and are
 *    informational only — they can be spoofed.
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createLogger } from '@/lib/logger';

const logger = createLogger('audit-log');

// Maximum character length for any individual string metadata value.
const METADATA_STRING_MAX = 200;

export interface AuditActor {
  id: string;
  email: string | null;
  role: string;
}

export interface AuditTarget {
  type: string;
  id: string;
}

export interface LogAdminActionParams {
  /** Short, SCREAMING_SNAKE identifier, e.g. "PRODUCT_CREATE". */
  action: string;
  /** Snapshot of the authenticated admin making the request. */
  actor: AuditActor;
  /** The incoming NextRequest (used for IP / User-Agent extraction). */
  request: NextRequest;
  /** Optional resource the action was performed on. */
  target?: AuditTarget;
  /**
   * Optional small context object.
   * ONLY pass scalar values (strings, numbers, booleans).
   * Arrays and nested objects are silently dropped.
   * Do NOT pass tokens, passwords, raw bodies, or payment data.
   */
  metadata?: Record<string, unknown>;
}

/**
 * Extract the client IP address from well-known proxy headers.
 *
 * We prefer `x-forwarded-for` (first IP in the chain = original client)
 * then fall back to `x-real-ip`. Both are optional / spoofable.
 */
function extractClientIp(request: NextRequest): string | null {
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
 * Strip metadata down to a flat object of safe scalar primitives.
 * Returns null when nothing survives the filter.
 */
function boundMetadata(
  metadata?: Record<string, unknown>,
): Record<string, unknown> | null {
  if (!metadata || Object.keys(metadata).length === 0) return null;

  const bounded: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === 'number' || typeof value === 'boolean') {
      bounded[key] = value;
    } else if (typeof value === 'string') {
      bounded[key] = value.slice(0, METADATA_STRING_MAX);
    } else if (value === null) {
      bounded[key] = null;
    }
    // Silently drop objects and arrays to prevent accidental payload dumps.
  }

  return Object.keys(bounded).length > 0 ? bounded : null;
}

/**
 * Persist an admin audit log entry.
 *
 * Called AFTER the relevant database mutation succeeds so that the audit
 * record only appears when the action actually completed.
 */
export async function logAdminAction({
  action,
  actor,
  request,
  target,
  metadata,
}: LogAdminActionParams): Promise<void> {
  try {
    const ipAddress = extractClientIp(request);
    // Truncate user-agent to avoid unexpectedly large DB writes.
    const userAgent = request.headers.get('user-agent')?.slice(0, 500) ?? null;
    const url = new URL(request.url);
    const safeMetadata = boundMetadata(metadata);

    await prisma.adminAuditLog.create({
      data: {
        action,
        actorUserId: actor.id,
        actorEmail: actor.email ?? 'unknown',
        actorRole: actor.role,
        ipAddress,
        userAgent,
        route: url.pathname,
        method: request.method,
        targetType: target?.type ?? null,
        targetId: target?.id ?? null,
        // Cast required: Prisma Json fields don't accept plain Record<string,unknown>
        // without the InputJsonValue cast, even though they are structurally compatible.
        metadata: safeMetadata as Parameters<typeof prisma.adminAuditLog.create>[0]['data']['metadata'],
      },
    });
  } catch (err) {
    // Audit-log failures must never surface to the caller.
    logger.error('Failed to write admin audit log', {
      action,
      actorUserId: actor.id,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
