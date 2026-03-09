import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiCache, cacheKeys, cacheTTL } from '@/lib/cache';

describe('SimpleCache (apiCache)', () => {
  beforeEach(() => {
    apiCache.clear();
  });

  it('returns null for missing keys', () => {
    expect(apiCache.get('nonexistent')).toBeNull();
  });

  it('stores and retrieves values', () => {
    apiCache.set('key1', { foo: 'bar' });
    expect(apiCache.get('key1')).toEqual({ foo: 'bar' });
  });

  it('expires entries after TTL (in seconds, NOT milliseconds)', () => {
    vi.useFakeTimers();
    apiCache.set('short', 'data', 2); // 2 seconds
    expect(apiCache.get('short')).toBe('data');

    vi.advanceTimersByTime(1_500); // 1.5 s – still valid
    expect(apiCache.get('short')).toBe('data');

    vi.advanceTimersByTime(1_000); // 2.5 s total – expired
    expect(apiCache.get('short')).toBeNull();
    vi.useRealTimers();
  });

  it('evicts oldest entry when max size is reached', () => {
    // Default maxSize is 100
    for (let i = 0; i < 101; i++) {
      apiCache.set(`k${i}`, i);
    }
    // The first entry should have been evicted
    expect(apiCache.get('k0')).toBeNull();
    expect(apiCache.get('k100')).toBe(100);
  });

  it('deletes by key', () => {
    apiCache.set('a', 1);
    apiCache.delete('a');
    expect(apiCache.get('a')).toBeNull();
  });

  it('deletes by regex pattern', () => {
    apiCache.set('search:foo', 1);
    apiCache.set('search:bar', 2);
    apiCache.set('products:all', 3);
    apiCache.deletePattern('^search:');
    expect(apiCache.get('search:foo')).toBeNull();
    expect(apiCache.get('search:bar')).toBeNull();
    expect(apiCache.get('products:all')).toBe(3);
  });

  it('getOrSet fetches only on cache miss', async () => {
    const fetcher = vi.fn().mockResolvedValue('fetched');
    const v1 = await apiCache.getOrSet('gos', fetcher, 60);
    const v2 = await apiCache.getOrSet('gos', fetcher, 60);
    expect(v1).toBe('fetched');
    expect(v2).toBe('fetched');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});

describe('cacheKeys', () => {
  it('generates deterministic keys', () => {
    expect(cacheKeys.products()).toBe('products:all');
    expect(cacheKeys.products('cat=123')).toBe('products:cat=123');
    expect(cacheKeys.product('my-slug')).toBe('product:my-slug');
    expect(cacheKeys.searchProducts('phone')).toBe('search:phone');
  });
});

describe('cacheTTL', () => {
  it('values are in seconds (not milliseconds)', () => {
    // All TTL values should be reasonable second-scale numbers
    for (const [, value] of Object.entries(cacheTTL)) {
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThan(3600); // under 1 hour
    }
  });
});
