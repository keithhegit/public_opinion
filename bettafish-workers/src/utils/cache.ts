/**
 * Workers KV 缓存工具函数
 */

export async function getCachedData<T>(
  key: string,
  cache: KVNamespace
): Promise<T | null> {
  try {
    const cached = await cache.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
    return null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

export async function setCachedData<T>(
  key: string,
  data: T,
  cache: KVNamespace,
  ttl: number = 3600
): Promise<void> {
  try {
    await cache.put(key, JSON.stringify(data), { expirationTtl: ttl });
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

export async function deleteCachedData(key: string, cache: KVNamespace): Promise<void> {
  try {
    await cache.delete(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
}

