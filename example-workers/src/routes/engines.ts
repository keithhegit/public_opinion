/**
 * Engine管理路由
 * 对应原Flask:
 * - POST /api/start/<app_name>
 * - POST /api/stop/<app_name>
 * - GET  /api/output/<app_name>
 */

import { Hono } from 'hono';
import { getCachedData, setCachedData } from '../utils/cache';

export const engineRoutes = new Hono<{ Bindings: Env }>();

// 启动Engine
engineRoutes.post('/start/:app', async (c) => {
  try {
    const appName = c.req.param('app');
    
    // 验证app名称
    const validApps = ['insight', 'media', 'query', 'report'];
    if (!validApps.includes(appName)) {
      return c.json({ error: `Invalid app name: ${appName}` }, 400);
    }

    // 转发到Python后端
    const response = await fetch(`${c.env.BACKEND_URL}/api/start/${appName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
      },
      signal: AbortSignal.timeout(30000), // 30秒超时
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to start engine', details: error }, response.status);
    }

    const result = await response.json();
    
    // 清除相关缓存
    await c.env.CACHE.delete(`engine:status:${appName}`);
    
    return c.json(result);
  } catch (error) {
    console.error('Start engine error:', error);
    return c.json(
      {
        error: 'Failed to start engine',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

// 停止Engine
engineRoutes.post('/stop/:app', async (c) => {
  try {
    const appName = c.req.param('app');
    
    // 转发到Python后端
    const response = await fetch(`${c.env.BACKEND_URL}/api/stop/${appName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
      },
      signal: AbortSignal.timeout(10000), // 10秒超时
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to stop engine', details: error }, response.status);
    }

    const result = await response.json();
    
    // 清除相关缓存
    await c.env.CACHE.delete(`engine:status:${appName}`);
    await c.env.CACHE.delete(`engine:output:${appName}`);
    
    return c.json(result);
  } catch (error) {
    console.error('Stop engine error:', error);
    return c.json(
      {
        error: 'Failed to stop engine',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

// 获取Engine输出
engineRoutes.get('/output/:app', async (c) => {
  try {
    const appName = c.req.param('app');
    
    // 检查缓存（5秒缓存）
    const cacheKey = `engine:output:${appName}`;
    const cached = await getCachedData(cacheKey, c.env.CACHE);
    if (cached) {
      return c.json(cached);
    }

    // 转发到Python后端
    const response = await fetch(`${c.env.BACKEND_URL}/api/output/${appName}`, {
      method: 'GET',
      headers: {
        ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
      },
      signal: AbortSignal.timeout(10000), // 10秒超时
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to get output', details: error }, response.status);
    }

    const result = await response.json();
    
    // 缓存5秒
    await setCachedData(cacheKey, result, c.env.CACHE, 5);
    
    return c.json(result);
  } catch (error) {
    console.error('Get output error:', error);
    return c.json(
      {
        error: 'Failed to get output',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

