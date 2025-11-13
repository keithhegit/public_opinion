/**
 * Engine管理路由
 * 对应原Flask:
 * - POST /api/start/<app_name>
 * - POST /api/stop/<app_name>
 * - GET  /api/output/<app_name>
 */

import { Hono } from 'hono';

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
    
    return c.json(result);
  } catch (error) {
    console.error('Start engine error:', error);
    
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
    
    // 检查是否是连接错误（Cloudflare 1003 错误）
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isConnectionError = errorMessage.includes('1003') || 
                              errorMessage.includes('Failed to fetch') ||
                              errorMessage.includes('fetch failed');
    
    if (isConnectionError) {
      return c.json(
        {
          error: 'Failed to start engine',
          details: 'error code: 1003',
          message: `Cannot connect to backend server at ${c.env.BACKEND_URL}. Please check: 1) Backend server is running, 2) BACKEND_URL is correct, 3) Firewall allows Cloudflare IPs, 4) Consider using HTTPS if using HTTP.`,
        },
        403
      );
    }
    
    return c.json(
      {
        error: 'Failed to start engine',
        details: errorMessage,
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
    
    // 转发到Python后端
    const response = await fetch(`${c.env.BACKEND_URL}/api/output/${appName}`, {
      method: 'GET',
      headers: {
        ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
      },
      signal: AbortSignal.timeout(30000), // 30秒超时（Engine处理可能需要较长时间）
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to get output', details: error }, response.status);
    }

    const result = await response.json();
    
    // 检查输出中是否包含错误信息
    if (result.data && typeof result.data === 'string') {
      const outputText = result.data.toLowerCase();
      // 检测常见的数据库连接错误
      if (outputText.includes('socket.gaierror') || 
          outputText.includes('your_db_host') ||
          outputText.includes('name or service not known')) {
        console.warn(`Engine ${appName} 输出中包含数据库连接错误`);
        // 不返回错误，但记录警告，让前端可以显示
      }
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Get output error:', error);
    
    // 检查是否是超时错误
    if (error instanceof Error && error.name === 'AbortError') {
      return c.json(
        {
          error: 'Request timeout',
          message: 'Engine响应超时，可能正在处理中或已卡住',
        },
        504
      );
    }
    
    return c.json(
      {
        error: 'Failed to get output',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

