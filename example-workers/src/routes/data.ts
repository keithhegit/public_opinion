/**
 * 数据搜索路由
 */

import { Hono } from 'hono';
import { verifyJWT } from '../utils/jwt';
import { getCachedData, setCachedData } from '../utils/cache';

export const dataRoutes = new Hono<{ Bindings: Env }>();

// 认证中间件
const authMiddleware = async (c: any, next: () => Promise<void>) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const payload = await verifyJWT(token, c.env.JWT_SECRET);
  if (!payload) {
    return c.json({ error: 'Invalid token' }, 401);
  }

  c.set('userId', payload.userId);
  await next();
};

dataRoutes.use('*', authMiddleware);

// 搜索数据
dataRoutes.get('/search', async (c) => {
  try {
    const query = c.req.query('q');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');

    if (!query) {
      return c.json({ error: 'Query parameter is required' }, 400);
    }

    // 检查缓存
    const cacheKey = `search:${query}:${page}:${limit}`;
    const cached = await getCachedData(cacheKey, c.env.CACHE);
    if (cached) {
      return c.json({ success: true, data: cached });
    }

    // 如果有后端 API，调用后端
    if (c.env.BACKEND_API_URL) {
      const response = await fetch(
        `${c.env.BACKEND_API_URL}/api/data/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
        {
          headers: {
            'Authorization': c.req.header('Authorization') || '',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // 缓存结果
        await setCachedData(cacheKey, data, c.env.CACHE, 300); // 5分钟缓存
        return c.json({ success: true, data });
      }
    }

    // 如果没有后端，从 D1 数据库搜索
    const results = await c.env.DB.prepare(
      `SELECT * FROM sentiment_results WHERE text LIKE ? LIMIT ? OFFSET ?`
    )
      .bind(`%${query}%`, limit, (page - 1) * limit)
      .all();

    const data = {
      query,
      results: results.results,
      pagination: {
        page,
        limit,
        total: results.results.length,
      },
    };

    // 缓存结果
    await setCachedData(cacheKey, data, c.env.CACHE, 300);

    return c.json({ success: true, data });
  } catch (error) {
    console.error('Data search error:', error);
    return c.json({ error: 'Failed to search data' }, 500);
  }
});

