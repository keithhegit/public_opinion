/**
 * Streamlit 代理路由
 * 用于代理前端 iframe 对后端 Streamlit 服务的请求
 */

import { Hono } from 'hono';

export const proxyRoutes = new Hono<{ Bindings: Env }>();

// Streamlit 服务端口映射
const STREAMLIT_PORTS: Record<string, number> = {
  insight: 8501,
  media: 8502,
  query: 8503,
};

// 代理 Streamlit 服务
proxyRoutes.get('/proxy/:app', async (c) => {
  try {
    const appName = c.req.param('app');
    const query = c.req.query();
    
    // 验证 app 名称
    if (!STREAMLIT_PORTS[appName]) {
      return c.json({ error: `Invalid app name: ${appName}` }, 400);
    }
    
    const port = STREAMLIT_PORTS[appName];
    
    // 构建后端 Streamlit URL
    // 从 BACKEND_URL 中提取主机名和协议
    const backendUrl = new URL(c.env.BACKEND_URL);
    const streamlitUrl = `${backendUrl.protocol}//${backendUrl.hostname}:${port}`;
    
    // 构建查询字符串
    const queryString = new URLSearchParams(query).toString();
    const fullUrl = queryString ? `${streamlitUrl}?${queryString}` : streamlitUrl;
    
    // 转发请求到 Streamlit 服务
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'User-Agent': c.req.header('User-Agent') || 'BettaFish-Proxy',
      },
    });
    
    // 如果响应是 HTML，直接返回
    if (response.headers.get('content-type')?.includes('text/html')) {
      const html = await response.text();
      return c.html(html);
    }
    
    // 否则返回原始响应
    const contentType = response.headers.get('content-type') || 'text/plain';
    const body = await response.text();
    
    return new Response(body, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return c.json(
      {
        error: 'Proxy failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

