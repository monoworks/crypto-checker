interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const globalForCache = globalThis as typeof globalThis & {
  __fundingRateCache?: Map<string, CacheEntry<unknown>>;
};

function getCache(): Map<string, CacheEntry<unknown>> {
  if (!globalForCache.__fundingRateCache) {
    globalForCache.__fundingRateCache = new Map();
  }
  return globalForCache.__fundingRateCache;
}

export function getCached<T>(key: string): T | null {
  const cache = getCache();
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttlMs: number): void {
  const cache = getCache();
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

export function clearCache(): void {
  const cache = getCache();
  cache.clear();
}
