import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rateLimit } from '@/lib/rate-limit';
import { NextRequest } from 'next/server';

/** Helper to build a minimal NextRequest with the given path and headers. */
function makeRequest(
  path: string,
  headers: Record<string, string> = {},
): NextRequest {
  const url = `http://localhost:3000${path}`;
  return new NextRequest(url, { headers });
}

describe('rateLimit', () => {
  // Each test gets a fresh limiter so state doesn't leak
  let limiter: ReturnType<typeof rateLimit>;

  beforeEach(() => {
    vi.useFakeTimers();
    delete process.env.TRUST_X_FORWARDED_FOR;
    delete process.env.TRUSTED_PROXY_COUNT;
    limiter = rateLimit({ interval: 10_000, maxRequests: 3 });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests within the limit', async () => {
    const req = makeRequest('/api/test', { 'x-real-ip': '1.2.3.4' });
    const r1 = await limiter(req);
    const r2 = await limiter(req);
    const r3 = await limiter(req);
    expect(r1.success).toBe(true);
    expect(r2.success).toBe(true);
    expect(r3.success).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it('blocks after exceeding the limit', async () => {
    const req = makeRequest('/api/test', { 'x-real-ip': '1.2.3.4' });
    await limiter(req);
    await limiter(req);
    await limiter(req);
    const r4 = await limiter(req);
    expect(r4.success).toBe(false);
    expect(r4.remaining).toBe(0);
  });

  it('resets after the interval expires', async () => {
    const req = makeRequest('/api/test', { 'x-real-ip': '1.2.3.4' });
    await limiter(req);
    await limiter(req);
    await limiter(req);
    // Advance past the window
    vi.advanceTimersByTime(11_000);
    const r = await limiter(req);
    expect(r.success).toBe(true);
    expect(r.remaining).toBe(2);
  });

  it('uses pathname not full URL — query variance does not bypass', async () => {
    const req1 = makeRequest('/api/test?a=1', { 'x-real-ip': '5.5.5.5' });
    const req2 = makeRequest('/api/test?a=2', { 'x-real-ip': '5.5.5.5' });
    const req3 = makeRequest('/api/test?a=3', { 'x-real-ip': '5.5.5.5' });

    await limiter(req1);
    await limiter(req2);
    await limiter(req3);
    const r = await limiter(makeRequest('/api/test?a=4', { 'x-real-ip': '5.5.5.5' }));
    expect(r.success).toBe(false);
  });

  it('uses right-most x-forwarded-for IP when explicitly trusted', async () => {
    process.env.TRUST_X_FORWARDED_FOR = 'true';
    process.env.TRUSTED_PROXY_COUNT = '0';

    const req = makeRequest('/api/test', {
      'x-forwarded-for': '10.0.0.1, 192.168.1.1, 172.16.0.1',
    });
    await limiter(req);
    await limiter(req);
    await limiter(req);

    // Different left-side chain entries should not bypass when right-most
    // client IP stays the same.
    const req2 = makeRequest('/api/test', {
      'x-forwarded-for': '203.0.113.7, 172.16.0.1',
    });
    const r = await limiter(req2);
    expect(r.success).toBe(false);
  });

  it('isolates different IPs', async () => {
    const reqA = makeRequest('/api/test', { 'x-real-ip': '8.8.8.8' });
    const reqB = makeRequest('/api/test', { 'x-real-ip': '9.9.9.9' });

    await limiter(reqA);
    await limiter(reqA);
    await limiter(reqA);

    const rB = await limiter(reqB);
    expect(rB.success).toBe(true);
  });
});
