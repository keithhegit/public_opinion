/**
 * BettaFish Cloudflare Workers API Gateway
 * 基于实际Flask应用的路由设计
 * 
 * 原Flask路由映射:
 * - GET  /api/status          → 系统状态
 * - POST /api/start/<app>     → 启动Engine
 * - POST /api/stop/<app>      → 停止Engine
 * - GET  /api/output/<app>    → 获取输出
 * - POST /api/search          → 搜索接口
 * - GET  /api/config          → 获取配置
 * - POST /api/config          → 更新配置
 * - GET  /api/forum/log        → 论坛日志
 * - POST /api/forum/start      → 启动论坛
 * - POST /api/forum/stop       → 停止论坛
 * - POST /api/report/generate  → 生成报告
 * - GET  /api/report/status/:id → 报告状态
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
  BACKEND_URL: string;  // Python后端URL
  BACKEND_TOKEN?: string; // 后端认证Token
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

// 路由注册（匹配原Flask应用的路由结构）
app.route('/api/status', statusRoutes);
app.route('/api', engineRoutes);  // /api/start/:app, /api/stop/:app, /api/output/:app
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

