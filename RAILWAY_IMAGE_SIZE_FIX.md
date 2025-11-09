# 🔧 Railway 镜像大小优化（10GB → <4GB）

## 问题

Docker 镜像大小为 **10GB**，超过了 Railway 免费计划的 **4GB 限制**。

## ✅ 已完成的优化

### 1. 优化 `.dockerignore`

排除了以下大文件：
- 模型文件（`.pkl`, `.pth`, `.h5`, `.ckpt`）
- 报告和日志目录
- 测试数据（`.csv`, `.ipynb`）
- 文档和图片（保留必要的）
- Playwright 浏览器缓存
- 数据库文件

### 2. 优化 `Dockerfile`

- 减少系统依赖（只保留必要的）
- 只安装 Chromium 浏览器（不安装所有浏览器）
- 清理构建缓存
- 删除不必要的文件（`__pycache__`, `.pyc` 等）
- 删除测试数据和模型文件

## 🚀 下一步

### Step 1: 提交更改

```bash
git add BettaFish-main/.dockerignore BettaFish-main/Dockerfile
git commit -m "Optimize Docker image size for Railway deployment"
git push
```

### Step 2: Railway 自动重新部署

Railway 检测到 GitHub 更新后会自动重新部署。

### Step 3: 监控构建

在 Railway Dashboard 中：
1. 进入 **Deployments** 标签
2. 查看新的部署进度
3. 检查镜像大小是否 < 4GB

## 📊 预期结果

优化后，镜像大小应该从 **10GB** 减少到大约 **2-3GB**：
- ✅ 排除了大文件（模型、报告、日志）
- ✅ 减少了系统依赖
- ✅ 只安装必要的浏览器
- ✅ 清理了构建缓存

## 🔍 如果仍然超过 4GB

### 进一步优化选项

1. **使用多阶段构建**：
   - 在构建阶段安装依赖
   - 在运行阶段只复制必要的文件

2. **排除更多文件**：
   - 如果不需要 Streamlit，可以排除相关依赖
   - 如果不需要某些引擎，可以排除相关代码

3. **使用 Alpine 基础镜像**：
   - `python:3.11-alpine` 比 `python:3.11-slim` 更小

4. **考虑升级 Railway 计划**：
   - 如果需要保留所有功能，可以考虑升级到付费计划

## 📋 验证清单

- [ ] `.dockerignore` 已更新
- [ ] `Dockerfile` 已优化
- [ ] 代码已提交到 GitHub
- [ ] Railway 开始重新部署
- [ ] 新镜像大小 < 4GB
- [ ] 部署成功

---

**现在提交代码并等待 Railway 重新部署！** 🚀

