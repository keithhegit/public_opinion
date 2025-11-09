/**
 * BettaFish Cloudflare Workers API Gateway
 * 基于实际Flask应用的路由设计
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { statusRoutes } from './routes/status';
import { engineRoutes } from './routes/engines';
import { searchRoutes } from './routes/search';
import { configRoutes } from './routes/config';
import { forumRoutes } from './routes/forum';
import { reportRoutes } from './routes/report';

// 类型定义
export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  BACKEND_URL: string;
  BACKEND_TOKEN?: string;
  ENVIRONMENT: string;
}

// 创建 Hono 应用
const app = new Hono<{ Bindings: Env }>();

// 中间件
app.use('*', logger());
app.use('*', prettyJSON());
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'https://your-pages-domain.pages.dev'],
    credentials: true,
  })
);

// 健康检查
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT,
  });
});

// 路由注册
app.route('/api/status', statusRoutes);
app.route('/api', engineRoutes);
app.route('/api/search', searchRoutes);
app.route('/api/config', configRoutes);
app.route('/api/forum', forumRoutes);
app.route('/api/report', reportRoutes);

// 404 处理
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// 错误处理
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json(
    {
      error: 'Internal Server Error',
      message: c.env.ENVIRONMENT === 'development' ? err.message : undefined,
    },
    500
  );
});

// 导出 Worker
export default app;

