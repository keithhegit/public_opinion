# BettaFish Cloudflare 部署完整指南

## 📋 部署前准备

### 1. 确认已完成
- [x] 本地测试通过
- [x] 代码无错误
- [x] 环境变量配置完成
- [x] Cloudflare账户已注册

### 2. 需要的信息
- Cloudflare账户邮箱
- Cloudflare账户API Token（可选，用于CI/CD）

---

## 🚀 部署步骤

### Step 1: 登录Cloudflare

```powershell
# 安装Wrangler CLI（如果还没安装）
npm install -g wrangler

# 登录Cloudflare
wrangler login
```

**操作**:
1. 运行命令后会打开浏览器
2. 登录你的Cloudflare账户
3. 授权Wrangler访问

**验证**:
```powershell
wrangler whoami
# 应该显示你的账户信息
```

---

### Step 2: 创建D1数据库

#### 2.1 创建生产数据库

```powershell
wrangler d1 create bettafish-db
```

**输出示例**:
```
✅ Successfully created DB 'bettafish-db' in region APAC
Created your database using D1's new storage backend. The new storage backend is not yet recommended for production workloads, but backs up your data via snapshots to R2.

[[d1_databases]]
binding = "DB"
database_name = "bettafish-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

#### 2.2 创建开发数据库

```powershell
wrangler d1 create bettafish-db-dev
```

#### 2.3 更新wrangler.toml

编辑 `bettafish-workers/wrangler.toml`:

```toml
# 生产环境
[[env.production.d1_databases]]
binding = "DB"
database_name = "bettafish-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # 替换为实际ID

# 开发环境
[[env.development.d1_databases]]
binding = "DB"
database_name = "bettafish-db-dev"
database_id = "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy"  # 替换为实际ID
```

---

### Step 3: 创建Workers KV命名空间

#### 3.1 创建生产KV

```powershell
# 生产环境
wrangler kv:namespace create "BETTAFISH_CACHE"

# 预览环境（用于开发）
wrangler kv:namespace create "BETTAFISH_CACHE" --preview
```

**输出示例**:
```
🌀  Creating namespace with title "BETTAFISH_CACHE"
✨  Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "CACHE", id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }

🌀  Creating namespace with title "BETTAFISH_CACHE_preview"
✨  Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "CACHE", preview_id = "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy" }
```

#### 3.2 创建开发KV

```powershell
# 开发环境
wrangler kv:namespace create "BETTAFISH_CACHE_DEV"

# 开发预览环境
wrangler kv:namespace create "BETTAFISH_CACHE_DEV" --preview
```

#### 3.3 更新wrangler.toml

编辑 `bettafish-workers/wrangler.toml`:

```toml
# 生产环境
[env.production.kv_namespaces]
binding = "CACHE"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"           # 生产ID
preview_id = "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"   # 预览ID

# 开发环境
[env.development.kv_namespaces]
binding = "CACHE"
id = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"           # 开发ID
preview_id = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"   # 开发预览ID
```

---

### Step 4: 设置环境变量和Secrets

#### 4.1 设置生产环境变量

编辑 `bettafish-workers/wrangler.toml`:

```toml
[env.production.vars]
ENVIRONMENT = "production"
BACKEND_URL = "https://your-backend-api.com"  # 替换为实际后端URL
```

#### 4.2 设置Secrets（如果需要）

```powershell
# 设置后端Token（如果需要认证）
wrangler secret put BACKEND_TOKEN --env production
# 输入值后按回车

# 开发环境
wrangler secret put BACKEND_TOKEN --env development
```

---

### Step 5: 部署Workers API

#### 5.1 部署到开发环境

```powershell
cd bettafish-workers
npm run deploy:dev
```

**或使用wrangler**:
```powershell
wrangler deploy --env development
```

**验证**:
- 查看输出中的部署URL
- 访问: `https://bettafish-api-dev.your-subdomain.workers.dev/api/health`

#### 5.2 部署到生产环境

```powershell
npm run deploy
```

**或使用wrangler**:
```powershell
wrangler deploy --env production
```

**验证**:
- 查看输出中的部署URL
- 访问: `https://bettafish-api-prod.your-subdomain.workers.dev/api/health`

---

### Step 6: 部署前端到Cloudflare Pages

#### 6.1 安装Pages适配器

```powershell
cd bettafish-frontend
npm install @cloudflare/next-on-pages --save-dev
```

#### 6.2 配置Next.js

