# 🔧 Railway 部署修复指南

## 问题

Railway 选择了整个仓库根目录，但 Dockerfile 在 `BettaFish-main/` 子目录中，导致无法找到构建文件。

## ✅ 解决方案

### 方案1: 在 Railway Dashboard 设置根目录（推荐）

1. **进入 Railway 项目设置**
   - 打开你的 Railway 项目
   - 点击 **Settings** 标签

2. **设置根目录**
   - 找到 **Root Directory** 设置
   - 输入: `BettaFish-main`
   - 点击 **Save**

3. **重新部署**
   - Railway 会自动重新构建
   - 这次应该能找到 Dockerfile

### 方案2: 使用 railway.json 配置文件

我已经创建了 `railway.json` 文件，指定了 Dockerfile 的路径。

1. **提交配置文件**
   ```bash
   git add railway.json
   git commit -m "Add Railway configuration"
   git push
   ```

2. **在 Railway 中重新部署**
   - Railway 会自动读取 `railway.json`
   - 使用指定的 Dockerfile 路径

### 方案3: 创建独立的部署分支（最佳实践）

如果方案1和2都不行，可以创建一个只包含 `BettaFish-main` 内容的部署分支：

1. **创建部署分支**
   ```bash
   git checkout -b railway-deploy
   git subtree push --prefix=BettaFish-main origin railway-deploy
   ```

2. **在 Railway 中**
   - 选择 `railway-deploy` 分支
   - 根目录设置为 `/`（默认）

## 🚀 推荐步骤（方案1）

### Step 1: 在 Railway Dashboard 设置

1. 打开你的 Railway 项目
2. 点击 **Settings** 标签
3. 找到 **Root Directory** 字段
4. 输入: `BettaFish-main`
5. 点击 **Save**

### Step 2: 触发重新部署

1. 进入 **Deployments** 标签
2. 点击 **Redeploy** 或等待自动重新部署
3. 查看构建日志，应该能看到 Dockerfile

### Step 3: 配置环境变量

在 Railway Dashboard 的 **Variables** 标签中添加：

从 `BettaFish-main/.env.example` 复制所有环境变量，包括：
- 数据库配置
- LLM API Keys
- 其他配置

### Step 4: 获取部署 URL

部署成功后，Railway 会分配一个 URL，例如：
- `https://bettafish-production.up.railway.app`

### Step 5: 配置 Cloudflare

1. 在 Cloudflare Dashboard 更新 `BACKEND_URL`
2. 设置为 Railway 的 URL

## 📋 验证

部署成功后，检查：
- ✅ 构建日志显示 "Using Dockerfile"
- ✅ 服务状态为 "Active"
- ✅ 可以访问健康检查端点

## ⚠️ 注意事项

1. **环境变量**: 确保在 Railway 中配置了所有必要的环境变量
2. **数据库**: 如果使用 PostgreSQL，Railway 也提供 PostgreSQL 服务
3. **端口**: Railway 会自动设置 `PORT` 环境变量，可能需要调整代码

---

**按照方案1设置根目录后，应该可以正常部署！** ✅

