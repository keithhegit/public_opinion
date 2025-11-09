# BettaFish Cloudflare 迁移实施指南

## 🚀 快速开始

### 1. 项目结构

```
bettafish-cloudflare/
├── frontend/                 # Next.js 前端应用
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
├── workers/                  # Cloudflare Workers API
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── wrangler.toml
│   └── package.json
├── backend/                  # Python 后端服务（可选）
│   ├── app/
│   ├── requirements.txt
│   └── Dockerfile
└── README.md
```

### 2. 环境准备

#### 安装依赖
```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login
```

#### 创建 Cloudflare 资源
```bash
# 创建 D1 数据库
wrangler d1 create bettafish-db

# 创建 Workers KV 命名空间
wrangler kv:namespace create "BETTAFISH_CACHE"
wrangler kv:namespace create "BETTAFISH_CACHE" --preview
```

### 3. 配置说明

#### wrangler.toml (Workers配置)
```toml
name = "bettafish-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.production]
name = "bettafish-api-prod"

[env.production.kv_namespaces]
binding = "CACHE"
id = "your-kv-namespace-id"
preview_id = "your-preview-kv-namespace-id"

[[env.production.d1_databases]]
binding = "DB"
database_name = "bettafish-db"
database_id = "your-database-id"

[vars]
ENVIRONMENT = "production"
OPENAI_API_KEY = "your-openai-key"  # 使用 secrets 更安全
BACKEND_API_URL = "https://your-backend-api.com"
```

## 📦 核心功能实现

### 1. Workers API 基础结构

#### 路由设计
```
GET  /api/health              # 健康检查
POST /api/auth/login          # 登录
POST /api/auth/logout         # 登出
GET  /api/analysis/list       # 获取分析列表
POST /api/analysis/create     # 创建分析任务
GET  /api/analysis/:id        # 获取分析结果
POST /api/sentiment/analyze   # 情感分析
GET  /api/data/search         # 数据搜索
```

### 2. 数据模型设计

#### D1 数据库 Schema
```sql
-- 用户表
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 分析任务表
CREATE TABLE analysis_tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  query TEXT NOT NULL,
  status TEXT NOT NULL,  -- pending, processing, completed, failed
  result TEXT,           -- JSON格式的结果
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 情感分析结果表
CREATE TABLE sentiment_results (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  text TEXT NOT NULL,
  sentiment TEXT NOT NULL,  -- positive, negative, neutral
  confidence REAL NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (task_id) REFERENCES analysis_tasks(id)
);

-- 创建索引
CREATE INDEX idx_analysis_tasks_user_id ON analysis_tasks(user_id);
CREATE INDEX idx_analysis_tasks_status ON analysis_tasks(status);
CREATE INDEX idx_sentiment_results_task_id ON sentiment_results(task_id);
```

### 3. Workers KV 使用场景

#### 缓存策略
- **分析结果缓存**: `analysis:result:{task_id}` → 缓存时间: 1小时
- **用户会话**: `session:{session_id}` → 缓存时间: 24小时
- **配置信息**: `config:{key}` → 缓存时间: 永久（手动更新）
- **热点数据**: `hot:data:{key}` → 缓存时间: 5分钟

## 🔧 关键技术实现

### 1. 认证系统

#### JWT Token 生成和验证
```typescript
// 使用 Cloudflare Workers 的 Web Crypto API
import { SignJWT, jwtVerify } from 'jose';

// 生成 Token
const secret = new TextEncoder().encode(env.JWT_SECRET);
const token = await new SignJWT({ userId })
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('24h')
  .sign(secret);

// 验证 Token
const { payload } = await jwtVerify(token, secret);
```

### 2. AI API 集成

#### OpenAI API 调用
```typescript
async function callOpenAI(prompt: string, env: Env) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}
```

### 3. 数据缓存策略

#### Workers KV 缓存封装
```typescript
async function getCachedData(key: string, cache: KVNamespace): Promise<any | null> {
  const cached = await cache.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  return null;
}

async function setCachedData(
  key: string, 
  data: any, 
  cache: KVNamespace, 
  ttl: number = 3600
): Promise<void> {
  await cache.put(key, JSON.stringify(data), { expirationTtl: ttl });
}
```

### 4. 异步任务处理

