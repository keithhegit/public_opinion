/**
 * 历史任务管理API路由
 * 对应原Flask: /api/tasks/*
 */

import { Hono } from 'hono';

export const tasksRoutes = new Hono<{ Bindings: Env }>();

// 获取历史任务列表
tasksRoutes.get('/history', async (c) => {
  try {
    const limit = c.req.query('limit') || '50';
    const response = await fetch(
      `${c.env.BACKEND_URL}/api/tasks/history?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to fetch tasks history', details: error }, response.status);
    }

    const result = await response.json();
    return c.json(result);
  } catch (error) {
    console.error('Tasks history error:', error);
    return c.json(
      {
        error: 'Failed to fetch tasks history',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

// 清空当前任务状态
tasksRoutes.post('/clear', async (c) => {
  try {
    const response = await fetch(`${c.env.BACKEND_URL}/api/tasks/clear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to clear tasks', details: error }, response.status);
    }

    const result = await response.json();
    return c.json(result);
  } catch (error) {
    console.error('Clear tasks error:', error);
    return c.json(
      {
        error: 'Failed to clear tasks',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

// 获取任务详细信息
tasksRoutes.get('/:taskId', async (c) => {
  try {
    const taskId = c.req.param('taskId');
    const response = await fetch(`${c.env.BACKEND_URL}/api/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to fetch task info', details: error }, response.status);
    }

    const result = await response.json();
    return c.json(result);
  } catch (error) {
    console.error('Get task info error:', error);
    return c.json(
      {
        error: 'Failed to fetch task info',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

// 获取任务日志
tasksRoutes.get('/:taskId/logs/:appName', async (c) => {
  try {
    const taskId = c.req.param('taskId');
    const appName = c.req.param('appName');
    const response = await fetch(
      `${c.env.BACKEND_URL}/api/tasks/${taskId}/logs/${appName}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to fetch task log', details: error }, response.status);
    }

    const result = await response.json();
    return c.json(result);
  } catch (error) {
    console.error('Get task log error:', error);
    return c.json(
      {
        error: 'Failed to fetch task log',
        message: c.env.ENVIRONMENT === 'development' ? String(error) : undefined,
      },
      500
    );
  }
});

