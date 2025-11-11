# 🚀 Railway 快速修复指南

## 问题

Railway 选择了整个仓库根目录，但 Dockerfile 在 `BettaFish-main/` 子目录中。

## ✅ 解决方案（最简单）

### 在 Railway Dashboard 设置根目录

1. **打开 Railway 项目**
   - 进入你的 Railway Dashboard
   - 点击你的项目

2. **进入设置**
   - 点击 **Settings** 标签
   - 向下滚动找到 **Root Directory** 字段

3. **设置根目录**
   - 在 **Root Directory** 输入框中输入: `BettaFish-main`
   - 点击 **Save**

4. **重新部署**
   - Railway 会自动重新构建
   - 这次应该能找到 Dockerfile 了

## 📋 完整步骤

### Step 1: 设置根目录
- Railway Dashboard → Settings → Root Directory → 输入 `BettaFish-main` → Save

### Step 2: 配置环境变量
在 Railway Dashboard 的 **Variables** 标签中添加所有必要的环境变量：

**必需的环境变量**（从 `BettaFish-main/.env.example` 复制）:
- `DB_HOST` - 数据库主机
- `DB_PORT` - 数据库端口
- `DB_USER` - 数据库用户名
- `DB_PASSWORD` - 数据库密码
- `DB_NAME` - 数据库名称
- `INSIGHT_ENGINE_API_KEY` - Insight Engine API Key
- `MEDIA_ENGINE_API_KEY` - Media Engine API Key
- `QUERY_ENGINE_API_KEY` - Query Engine API Key
- `REPORT_ENGINE_API_KEY` - Report Engine API Key
- 其他 LLM 配置...

**Railway 自动设置**:
- `PORT` - Railway 会自动设置，代码已支持

### Step 3: 等待部署完成
- 查看 **Deployments** 标签
- 等待构建完成（可能需要 5-10 分钟，因为要安装很多依赖）

### Step 4: 获取部署 URL
部署成功后，Railway 会分配一个 URL，例如：
- `https://bettafish-production.up.railway.app`

### Step 5: 配置 Cloudflare
1. 打开 Cloudflare Dashboard
2. 进入 Workers & Pages → bettafish-api-prod
3. Settings → Variables
4. 找到 `BACKEND_URL`，更新为 Railway 的 URL
5. 保存

## ⚠️ 注意事项

1. **数据库**: Railway 也提供 PostgreSQL 服务，可以在同一个项目中添加
2. **端口**: Railway 会自动设置 `PORT` 环境变量，代码已支持
3. **构建时间**: 首次构建可能需要 10-15 分钟（安装 Playwright 等依赖）

## 🔍 验证部署

部署成功后，测试 API：
```bash
curl https://your-railway-url.up.railway.app/api/status
```

应该返回系统状态。

---

**按照上述步骤设置根目录后，应该可以正常部署！** ✅