确保 `next.config.ts` 包含:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://bettafish-api-prod.your-subdomain.workers.dev',
  },
};

export default nextConfig;
```

#### 6.3 构建Pages版本

```powershell
# 构建Next.js应用
npm run build

# 适配为Pages格式
npx @cloudflare/next-on-pages
```

#### 6.4 部署到Pages

**方法1: 使用Wrangler CLI**

```powershell
wrangler pages deploy .vercel/output/static --project-name=bettafish-frontend
```

**方法2: 使用GitHub集成（推荐）**

1. 推送代码到GitHub仓库
2. 在Cloudflare Dashboard:
   - 进入 **Pages**
   - 点击 **Create a project**
   - 选择 **Connect to Git**
   - 选择你的仓库
   - 配置构建设置:
     - **Build command**: `npm run build && npx @cloudflare/next-on-pages`
     - **Build output directory**: `.vercel/output/static`
     - **Root directory**: `bettafish-frontend` (如果仓库根目录)
   - 添加环境变量:
     - `NEXT_PUBLIC_API_URL` = `https://bettafish-api-prod.your-subdomain.workers.dev`
   - 点击 **Save and Deploy**

#### 6.5 配置自定义域名（可选）

在Cloudflare Pages Dashboard:
1. 进入项目设置
2. 点击 **Custom domains**
3. 添加你的域名
4. 按照提示配置DNS

---

## ✅ 部署后验证

### 1. 验证Workers API

```powershell
# 健康检查
curl https://bettafish-api-prod.your-subdomain.workers.dev/api/health

# 系统状态
curl https://bettafish-api-prod.your-subdomain.workers.dev/api/status
```

### 2. 验证前端

- 访问Pages部署URL
- 测试所有功能:
  - [ ] 页面加载正常
  - [ ] 搜索功能
  - [ ] 配置管理
  - [ ] 报告生成
  - [ ] Engine管理

### 3. 验证集成

- [ ] 前端可以连接Workers API
- [ ] API可以连接Python后端（如果运行）
- [ ] 缓存机制正常
- [ ] 错误处理正常

---

## 🔧 配置更新

### 更新CORS配置

编辑 `bettafish-workers/src/index.ts`:

```typescript
app.use(
  '*',
  cors({
    origin: [
      'http://localhost:3000',
      'https://bettafish-frontend.pages.dev',  // 添加Pages URL
      'https://your-domain.com'                // 添加自定义域名
    ],
    credentials: true,
  })
);
```

重新部署:
```powershell
cd bettafish-workers
npm run deploy
```

---

## 📊 监控和日志

### 查看Workers日志

```powershell
# 实时日志
wrangler tail --env production

# 或访问Cloudflare Dashboard
# Workers > bettafish-api-prod > Logs
```

### 查看Pages日志

在Cloudflare Dashboard:
- Pages > bettafish-frontend > Functions > Logs

---

## 🐛 故障排除

### 问题1: 部署失败

**检查**:
- 确认wrangler.toml配置正确
- 确认所有ID都已更新
- 查看错误信息

**解决**:
```powershell
# 查看详细错误
wrangler deploy --env production --verbose
```

### 问题2: API返回错误

**检查**:
- Workers日志
- 后端URL配置
- CORS配置

**解决**:
- 检查 `BACKEND_URL` 是否正确
- 确认后端服务运行
- 检查CORS允许的域名

### 问题3: 前端无法连接API

**检查**:
- 环境变量 `NEXT_PUBLIC_API_URL`
- CORS配置
- 浏览器Console错误

**解决**:
- 更新Pages环境变量
- 重新部署前端
- 检查API URL是否正确

---

## 📝 部署检查清单

### 部署前
- [ ] Cloudflare账户已登录
- [ ] D1数据库已创建
- [ ] KV命名空间已创建
- [ ] wrangler.toml已更新所有ID
- [ ] 环境变量已配置
- [ ] Secrets已设置（如需要）

### 部署中
- [ ] Workers API部署成功
- [ ] 前端Pages部署成功
- [ ] 获取部署URL

### 部署后
- [ ] 健康检查通过
- [ ] 所有API端点测试通过
- [ ] 前端功能正常
- [ ] 监控配置完成
- [ ] 文档更新完成

---

## 🎯 下一步

部署完成后:
1. 配置监控和告警
2. 设置自定义域名
3. 优化性能
4. 进行负载测试

---

**详细文档**: 参考 [TESTING_AND_DEPLOYMENT.md](./TESTING_AND_DEPLOYMENT.md)

