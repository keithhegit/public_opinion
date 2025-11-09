# 🔧 Railway 端口配置修复

## 问题

Flask 应用从 `config.py` 读取端口，但 Railway 通过环境变量 `PORT` 提供端口。需要修改 `app.py` 优先使用环境变量。

## ✅ 已修复

我已经更新了 `BettaFish-main/app.py`，现在会：
1. **优先使用环境变量** `PORT` 和 `HOST`（Railway 自动提供）
2. **如果没有环境变量，才使用配置文件**中的值

## 🚀 下一步

### Step 1: 提交更改

```bash
git add BettaFish-main/app.py
git commit -m "Fix: Use environment variables for PORT and HOST in Railway"
git push
```

### Step 2: Railway 自动重新部署

Railway 检测到 GitHub 更新后会自动重新部署。

### Step 3: 等待部署完成

1. 在 Railway Dashboard 中查看部署状态
2. 等待部署完成（通常 5-10 分钟）
3. 查看部署日志，确认没有错误

### Step 4: 测试

部署完成后，访问：
```
https://publicopinion-production.up.railway.app/api/status
```

应该返回 JSON 数据，而不是 404。

## 📋 验证清单

- [ ] 代码已提交到 GitHub
- [ ] Railway 自动触发重新部署
- [ ] 部署日志显示成功
- [ ] 服务状态为 "Active"
- [ ] `/api/status` 端点返回 JSON 数据

## 🔍 如果仍然有问题

### 检查部署日志

在 Railway Dashboard 中：
1. 进入 **Deployments** 标签
2. 查看最新部署的日志
3. 查找：
   - "Flask服务器已启动，访问地址: http://..."
   - 任何错误信息

### 检查服务状态

1. 进入服务详情
2. 查看 **Metrics** 标签
3. 确认有 CPU/内存使用

### 检查环境变量

在 Railway Dashboard 的 **Variables** 标签中：
- Railway 会自动提供 `PORT` 环境变量
- 不需要手动设置（除非你想覆盖）

---

**现在提交代码并等待 Railway 重新部署！** 🚀

