# BettaFish 测试和部署启动指南

## 🚀 快速启动测试

### 当前状态
- ✅ 前端项目已创建
- ✅ Workers API项目已创建
- ✅ 所有代码文件已就绪
- ✅ 依赖已安装

### 立即开始测试

#### 方法1: 手动启动（推荐用于开发）

**终端1 - 启动Workers API**:
```powershell
cd bettafish-workers
npm run dev
```

**终端2 - 启动前端**:
```powershell
cd bettafish-frontend
npm run dev
```

**终端3 - 测试API** (可选):
```powershell
cd bettafish-workers
.\test-api.ps1
```

#### 方法2: 使用测试脚本

创建 `start-test.ps1` 在项目根目录:
```powershell
# 启动Workers API（后台）
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd bettafish-workers; npm run dev"

# 等待3秒
Start-Sleep -Seconds 3

# 启动前端（后台）
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd bettafish-frontend; npm run dev"

Write-Host "✅ 服务已启动" -ForegroundColor Green
Write-Host "Workers API: http://localhost:8787" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
```

## 📋 测试步骤

### Step 1: 验证Workers API

1. 打开浏览器访问: http://localhost:8787/api/health
2. 应该看到:
   ```json
   {
     "status": "ok",
     "timestamp": "...",
     "environment": "development"
   }
   ```

### Step 2: 验证前端

1. 打开浏览器访问: http://localhost:3000
2. 应该看到BettaFish主界面
3. 检查控制台是否有错误

### Step 3: 测试API连接

1. 在前端点击"配置"按钮
2. 应该能加载配置（即使后端未运行，也应该有错误提示）
3. 检查浏览器Network标签页的API请求

## 🔧 故障排除

### Workers API无法启动

**问题**: `npm run dev` 失败

**解决**:
1. 检查是否安装了wrangler: `npm list -g wrangler`
2. 如果没有，安装: `npm install -g wrangler`
3. 登录: `wrangler login`
4. 重新运行: `npm run dev`

### 前端无法连接API

**问题**: CORS错误或连接失败

**解决**:
1. 检查 `.env.local` 中的 `NEXT_PUBLIC_API_URL`
2. 确认Workers API正在运行
3. 检查 `wrangler.toml` 中的CORS配置

### 后端连接失败

**问题**: `Backend unreachable`

**解决**:
1. 这是正常的，如果Python后端未运行
2. 可以启动Python后端: `cd BettaFish-main && python app.py`
3. 或暂时忽略，测试前端和Workers API的连接

## 📦 准备部署

### 部署前检查清单

- [ ] 本地测试通过
- [ ] 所有功能正常
- [ ] 环境变量配置完成
- [ ] Cloudflare账户已登录

### 部署命令

**Workers API**:
```bash
cd bettafish-workers
wrangler deploy --env production
```

**前端Pages**:
```bash
cd bettafish-frontend
npm run build
npx @cloudflare/next-on-pages
wrangler pages deploy .vercel/output/static
```

## 📚 详细文档

- [TESTING_AND_DEPLOYMENT.md](./TESTING_AND_DEPLOYMENT.md) - 详细测试和部署指南
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - 部署检查清单
- [QUICK_START.md](./QUICK_START.md) - 快速开始指南

---

**下一步**: 按照上述步骤启动测试，然后进行部署

