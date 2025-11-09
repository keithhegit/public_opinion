/**
 * 分析任务路由
 */

import { Hono } from 'hono';
import { verifyJWT } from '../utils/jwt';
import { getCachedData, setCachedData } from '../utils/cache';
import { callOpenAI } from '../services/openai';

export const analysisRoutes = new Hono<{ Bindings: Env }>();

// 认证中间件
const authMiddleware = async (c: any, next: () => Promise<void>) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const payload = await verifyJWT(token, c.env.JWT_SECRET);
  if (!payload) {
    return c.json({ error: 'Invalid token' }, 401);
  }

  c.set('userId', payload.userId);
  await next();
};

analysisRoutes.use('*', authMiddleware);

// 创建分析任务
analysisRoutes.post('/create', async (c) => {
  try {
    const userId = c.get('userId');
    const { query, title } = await c.req.json();

    if (!query) {
      return c.json({ error: 'Query is required' }, 400);
    }

    const taskId = crypto.randomUUID();
    const now = Date.now();

    // 创建任务记录
    await c.env.DB.prepare(
      'INSERT INTO analysis_tasks (id, user_id, title, query, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
      .bind(taskId, userId, title || query.substring(0, 100), query, 'pending', now, now)
      .run();

    // 异步处理任务（使用 Queue 或直接处理）
    // 这里简化处理，直接调用 AI API
    const result = await processAnalysisTask(taskId, query, c.env);

    // 更新任务状态
    await c.env.DB.prepare(
      'UPDATE analysis_tasks SET status = ?, result = ?, updated_at = ? WHERE id = ?'
    )
      .bind('completed', JSON.stringify(result), Date.now(), taskId)
      .run();

    // 缓存结果
    await setCachedData(`analysis:result:${taskId}`, result, c.env.CACHE, 3600);

    return c.json({
      success: true,
      taskId,
      result,
    });
  } catch (error) {
    console.error('Create analysis error:', error);
    return c.json({ error: 'Failed to create analysis' }, 500);
  }
});

// 获取分析任务列表
analysisRoutes.get('/list', async (c) => {
  try {
    const userId = c.get('userId');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = (page - 1) * limit;

    const tasks = await c.env.DB.prepare(
      'SELECT id, title, query, status, created_at, updated_at FROM analysis_tasks WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
    )
      .bind(userId, limit, offset)
      .all();

    const total = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM analysis_tasks WHERE user_id = ?'
    )
      .bind(userId)
      .first<{ count: number }>();

    return c.json({
      success: true,
      tasks: tasks.results,
      pagination: {
        page,
        limit,
        total: total?.count || 0,
        totalPages: Math.ceil((total?.count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('List analysis error:', error);
    return c.json({ error: 'Failed to list analysis' }, 500);
  }
});

// 获取分析结果
analysisRoutes.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const userId = c.get('userId');

    // 先检查缓存
    const cached = await getCachedData(`analysis:result:${id}`, c.env.CACHE);
    if (cached) {
      return c.json({ success: true, result: cached });
    }

    // 从数据库获取
    const task = await c.env.DB.prepare(
      'SELECT id, title, query, status, result, created_at, updated_at FROM analysis_tasks WHERE id = ? AND user_id = ?'
    )
      .bind(id, userId)
      .first<{
        id: string;
        title: string;
        query: string;
        status: string;
        result: string | null;
        created_at: number;
        updated_at: number;
      }>();

    if (!task) {
      return c.json({ error: 'Task not found' }, 404);
    }

    const result = task.result ? JSON.parse(task.result) : null;

    // 缓存结果
    if (result) {
      await setCachedData(`analysis:result:${id}`, result, c.env.CACHE, 3600);
    }

    return c.json({
      success: true,
      task: {
        id: task.id,
        title: task.title,
        query: task.query,
        status: task.status,
        result,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      },
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    return c.json({ error: 'Failed to get analysis' }, 500);
  }
});

// 处理分析任务
async function processAnalysisTask(
  taskId: string,
  query: string,
  env: Env
): Promise<any> {
  // 构建提示词
  const prompt = `请对以下舆情查询进行详细分析：${query}\n\n请提供：\n1. 关键信息提取\n2. 情感倾向分析\n3. 趋势预测\n4. 建议措施`;

  // 调用 OpenAI API
  const analysisResult = await callOpenAI(prompt, env);

  return {
    taskId,
    query,
    analysis: analysisResult,
    timestamp: Date.now(),
  };
}

