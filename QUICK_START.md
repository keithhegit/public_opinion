# BettaFish 快速开始指南

## 🚀 5分钟快速测试

### 前置要求
- Node.js 18+
- npm 或 yarn
- Cloudflare账户（用于部署）

### Step 1: 安装依赖（已完成 ✅）

```bash
# Workers API
cd bettafish-workers
npm install

# 前端
cd ../bettafish-frontend
npm install
```

### Step 2: 配置环境变量

**前端** - 创建 `bettafish-frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8787
```

**Workers** - 创建 `bettafish-workers/.dev.vars`:
```env
ENVIRONMENT=development
BACKEND_URL=http://localhost:5000
```

### Step 3: 启动本地开发

**终端1 - Workers API**:
```bash
cd bettafish-workers
npm run dev
```
✅ 应该看到: `Listening on http://localhost:8787`

**终端2 - 前端**:
```bash
cd bettafish-frontend
npm run dev
```
✅ 应该看到: `Ready on http://localhost:3000`

### Step 4: 测试

1. 打开浏览器: http://localhost:3000
2. 测试健康检查: http://localhost:8787/api/health
3. 测试系统状态: http://localhost:8787/api/status

## 📦 部署到Cloudflare

### 1. 登录Cloudflare

```bash
wrangler login
```

### 2. 创建资源

```bash
# D1数据库
wrangler d1 create bettafish-db
# 复制输出的database_id到wrangler.toml

# KV命名空间
wrangler kv:namespace create "BETTAFISH_CACHE"
wrangler kv:namespace create "BETTAFISH_CACHE" --preview
# 复制输出的id到wrangler.toml
```

### 3. 更新配置

编辑 `bettafish-workers/wrangler.toml`:
- 替换 `database_id`
- 替换 `id` 和 `preview_id`

### 4. 部署Workers

```bash
cd bettafish-workers
npm run deploy:dev  # 开发环境
# 或
npm run deploy      # 生产环境
```

### 5. 部署前端

```bash
cd bettafish-frontend

# 安装Pages适配器
npm install @cloudflare/next-on-pages --save-dev

# 构建
npm run build
npx @cloudflare/next-on-pages

# 部署
wrangler pages deploy .vercel/output/static
```

## ✅ 验证部署

1. **Workers API**: 访问部署URL + `/api/health`
2. **前端**: 访问Pages部署URL
3. **测试功能**: 尝试搜索、配置管理等

## 🆘 遇到问题？

查看 [TESTING_AND_DEPLOYMENT.md](./TESTING_AND_DEPLOYMENT.md) 获取详细帮助。

