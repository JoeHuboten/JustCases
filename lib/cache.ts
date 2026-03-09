/**
 * Simple in-memory cache for API routes
 * Use for data that doesn't change frequently
 */

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private maxSize = 100;

  private isRedisConfigured(): boolean {
    return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
  }

  private async callRedisCommand(command: unknown[]): Promise<unknown> {
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
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`Redis request failed with ${res.status}`);
    const data = await res.json();
    return data?.[0]?.result;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  async getDistributed<T>(key: string): Promise<T | null> {
    if (this.isRedisConfigured()) {
      try {
        const redisValue = await this.callRedisCommand(['GET', key]);
        if (typeof redisValue === 'string') {
          return JSON.parse(redisValue) as T;
        }
      } catch {
        // Fallback to local cache.
      }
    }
    return this.get<T>(key);
  }

  /**
   * Store a value in the cache.
   * @param key   Cache key
   * @param data  Data to cache
   * @param ttlSeconds  Time-to-live **in seconds** (default 60)
   */
  set<T>(key: string, data: T, ttlSeconds: number = 60): void {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      expiry: Date.now() + (ttlSeconds * 1000),
    });
  }

  async setDistributed<T>(key: string, data: T, ttlSeconds: number = 60): Promise<void> {
    this.set(key, data, ttlSeconds);
    if (this.isRedisConfigured()) {
      try {
        await this.callRedisCommand(['SETEX', key, ttlSeconds, JSON.stringify(data)]);
      } catch {
        // Best-effort remote cache write.
      }
    }
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  deletePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  // Get or set pattern - fetch if not cached
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds: number = 60
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;

    const data = await fetcher();
    this.set(key, data, ttlSeconds);
    return data;
  }
}

// Export singleton instance
export const apiCache = new SimpleCache();

// Cache key generators
export const cacheKeys = {
  products: (params?: string) => `products:${params || 'all'}`,
  product: (slug: string) => `product:${slug}`,
  categories: () => 'categories:all',
  category: (slug: string) => `category:${slug}`,
  featuredProducts: () => 'products:featured',
  searchProducts: (query: string) => `search:${query}`,
  search: (params: string) => `search:${params}`,
};

// Cache TTLs in seconds
export const cacheTTL = {
  products: 60,       // 1 minute
  product: 120,       // 2 minutes
  categories: 300,    // 5 minutes
  featured: 180,      // 3 minutes
  search: 30,         // 30 seconds
};

export default apiCache;
