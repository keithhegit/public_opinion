/**
 * 情感分析路由
 */

import { Hono } from 'hono';
import { verifyJWT } from '../utils/jwt';
import { getCachedData, setCachedData } from '../utils/cache';
import { analyzeSentiment } from '../services/sentiment';

export const sentimentRoutes = new Hono<{ Bindings: Env }>();

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

sentimentRoutes.use('*', authMiddleware);

// 情感分析
sentimentRoutes.post('/analyze', async (c) => {
  try {
    const { text, taskId } = await c.req.json();

    if (!text) {
      return c.json({ error: 'Text is required' }, 400);
    }

    // 检查缓存
    const cacheKey = `sentiment:${Buffer.from(text).toString('base64').substring(0, 50)}`;
    const cached = await getCachedData(cacheKey, c.env.CACHE);
    if (cached) {
      return c.json({ success: true, result: cached });
    }

    // 执行情感分析
    const result = await analyzeSentiment(text, c.env);

    // 如果有关联任务，保存结果
    if (taskId) {
      const sentimentId = crypto.randomUUID();
      await c.env.DB.prepare(
        'INSERT INTO sentiment_results (id, task_id, text, sentiment, confidence, created_at) VALUES (?, ?, ?, ?, ?, ?)'
      )
        .bind(sentimentId, taskId, text, result.sentiment, result.confidence, Date.now())
        .run();
    }

    // 缓存结果
    await setCachedData(cacheKey, result, c.env.CACHE, 3600);

    return c.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return c.json({ error: 'Failed to analyze sentiment' }, 500);
  }
});

// 批量情感分析
sentimentRoutes.post('/analyze/batch', async (c) => {
  try {
    const { texts } = await c.req.json();

    if (!Array.isArray(texts) || texts.length === 0) {
      return c.json({ error: 'Texts array is required' }, 400);
    }

    // 限制批量大小
    if (texts.length > 100) {
      return c.json({ error: 'Maximum 100 texts per batch' }, 400);
    }

    const results = await Promise.all(
      texts.map((text: string) => analyzeSentiment(text, c.env))
    );

    return c.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Batch sentiment analysis error:', error);
    return c.json({ error: 'Failed to analyze sentiments' }, 500);
  }
});

