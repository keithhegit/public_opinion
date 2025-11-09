# 🔧 Railway Build Timeout 修复指南

## 问题

Railway 部署时出现 **build timeout** 错误。

## 可能的原因

1. **路径配置问题**：Railway 需要在 Dashboard 中设置 Root Directory
2. **构建时间过长**：安装 Playwright 和 Python 依赖需要很长时间
3. **Dockerfile 路径不正确**

## ✅ 解决方案

### 方案1: 在 Railway Dashboard 设置 Root Directory（必须）

1. **打开 Railway Dashboard**
   - 进入你的项目
   - 点击 **Settings** 标签

2. **设置 Root Directory**
   - 找到 **Root Directory** 字段
   - 输入: `BettaFish-main`
   - 点击 **Save**

3. **更新 railway.json**
   - 我已经更新了 `railway.json`，将 `dockerfilePath` 改为 `Dockerfile`（因为 Root Directory 设置为 `BettaFish-main` 后，路径是相对于该目录的）

### 方案2: 优化 Dockerfile 以减少构建时间

我已经优化了 Dockerfile：
- 合并了 Playwright 安装步骤
- 添加了更多的缓存清理
- 优化了构建顺序

### 方案3: 如果仍然超时，考虑以下选项

#### 选项A: 使用多阶段构建（减少最终镜像大小）

可以创建一个更轻量的 Dockerfile，只在运行时安装必要的依赖。

#### 选项B: 延迟安装 Playwright

如果 Playwright 不是启动时必需的，可以在运行时按需安装。

#### 选项C: 使用 Railway 的构建缓存

Railway 会自动缓存 Docker 层，第二次构建会更快。

## 🚀 立即执行步骤

### Step 1: 提交更新的配置

```bash
git add railway.json BettaFish-main/Dockerfile
git commit -m "Fix Railway build timeout: optimize Dockerfile and update path config"
git push
```

### Step 2: 在 Railway Dashboard 设置

1. 打开 Railway 项目
2. **Settings** → **Root Directory** → 输入 `BettaFish-main` → **Save**
3. Railway 会自动重新部署

### Step 3: 监控构建

- 查看 **Deployments** 标签
- 构建时间应该在 5-10 分钟内完成
- 如果仍然超时，考虑升级 Railway 计划或进一步优化

## 📋 验证清单

- [ ] `railway.json` 已更新（`dockerfilePath: "Dockerfile"`）
- [ ] Railway Dashboard 中 Root Directory 设置为 `BettaFish-main`
- [ ] Dockerfile 已优化
- [ ] 代码已推送到 GitHub
- [ ] Railway 开始重新部署
- [ ] 构建成功（< 10 分钟）

## ⚠️ 注意事项

1. **Root Directory 设置很重要**：如果不设置，Railway 会在根目录查找 Dockerfile，找不到就会报错
2. **构建时间**：第一次构建可能需要 5-10 分钟，因为要下载很多依赖
3. **缓存**：后续构建会使用缓存，会快很多

---

**现在执行 Step 1 和 Step 2，然后等待 Railway 重新部署！** 🚀

