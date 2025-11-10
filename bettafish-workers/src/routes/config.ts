/**
 * 配置管理路由
 * 对应原Flask:
 * - GET  /api/config
 * - POST /api/config
 */

import { Hono } from 'hono';
import { getCachedData, setCachedData } from '../utils/cache';

export const configRoutes = new Hono<{ Bindings: Env }>();

// 获取配置
configRoutes.get('/', async (c) => {
  try {
    // 检查后端URL是否配置
    if (c.env.BACKEND_URL === 'https://your-backend-api.com' || !c.env.BACKEND_URL) {
      return c.json(
        {
          error: 'Backend not configured',
          message: 'Python backend URL is not configured. Please set BACKEND_URL in Workers environment variables.',
        },
        503
      );
    }

    // 检查缓存（5分钟缓存）
    const cacheKey = 'config:all';
    const cached = await getCachedData(cacheKey, c.env.CACHE);
    if (cached) {
      return c.json(cached);
    }

    // 转发到Python后端
    const response = await fetch(`${c.env.BACKEND_URL}/api/config`, {
      method: 'GET',
      headers: {
        ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
      },
      signal: AbortSignal.timeout(5000), // 5秒超时
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to get config', details: error }, response.status);
    }

    const result = await response.json();
    
    // 缓存5分钟
    await setCachedData(cacheKey, result, c.env.CACHE, 300);
    
    return c.json(result);
  } catch (error) {
    console.error('Get config error:', error);
    
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
        error: 'Failed to get config',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

// 更新配置
configRoutes.post('/', async (c) => {
  try {
    // 检查后端URL是否配置
    if (c.env.BACKEND_URL === 'https://your-backend-api.com' || !c.env.BACKEND_URL) {
      return c.json(
        {
          error: 'Backend not configured',
          message: 'Python backend URL is not configured. Please set BACKEND_URL in Workers environment variables.',
        },
        503
      );
    }

    const updates = await c.req.json();

    if (!updates || Object.keys(updates).length === 0) {
      return c.json({ error: 'No updates provided' }, 400);
    }

    // 转发到Python后端
    const response = await fetch(`${c.env.BACKEND_URL}/api/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
      },
      body: JSON.stringify(updates),
      signal: AbortSignal.timeout(10000), // 10秒超时
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to update config', details: error }, response.status);
    }

    const result = await response.json();
    
    // 清除配置缓存
    await c.env.CACHE.delete('config:all');
    
    return c.json(result);
  } catch (error) {
    console.error('Update config error:', error);
    
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
        error: 'Failed to update config',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

