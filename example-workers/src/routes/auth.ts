/**
 * 认证路由
 */

import { Hono } from 'hono';
import { signJWT, verifyJWT } from '../utils/jwt';
import { hashPassword, verifyPassword } from '../utils/password';
import { getCachedData, setCachedData } from '../utils/cache';

export const authRoutes = new Hono<{ Bindings: Env }>();

// 用户注册
authRoutes.post('/register', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // 检查用户是否已存在
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    )
      .bind(email)
      .first();

    if (existingUser) {
      return c.json({ error: 'User already exists' }, 409);
    }

    // 创建新用户
    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);
    const now = Date.now();

    await c.env.DB.prepare(
      'INSERT INTO users (id, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
    )
      .bind(userId, email, passwordHash, now, now)
      .run();

    // 生成 JWT Token
    const token = await signJWT({ userId, email }, c.env.JWT_SECRET);

    // 存储会话到 KV
    await setCachedData(`session:${userId}`, { userId, email }, c.env.CACHE, 86400);

    return c.json({
      success: true,
      token,
      user: { id: userId, email },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// 用户登录
authRoutes.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // 查找用户
    const user = await c.env.DB.prepare(
      'SELECT id, email, password_hash FROM users WHERE email = ?'
    )
      .bind(email)
      .first<{ id: string; email: string; password_hash: string }>();

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // 验证密码
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // 生成 JWT Token
    const token = await signJWT({ userId: user.id, email: user.email }, c.env.JWT_SECRET);

    // 存储会话到 KV
    await setCachedData(
      `session:${user.id}`,
      { userId: user.id, email: user.email },
      c.env.CACHE,
      86400
    );

    return c.json({
      success: true,
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// 登出
authRoutes.post('/logout', async (c) => {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return c.json({ error: 'Token required' }, 401);
    }

    const payload = await verifyJWT(token, c.env.JWT_SECRET);
    if (payload) {
      // 从 KV 中删除会话
      await c.env.CACHE.delete(`session:${payload.userId}`);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return c.json({ error: 'Logout failed' }, 500);
  }
});

// 获取当前用户信息
authRoutes.get('/me', async (c) => {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const payload = await verifyJWT(token, c.env.JWT_SECRET);
    if (!payload) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    // 从缓存或数据库获取用户信息
    const cached = await getCachedData(`session:${payload.userId}`, c.env.CACHE);
    if (cached) {
      return c.json({ user: cached });
    }

    const user = await c.env.DB.prepare('SELECT id, email, created_at FROM users WHERE id = ?')
      .bind(payload.userId)
      .first();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: 'Failed to get user' }, 500);
  }
});

