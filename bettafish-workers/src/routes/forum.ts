/**
 * 论坛管理路由
 * 对应原Flask:
 * - GET  /api/forum/log
 * - POST /api/forum/start
 * - POST /api/forum/stop
 */

import { Hono } from 'hono';
import { getCachedData, setCachedData } from '../utils/cache';

export const forumRoutes = new Hono<{ Bindings: Env }>();

// 获取论坛日志
forumRoutes.get('/log', async (c) => {
  try {
    // 检查缓存（10秒缓存）
    const cacheKey = 'forum:log';
    const cached = await getCachedData(cacheKey, c.env.CACHE);
    if (cached) {
      return c.json(cached);
    }

    // 转发到Python后端
    const response = await fetch(`${c.env.BACKEND_URL}/api/forum/log`, {
      method: 'GET',
      headers: {
        ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
      },
      signal: AbortSignal.timeout(10000), // 10秒超时
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to get forum log', details: error }, response.status);
    }

    const result = await response.json();
    
    // 缓存10秒
    await setCachedData(cacheKey, result, c.env.CACHE, 10);
    
    return c.json(result);
  } catch (error) {
    console.error('Get forum log error:', error);
    
    // 检查是否是后端未配置
    if (c.env.BACKEND_URL === 'https://your-backend-api.com' || !c.env.BACKEND_URL) {
      return c.json(
        {
          error: 'Backend not configured',
          message: 'Python backend URL is not configured. Please set BACKEND_URL in Workers environment variables.',
        },
        503
      );
    }
    
    return c.json(
      {
        error: 'Failed to get forum log',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

// 启动论坛监控
forumRoutes.post('/start', async (c) => {
  try {
    // 转发到Python后端
    const response = await fetch(`${c.env.BACKEND_URL}/api/forum/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
      },
      signal: AbortSignal.timeout(10000), // 10秒超时
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to start forum', details: error }, response.status);
    }

    const result = await response.json();
    
    // 清除论坛日志缓存
    await c.env.CACHE.delete('forum:log');
    
    return c.json(result);
  } catch (error) {
    console.error('Start forum error:', error);
    return c.json(
      {
        error: 'Failed to start forum',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

// 停止论坛监控
forumRoutes.post('/stop', async (c) => {
  try {
    // 转发到Python后端
    const response = await fetch(`${c.env.BACKEND_URL}/api/forum/stop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
      },
      signal: AbortSignal.timeout(10000), // 10秒超时
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to stop forum', details: error }, response.status);
    }

    const result = await response.json();
    
    // 清除论坛日志缓存
    await c.env.CACHE.delete('forum:log');
    
    return c.json(result);
  } catch (error) {
    console.error('Stop forum error:', error);
    return c.json(
      {
        error: 'Failed to stop forum',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

