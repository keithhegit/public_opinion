/**
 * 系统状态路由
 * 对应原Flask: GET /api/status
 */

import { Hono } from 'hono';

export const statusRoutes = new Hono<{ Bindings: Env }>();

// 获取系统状态
statusRoutes.get('/', async (c) => {
  try {
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
        const backendData = await backendResponse.json();
        // 后端返回的是直接的引擎数据，需要包装在 engines 字段下
        backendStatus = {
          status: 'ok',
          engines: backendData,
        };
      }
    } catch (error) {
      console.error('Backend status check failed:', error);
      backendStatus = { status: 'error', error: 'Backend unreachable', engines: {} };
    }

    // 组合状态
    const status = {
      workers: workersStatus,
      backend: backendStatus,
      timestamp: new Date().toISOString(),
    };

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

