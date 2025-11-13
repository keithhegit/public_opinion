/**
 * 报告生成路由
 * 对应原Flask ReportEngine:
 * - POST /api/report/generate
 * - GET  /api/report/status/:id
 * - GET  /api/report/result/:id
 * - GET  /api/report/check
 */

import { Hono } from 'hono';

export const reportRoutes = new Hono<{ Bindings: Env }>();

// 生成报告
reportRoutes.post('/generate', async (c) => {
  try {
    const body = await c.req.json();
    const { query, custom_template } = body;

    if (!query) {
      return c.json({ error: 'Query is required' }, 400);
    }

    // 转发到Python后端
    const response = await fetch(`${c.env.BACKEND_URL}/api/report/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000), // 30秒超时（报告生成可能较慢）
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to generate report', details: error }, response.status);
    }

    const result = await response.json();
    
    return c.json(result);
  } catch (error) {
    console.error('Generate report error:', error);
    return c.json(
      {
        error: 'Failed to generate report',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

// 查询报告状态
reportRoutes.get('/status/:id', async (c) => {
  try {
    const taskId = c.req.param('id');
    
    // 转发到Python后端
    const response = await fetch(`${c.env.BACKEND_URL}/api/report/status/${taskId}`, {
      method: 'GET',
      headers: {
        ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
      },
      signal: AbortSignal.timeout(5000), // 5秒超时
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to get report status', details: error }, response.status);
    }

    const result = await response.json();
    
    return c.json(result);
  } catch (error) {
    console.error('Get report status error:', error);
    return c.json(
      {
        error: 'Failed to get report status',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

// 获取报告结果
reportRoutes.get('/result/:id', async (c) => {
  try {
    const taskId = c.req.param('id');
    
    // 转发到Python后端
    const response = await fetch(`${c.env.BACKEND_URL}/api/report/result/${taskId}`, {
      method: 'GET',
      headers: {
        ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
      },
      signal: AbortSignal.timeout(10000), // 10秒超时
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to get report result', details: error }, response.status);
    }

    const result = await response.json();
    
    return c.json(result);
  } catch (error) {
    console.error('Get report result error:', error);
    return c.json(
      {
        error: 'Failed to get report result',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

// 检查引擎就绪状态
reportRoutes.get('/check', async (c) => {
  try {
    // 转发到Python后端
    const response = await fetch(`${c.env.BACKEND_URL}/api/report/check`, {
      method: 'GET',
      headers: {
        ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
      },
      signal: AbortSignal.timeout(5000), // 5秒超时
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to check engines', details: error }, response.status);
    }

    const result = await response.json();
    
    return c.json(result);
  } catch (error) {
    console.error('Check engines error:', error);
    return c.json(
      {
        error: 'Failed to check engines',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

