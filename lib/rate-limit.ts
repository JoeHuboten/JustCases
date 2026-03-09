import { NextRequest } from 'next/server';
import { isIP } from 'node:net';
import crypto from 'crypto';

/**
 * Distributed-first rate limiter:
 * - Uses Upstash Redis REST when configured.
 * - Falls back to in-memory store for local development/tests.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitEntry>();
const MAX_STORE_SIZE = 10_000;
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

export interface RateLimitOptions {
  interval: number;
  maxRequests: number;
  failClosedOnRedisError?: boolean;
}

function ensureCleanupTimer() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryStore) {
      if (now > entry.resetTime) memoryStore.delete(key);
    }
    if (memoryStore.size === 0 && cleanupTimer) {
      clearInterval(cleanupTimer);
      cleanupTimer = null;
    }
  }, 60_000);
  if (typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    (cleanupTimer as NodeJS.Timeout).unref();
  }
}

function stripPort(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  // [IPv6]:port
  if (trimmed.startsWith('[')) {
    const closing = trimmed.indexOf(']');
    if (closing > 1) {
      return trimmed.slice(1, closing);
    }
    return trimmed;
  }

  // IPv4:port
  const ipv4WithPort = trimmed.match(/^(\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?$/);
  if (ipv4WithPort) {
    return ipv4WithPort[1];
  }

  return trimmed;
}

function normalizeIp(raw: string | null): string | null {
  if (!raw) return null;
  const candidate = stripPort(raw);
  return isIP(candidate) ? candidate : null;
}

function parseForwardedChain(forwarded: string): string[] {
  return forwarded
    .split(',')
    .map((entry) => normalizeIp(entry))
    .filter((entry): entry is string => Boolean(entry));
}

function getTrustedForwardedClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (!forwarded) return null;

  const trustXForwardedFor = process.env.TRUST_X_FORWARDED_FOR === 'true';
  if (!trustXForwardedFor) return null;

  const chain = parseForwardedChain(forwarded);
  if (chain.length === 0) return null;

  const configuredTrustedHops = Number.parseInt(process.env.TRUSTED_PROXY_COUNT || '0', 10);
  const trustedHops = Number.isFinite(configuredTrustedHops) && configuredTrustedHops >= 0
    ? configuredTrustedHops
    : 0;

  // Use right-most address by default. If additional trusted proxies are in
  // front of the app, step left by TRUSTED_PROXY_COUNT.
  const index = Math.max(0, chain.length - 1 - trustedHops);
  return chain[index] || null;
}

function getClientIp(request: NextRequest): string {
  // Prefer proxy-managed single-IP headers that are harder to spoof.
  const directIp =
    normalizeIp(request.headers.get('cf-connecting-ip')) ||
    normalizeIp(request.headers.get('true-client-ip')) ||
    normalizeIp(request.headers.get('x-real-ip')) ||
    normalizeIp(request.headers.get('x-vercel-forwarded-for'));
  if (directIp) return directIp;

  const forwardedIp = getTrustedForwardedClientIp(request);
  if (forwardedIp) return forwardedIp;

  return 'unknown';
}

function getRouteKey(request: NextRequest): string {
  try {
    return new URL(request.url).pathname;
  } catch {
    return request.url;
  }
}

function getLimiterKey(request: NextRequest): string {
  const clientIp = getClientIp(request);
  const route = getRouteKey(request);

  if (clientIp !== 'unknown') {
    return `ip:${clientIp}:${route}`;
  }

  // If IP is unavailable, fall back to a stable anonymous fingerprint to
  // avoid global "unknown" collisions.
  const authToken = request.cookies.get('auth-token')?.value;
  if (authToken) {
    const tokenHash = crypto.createHash('sha256').update(authToken).digest('hex').slice(0, 16);
    return `auth:${tokenHash}:${route}`;
  }

  const userAgent = request.headers.get('user-agent') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  const fingerprintSource = `${userAgent}|${acceptLanguage}`.trim();
  if (!fingerprintSource) {
    return `anon:unknown:${route}`;
  }

  const anonHash = crypto.createHash('sha256').update(fingerprintSource).digest('hex').slice(0, 16);
  return `anon:${anonHash}:${route}`;
}

function shouldFailClosed(request: NextRequest, options: RateLimitOptions): boolean {
  if (!options.failClosedOnRedisError) return false;
  if (process.env.RATE_LIMIT_FAIL_CLOSED !== 'true') return false;
  if (process.env.NODE_ENV !== 'production') return false;

  const route = getRouteKey(request);
  return (
    route.startsWith('/api/auth') ||
    route.startsWith('/api/payment') ||
    route.startsWith('/api/internal')
  );
}

async function callRedisCommand(command: unknown[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Redis is not configured');

  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([command]),
    // Keep this request out of Next.js caching.
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Redis request failed with ${res.status}`);
  }

  const data = await res.json();
  return data?.[0]?.result;
}

function isRedisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function distributedRateLimit(
  key: string,
  options: RateLimitOptions,
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const namespaced = `rl:${key}`;
  const now = Date.now();

  // Increment and set expiry if first hit.
  const currentCountRaw = await callRedisCommand(['INCR', namespaced]);
  const currentCount = Number(currentCountRaw || 0);
  if (currentCount === 1) {
    await callRedisCommand(['PEXPIRE', namespaced, options.interval]);
  }

  const pttlRaw = await callRedisCommand(['PTTL', namespaced]);
  const pttl = Math.max(0, Number(pttlRaw || 0));
  const reset = now + pttl;

  if (currentCount > options.maxRequests) {
    return { success: false, remaining: 0, reset };
  }

  return {
    success: true,
    remaining: Math.max(0, options.maxRequests - currentCount),
    reset,
  };
}

function memoryRateLimit(
  key: string,
  options: RateLimitOptions,
): { success: boolean; remaining: number; reset: number } {
  ensureCleanupTimer();
  const now = Date.now();

  const existing = memoryStore.get(key);
  if (existing && now > existing.resetTime) {
    memoryStore.delete(key);
  }

  const entry = memoryStore.get(key);
  if (!entry) {
    if (memoryStore.size >= MAX_STORE_SIZE) {
      let oldestKey: string | null = null;
      let oldestReset = Infinity;
      for (const [k, v] of memoryStore) {
        if (now > v.resetTime) {
          memoryStore.delete(k);
          oldestKey = null;
          break;
        }
        if (v.resetTime < oldestReset) {
          oldestReset = v.resetTime;
          oldestKey = k;
        }
      }
      if (memoryStore.size >= MAX_STORE_SIZE && oldestKey) {
        memoryStore.delete(oldestKey);
      }
    }

    const reset = now + options.interval;
    memoryStore.set(key, { count: 1, resetTime: reset });
    return { success: true, remaining: options.maxRequests - 1, reset };
  }

  if (entry.count >= options.maxRequests) {
    return { success: false, remaining: 0, reset: entry.resetTime };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: options.maxRequests - entry.count,
    reset: entry.resetTime,
  };
}

export function rateLimit(options: RateLimitOptions) {
  return async (
    request: NextRequest,
  ): Promise<{ success: boolean; remaining: number; reset: number }> => {
    const key = getLimiterKey(request);
    if (isRedisConfigured()) {
      try {
        return await distributedRateLimit(key, options);
      } catch {
        if (shouldFailClosed(request, options)) {
          return { success: false, remaining: 0, reset: Date.now() + options.interval };
        }
        // Fallback to local store if Redis is temporarily unavailable.
      }
    }
    return memoryRateLimit(key, options);
  };
}

export const authRateLimit = rateLimit({
  interval: 15 * 60 * 1000,
  maxRequests: 5,
  failClosedOnRedisError: true,
});

export const apiRateLimit = rateLimit({
  interval: 60 * 1000,
  maxRequests: 60,
});

export const strictRateLimit = rateLimit({
  interval: 60 * 1000,
  maxRequests: 10,
  failClosedOnRedisError: true,
});
