/**
 * 系统状态路由
 * 对应原Flask: GET /api/status
 */

import { Hono } from 'hono';
import { getCachedData, setCachedData } from '../utils/cache';

export const statusRoutes = new Hono<{ Bindings: Env }>();

// 获取系统状态
statusRoutes.get('/', async (c) => {
  try {
    // 检查缓存（30秒缓存）
    const cacheKey = 'system:status';
    const cached = await getCachedData(cacheKey, c.env.CACHE);
    if (cached) {
      return c.json(cached);
    }

    // 检查Workers状态
    const workersStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };

    // 检查Python后端状态
    let backendStatus = { status: 'unknown', engines: {} };
    try {
      const backendResponse = await fetch(`${c.env.BACKEND_URL}/api/status`, {
        method: 'GET',
        headers: {
          ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
        },
        signal: AbortSignal.timeout(5000), // 5秒超时
      });

      if (backendResponse.ok) {
        backendStatus = await backendResponse.json();
      }
    } catch (error) {
      console.error('Backend status check failed:', error);
      backendStatus = { status: 'error', error: 'Backend unreachable' };
    }

    // 组合状态
    const status = {
      workers: workersStatus,
      backend: backendStatus,
      timestamp: new Date().toISOString(),
    };

    // 缓存30秒
    await setCachedData(cacheKey, status, c.env.CACHE, 30);

    return c.json(status);
  } catch (error) {
    console.error('Status check error:', error);
    return c.json(
      {
        error: 'Failed to get status',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

