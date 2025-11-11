# 🚀 Railway 部署修复 - 立即执行

## 问题

`BettaFish-main/` 目录在 `.gitignore` 中被忽略，所以没有提交到 GitHub。Railway 从 GitHub 克隆时找不到这个目录。

## ✅ 立即修复步骤

### Step 1: 更新 .gitignore（已完成）

我已经更新了 `.gitignore`，注释掉了 `BettaFish-main/`。

### Step 2: 强制添加 BettaFish-main 到 Git

```bash
git add -f BettaFish-main/
git commit -m "Add BettaFish-main for Railway deployment"
git push
```

### Step 3: 在 Railway 中设置

1. 打开 Railway Dashboard
2. 进入项目 Settings
3. 设置 **Root Directory** 为: `BettaFish-main`
4. 点击 **Save**
5. Railway 会自动重新部署

## ⚠️ 如果文件太大

如果 `BettaFish-main` 目录太大（>100MB），GitHub 可能拒绝推送。可以：

### 选项A: 使用 Git LFS

```bash
git lfs install
git lfs track "BettaFish-main/**/*.pkl"
git lfs track "BettaFish-main/**/*.model"
git add .gitattributes
git add BettaFish-main/
git commit -m "Add BettaFish-main with LFS"
git push
```

### 选项B: 创建独立的部署仓库

1. 创建新仓库 `bettafish-backend`
2. 只推送 `BettaFish-main` 的内容
3. 在 Railway 中连接新仓库

## 📋 验证

推送后，检查 GitHub 仓库：
- 应该能看到 `BettaFish-main/` 目录
- 应该能看到 `Dockerfile` 在 `BettaFish-main/Dockerfile`

然后在 Railway 中重新部署即可。

---

**执行 Step 2 的命令后，Railway 应该能找到目录了！** ✅


