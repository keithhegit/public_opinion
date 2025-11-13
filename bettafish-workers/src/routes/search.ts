/**
 * 搜索路由
 * 对应原Flask: POST /api/search
 */

import { Hono } from 'hono';

export const searchRoutes = new Hono<{ Bindings: Env }>();

// 执行搜索
searchRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { query, engine, ...params } = body;

    if (!query) {
      return c.json({ error: 'Query is required' }, 400);
    }

    // 转发到Python后端
    const response = await fetch(`${c.env.BACKEND_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60000), // 60秒超时（搜索可能较慢）
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Search failed', details: error }, response.status);
    }

    const result = await response.json();
    
    return c.json(result);
  } catch (error) {
    console.error('Search error:', error);
    return c.json(
      {
        error: 'Search failed',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

