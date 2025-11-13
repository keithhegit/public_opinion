# 移除 Cloudflare KV 缓存 - 实施指南

## 🎯 目标

完全移除 Workers 中的 KV 缓存，直接转发所有请求到 Python 后端。

---

## 📋 需要修改的文件

### 1. `bettafish-workers/src/routes/status.ts`
### 2. `bettafish-workers/src/routes/engines.ts`
### 3. `bettafish-workers/src/routes/config.ts`
### 4. `bettafish-workers/src/routes/forum.ts`
### 5. `bettafish-workers/src/routes/report.ts`
### 6. `bettafish-workers/src/routes/search.ts`
### 7. `bettafish-workers/src/index.ts` (移除 CACHE 类型定义)
### 8. `bettafish-workers/wrangler.toml` (移除 KV 配置)

---

## 🔧 修改步骤

### Step 1: 修改路由文件（移除缓存逻辑）

#### 示例：`routes/status.ts`

```typescript
// 修改前
import { getCachedData, setCachedData } from '../utils/cache';

export const statusRoutes = new Hono<{ Bindings: Env }>()
  .get('/status', async (c) => {
    const cacheKey = 'system:status';
    const cached = await getCachedData(cacheKey, c.env.CACHE);
    if (cached) {
      return c.json(cached);
    }
    
    // 获取后端数据
    const response = await fetch(`${c.env.BACKEND_URL}/api/system/status`);
    const result = await response.json();
    
    await setCachedData(cacheKey, result, c.env.CACHE, 5);
    return c.json(result);
  });

// 修改后
export const statusRoutes = new Hono<{ Bindings: Env }>()
  .get('/status', async (c) => {
    // 直接转发到后端
    const response = await fetch(`${c.env.BACKEND_URL}/api/system/status`);
    if (!response.ok) {
      return c.json({ error: 'Backend unavailable' }, 503);
    }
    const result = await response.json();
    return c.json(result);
  });
```

### Step 2: 移除 CACHE 类型定义

#### `src/index.ts`

```typescript
// 修改前
export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;  // 移除这行
  BACKEND_URL: string;
  BACKEND_TOKEN?: string;
  ENVIRONMENT: string;
}

// 修改后
export interface Env {
  DB: D1Database;
  // CACHE: KVNamespace;  // 已移除
  BACKEND_URL: string;
  BACKEND_TOKEN?: string;
  ENVIRONMENT: string;
}
```

### Step 3: 移除 wrangler.toml 中的 KV 配置

```toml
# 修改前
[env.production.kv_namespaces]
binding = "CACHE"
id = "your-kv-namespace-id"
preview_id = "your-preview-kv-namespace-id"

# 修改后
# KV 配置已移除
```

### Step 4: 可选：删除 cache.ts 文件

如果不再需要，可以删除 `src/utils/cache.ts` 文件。

---

## ✅ 验证步骤

### 1. 本地测试

```bash
cd bettafish-workers
npm run dev
```

测试所有 API 端点是否正常工作。

### 2. 部署到 Cloudflare

```bash
npm run deploy
```

### 3. 验证功能

- ✅ 所有 API 端点正常响应
- ✅ 不再有 KV 相关的错误
- ✅ 响应时间可接受（< 500ms）

---

## 📊 预期影响

### 性能影响

- **响应时间增加**：+50-200ms（通常可接受）
- **后端负载**：增加 10-20%（取决于请求频率）

### 功能影响

- ✅ **无功能影响**：所有功能正常工作
- ✅ **无数据丢失**：KV 只用于缓存，不存储持久数据

---

## 🚀 快速实施

如果需要快速实施，我可以帮你修改所有相关文件。

