# BettaFish 测试和部署指南

## 📋 测试和部署流程

### Phase 1: 本地测试

#### Step 1: 安装依赖

```bash
# 安装Workers依赖
cd bettafish-workers
npm install

# 安装前端依赖（如果还没安装）
cd ../bettafish-frontend
npm install
```

#### Step 2: 配置环境变量

**Workers API配置** (`bettafish-workers/wrangler.toml`):
```toml
[env.development.vars]
ENVIRONMENT = "development"
BACKEND_URL = "http://localhost:5000"  # Python后端地址
```

**前端配置** (`bettafish-frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8787
```

#### Step 3: 本地测试

**终端1 - 启动Workers API**:
```bash
cd bettafish-workers
npm run dev
```
访问: http://localhost:8787

**终端2 - 启动前端**:
```bash
cd bettafish-frontend
npm run dev
```
访问: http://localhost:3000

**终端3 - 启动Python后端** (如果可用):
```bash
cd BettaFish-main
python app.py
```
访问: http://localhost:5000

#### Step 4: 测试API端点

```bash
# 健康检查
curl http://localhost:8787/api/health

# 系统状态
curl http://localhost:8787/api/status

# 测试搜索（需要后端运行）
curl -X POST http://localhost:8787/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"测试查询"}'
```

### Phase 2: Cloudflare资源配置

#### Step 1: 登录Cloudflare

```bash
wrangler login
```

#### Step 2: 创建D1数据库

```bash
wrangler d1 create bettafish-db
```

**输出示例**:
```
Created database bettafish-db
Database ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**更新 `wrangler.toml`**:
```toml
[[env.production.d1_databases]]
binding = "DB"
database_name = "bettafish-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # 替换为实际ID
```

#### Step 3: 创建KV命名空间

```bash
# 生产环境
wrangler kv:namespace create "BETTAFISH_CACHE"

# 预览环境
wrangler kv:namespace create "BETTAFISH_CACHE" --preview
```

**输出示例**:
```
Created namespace with ID "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**更新 `wrangler.toml`**:
```toml
[env.production.kv_namespaces]
binding = "CACHE"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  # 替换为实际ID
preview_id = "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"  # 替换为预览ID
```

#### Step 4: 设置Secrets

```bash
# 设置后端Token（如果需要）
wrangler secret put BACKEND_TOKEN
# 输入值后按回车
```

### Phase 3: 部署Workers API

#### Step 1: 构建检查

```bash
cd bettafish-workers
npm run build  # 如果有build脚本，或直接部署
```

#### Step 2: 部署到开发环境

```bash
npm run deploy:dev
```

#### Step 3: 测试部署的API

```bash
# 获取部署URL（从输出中获取）
curl https://bettafish-api-dev.your-subdomain.workers.dev/api/health
```

#### Step 4: 部署到生产环境

```bash
npm run deploy
```

### Phase 4: 部署前端到Cloudflare Pages

#### Step 1: 构建前端

```bash
cd bettafish-frontend
npm run build
```

#### Step 2: 安装Pages适配器

```bash
npm install @cloudflare/next-on-pages --save-dev
```

#### Step 3: 配置Next.js

更新 `next.config.ts`:
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://bettafish-api.your-subdomain.workers.dev',
  },
};

export default nextConfig;
```

#### Step 4: 构建Pages版本

```bash
npx @cloudflare/next-on-pages
```

#### Step 5: 部署到Pages

**方法1: 使用Wrangler**
```bash
wrangler pages deploy .vercel/output/static
```

**方法2: 使用GitHub集成**
1. 推送代码到GitHub
2. 在Cloudflare Dashboard连接仓库
3. 配置构建命令: `npm run build && npx @cloudflare/next-on-pages`
4. 配置输出目录: `.vercel/output/static`

#### Step 6: 配置环境变量

在Cloudflare Pages Dashboard:
- `NEXT_PUBLIC_API_URL` = `https://bettafish-api.your-subdomain.workers.dev`

## 🧪 测试清单

### API测试

- [ ] 健康检查: `GET /api/health`
- [ ] 系统状态: `GET /api/status`
- [ ] 启动Engine: `POST /api/start/insight`
- [ ] 停止Engine: `POST /api/stop/insight`
- [ ] 获取输出: `GET /api/output/insight`
- [ ] 搜索: `POST /api/search`
- [ ] 获取配置: `GET /api/config`
- [ ] 更新配置: `POST /api/config`
- [ ] 论坛日志: `GET /api/forum/log`
- [ ] 启动论坛: `POST /api/forum/start`
- [ ] 停止论坛: `POST /api/forum/stop`
- [ ] 生成报告: `POST /api/report/generate`
- [ ] 报告状态: `GET /api/report/status/:id`

### 前端测试

- [ ] 页面加载正常
- [ ] 搜索功能
- [ ] Engine启动/停止
- [ ] 状态轮询
- [ ] 配置管理
- [ ] 报告生成
- [ ] 控制台输出
- [ ] 错误处理

### 集成测试

- [ ] 前端 → Workers API → Python后端
- [ ] 缓存机制
- [ ] 错误处理
- [ ] 超时处理

## 🐛 常见问题

### 1. Workers API无法连接后端

**问题**: `Backend unreachable`

**解决**:
- 检查 `BACKEND_URL` 配置
- 确认Python后端运行
- 检查防火墙和端口

### 2. CORS错误

**问题**: 前端无法访问API

**解决**:
- 更新 `wrangler.toml` 中的CORS配置
- 添加前端域名到允许列表

### 3. KV缓存不工作

**问题**: 缓存未生效

**解决**:
- 检查KV命名空间ID配置
- 确认绑定名称正确
- 检查权限设置

### 4. 前端构建失败

**问题**: Next.js构建错误

**解决**:
- 检查TypeScript错误
- 确认所有依赖安装
- 检查环境变量配置

## 📊 部署检查清单

### 部署前
- [ ] 所有测试通过
- [ ] 代码无错误
- [ ] 环境变量配置完成
- [ ] Cloudflare资源创建完成
- [ ] Secrets设置完成

### 部署
- [ ] Workers API部署成功
- [ ] 前端Pages部署成功
- [ ] 域名配置完成
- [ ] SSL证书激活

### 部署后
- [ ] 健康检查通过
- [ ] API端点测试通过
- [ ] 前端功能正常
- [ ] 监控配置完成
- [ ] 文档更新完成

## 🔗 相关资源

- [Cloudflare Workers文档](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages文档](https://developers.cloudflare.com/pages/)
- [Next.js on Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)

---

**下一步**: 按照上述步骤逐步测试和部署

