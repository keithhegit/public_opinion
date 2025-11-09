# BettaFish 测试和部署快速指南

## 🚀 快速开始

### 一键启动测试环境

```powershell
.\start-test.ps1
```

这将自动：
1. 检查并安装依赖
2. 启动Workers API (http://localhost:8787)
3. 启动前端 (http://localhost:3000)

### 手动启动

**终端1 - Workers API**:
```powershell
cd bettafish-workers
npm run dev
```

**终端2 - 前端**:
```powershell
cd bettafish-frontend
npm run dev
```

## 🧪 测试API

### 使用测试脚本

```powershell
cd bettafish-workers
.\test-api.ps1
```

### 手动测试

```powershell
# 健康检查
curl http://localhost:8787/api/health

# 系统状态
curl http://localhost:8787/api/status
```

## 📦 部署到Cloudflare

### 1. 配置资源

```powershell
# 登录
wrangler login

# 创建D1数据库
wrangler d1 create bettafish-db
# 复制database_id到wrangler.toml

# 创建KV
wrangler kv:namespace create "BETTAFISH_CACHE"
wrangler kv:namespace create "BETTAFISH_CACHE" --preview
# 复制id到wrangler.toml
```

### 2. 更新配置

编辑 `bettafish-workers/wrangler.toml`:
- 替换 `database_id`
- 替换KV的 `id` 和 `preview_id`
- 设置 `BACKEND_URL`

### 3. 部署

**使用脚本**:
```powershell
.\deploy.ps1 -Environment prod
```

**手动部署**:
```powershell
# Workers API
cd bettafish-workers
npm run deploy

# 前端
cd ../bettafish-frontend
npm run build
npx @cloudflare/next-on-pages
wrangler pages deploy .vercel/output/static
```

## 📚 详细文档

- [TESTING_AND_DEPLOYMENT.md](./TESTING_AND_DEPLOYMENT.md) - 完整测试和部署指南
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - 部署检查清单
- [START_TESTING.md](./START_TESTING.md) - 测试启动指南

---

**提示**: 首次部署前，请确保已配置Cloudflare资源并更新wrangler.toml