#### 使用 Queue 处理长时间任务
```typescript
// 发送任务到队列
await env.TASK_QUEUE.send({
  taskId: 'task-123',
  type: 'analysis',
  data: { query: '...' }
});

// Worker 中处理队列任务
export default {
  async queue(batch: MessageBatch, env: Env): Promise<void> {
    for (const message of batch.messages) {
      const task = message.body;
      // 处理任务
      await processAnalysisTask(task, env);
    }
  }
};
```

## 🌐 前端集成

### 1. Next.js 配置

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    WORKERS_API_URL: process.env.WORKERS_API_URL || 'https://bettafish-api.your-domain.workers.dev',
  },
};

module.exports = nextConfig;
```

### 2. API 客户端

#### lib/api-client.ts
```typescript
const API_BASE_URL = process.env.WORKERS_API_URL || '';

export class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async createAnalysis(query: string) {
    return this.request('/api/analysis/create', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }
}
```

## 🔄 迁移步骤

### Phase 1: 基础架构 (Week 1-2)
1. ✅ 创建 Cloudflare 项目
2. ✅ 设置 D1 数据库
3. ✅ 创建 Workers KV 命名空间
4. ✅ 搭建基础 Workers API
5. ✅ 部署测试

### Phase 2: 核心功能 (Week 3-4)
1. ✅ 实现认证系统
2. ✅ 实现基础 CRUD API
3. ✅ 集成 Workers KV 缓存
4. ✅ 集成 D1 数据库

### Phase 3: AI 集成 (Week 5-6)
1. ✅ 集成 OpenAI API
2. ✅ 实现情感分析接口
3. ✅ 实现分析任务创建
4. ✅ 实现结果查询

### Phase 4: 前端迁移 (Week 7-8)
1. ✅ 创建 Next.js 项目
2. ✅ 迁移现有 UI 组件
3. ✅ 集成 API 客户端
4. ✅ 部署到 Cloudflare Pages

### Phase 5: 优化和测试 (Week 9-10)
1. ✅ 性能优化
2. ✅ 错误处理
3. ✅ 监控和日志
4. ✅ 文档完善

## 📊 性能优化建议

### 1. 缓存策略
- **静态数据**: 永久缓存
- **动态数据**: 根据更新频率设置TTL
- **用户数据**: 短期缓存（5-15分钟）

### 2. 数据库优化
- 使用索引加速查询
- 批量操作减少请求次数
- 使用连接池（如适用）

### 3. API 优化
- 实现请求去重
- 使用流式响应处理大结果
- 实现分页和限制

## 🔒 安全考虑

### 1. 认证和授权
- 使用 JWT Token
- 实现 Token 刷新机制
- 设置合理的过期时间

### 2. API 安全
- 实现 Rate Limiting
- 验证输入数据
- 使用 HTTPS

### 3. 数据安全
- 敏感信息使用 Secrets
- 加密存储密码
- 实现数据访问控制

## 📈 监控和日志

### 1. 使用 Cloudflare Analytics
- 监控 Workers 执行情况
- 跟踪 API 调用次数
- 分析错误率

### 2. 日志记录
```typescript
// 使用 console.log (自动记录到 Cloudflare Dashboard)
console.log('Analysis task created', { taskId, userId });

// 错误日志
console.error('Failed to process task', { error, taskId });
```

## 💰 成本估算

### Cloudflare 免费额度
- **Workers**: 100,000 请求/天
- **Workers KV**: 100,000 读取/天，1,000 写入/天
- **D1**: 5GB 存储，5M 读取/月
- **Pages**: 500 构建/月

### 超出免费额度后
- Workers: $5/百万请求
- Workers KV: $0.50/百万读取
- D1: $0.001/GB存储，$1.00/百万读取

## 🐛 常见问题

### Q: Python 代码如何迁移？
A: 需要重写为 TypeScript，或保留 Python 后端作为独立服务。

### Q: AI 模型如何部署？
A: 建议使用外部 AI API（OpenAI、Anthropic等），不适合在 Workers 中运行大型模型。

### Q: 如何处理长时间任务？
A: 使用 Queue 或外部服务处理，Workers 有执行时间限制。

### Q: 数据如何迁移？
A: 编写迁移脚本，从现有数据库导出数据，导入到 D1。

## 📚 参考文档

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Next.js 文档](https://nextjs.org/docs)
- [Hono 框架文档](https://hono.dev/)

