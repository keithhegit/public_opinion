/**
 * 任务管理路由
 * 对应原Flask: /api/tasks/*
 */

import { Hono } from 'hono';
import type { Env } from '../index';

export const tasksRoutes = new Hono<{ Bindings: Env }>();

// 清空当前任务状态（必须在 /:taskId 之前）
tasksRoutes.post('/clear', async (c) => {
  try {
    // 转发到Python后端，设置较短的超时（30秒）
    const response = await fetch(`${c.env.BACKEND_URL}/api/tasks/clear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
      },
      signal: AbortSignal.timeout(30000), // 30秒超时
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json(
        { error: 'Failed to clear tasks', details: error },
        response.status
      );
    }

    const result = await response.json();
    return c.json(result);
  } catch (error) {
    console.error('Clear tasks error:', error);
    if (error instanceof Error && error.name === 'AbortError') {
      return c.json(
        {
          error: 'Failed to clear tasks',
          details: 'Request timeout - the operation took too long',
        },
        504
      );
    }
    return c.json(
      {
        error: 'Failed to clear tasks',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

// 获取历史任务列表（必须在 /:taskId 之前）
tasksRoutes.get('/history', async (c) => {
  try {
    const limit = c.req.query('limit') || '50';
    const response = await fetch(
      `${c.env.BACKEND_URL}/api/tasks/history?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
        },
        signal: AbortSignal.timeout(10000), // 10秒超时
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to fetch tasks', details: error }, response.status);
    }

    const result = await response.json();
    return c.json(result);
  } catch (error) {
    console.error('Get tasks history error:', error);
    return c.json(
      {
        error: 'Failed to fetch tasks',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

// 获取任务日志（必须在 /:taskId 之前，因为路径更长更具体）
tasksRoutes.get('/:taskId/logs/:appName', async (c) => {
  try {
    const taskId = c.req.param('taskId');
    const appName = c.req.param('appName');
    
    const response = await fetch(
      `${c.env.BACKEND_URL}/api/tasks/${taskId}/logs/${appName}`,
      {
        method: 'GET',
        headers: {
          ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
        },
        signal: AbortSignal.timeout(10000), // 10秒超时
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
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

// 获取任务详细信息（必须在最后，因为它是参数路由）
tasksRoutes.get('/:taskId', async (c) => {
  try {
    const taskId = c.req.param('taskId');
    
    const response = await fetch(`${c.env.BACKEND_URL}/api/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        ...(c.env.BACKEND_TOKEN && { Authorization: `Bearer ${c.env.BACKEND_TOKEN}` }),
      },
      signal: AbortSignal.timeout(10000), // 10秒超时
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error: 'Failed to fetch task', details: error }, response.status);
    }

    const result = await response.json();
    return c.json(result);
  } catch (error) {
    console.error('Get task error:', error);
    return c.json(
      {
        error: 'Failed to fetch task',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

