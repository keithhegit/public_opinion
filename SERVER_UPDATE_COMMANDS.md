# 服务器后端更新完整命令

## 📋 在服务器上执行（已 SSH 进入）

### 完整更新流程

```bash
# 1. 切换到后端目录
cd /home/bettafish/Public_Opinion/BettaFish-main

# 2. 检查当前分支
git branch

# 3. 切换到 main 分支（如果不在 main）
git checkout main

# 4. 拉取最新代码
git pull origin main

# 5. 检查是否有未提交的更改（如果有冲突会提示）
git status

# 6. 检查是否需要更新依赖（可选，如果有新依赖）
source venv/bin/activate
pip install -r requirements.txt
deactivate

# 7. 重启服务
sudo systemctl restart bettafish

# 8. 等待几秒后检查服务状态
sleep 5
sudo systemctl status bettafish

# 9. 查看最近的服务日志（确认启动成功）
sudo journalctl -u bettafish -n 50 --no-pager
```

## 🚀 快速更新（一行命令）

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main && git checkout main && git pull origin main && sudo systemctl restart bettafish && sleep 3 && sudo systemctl status bettafish
```

## 🔍 验证更新

### 检查代码是否更新

```bash
# 查看最新的 commit
cd /home/bettafish/Public_Opinion/BettaFish-main
git log --oneline -5

# 应该看到最新的 commit，例如：
# ce46021 Fix: Add tasks API routes to Workers and optimize /api/tasks/clear to prevent timeout
# 07d740e Fix: Remove async from downloadForumLog and fix ESLint config import
```

### 检查服务是否正常运行

```bash
# 测试本地 API
curl http://localhost:5000/api/system/status

# 应该返回 JSON 响应，例如：
# {"started":false,"starting":false,"success":true}
```

### 检查新功能是否可用

```bash
# 测试任务管理 API（应该返回 JSON）
curl http://localhost:5000/api/tasks/history

# 测试清空任务 API（应该返回成功）
curl -X POST http://localhost:5000/api/tasks/clear \
  -H "Content-Type: application/json"
```

## 🚨 如果遇到问题

### 问题 1: Git pull 失败（有本地更改）

```bash
# 查看本地更改
git status

# 选项 A: 暂存本地更改
git stash
git pull origin main
git stash pop

# 选项 B: 放弃本地更改（谨慎使用）
git reset --hard origin/main
git pull origin main
```

### 问题 2: 服务重启失败

```bash
# 查看详细错误日志
sudo journalctl -u bettafish -n 100 --no-pager

# 检查 Python 语法
cd /home/bettafish/Public_Opinion/BettaFish-main
source venv/bin/activate
python -m py_compile app.py
deactivate
```

### 问题 3: 权限问题

```bash
# 如果 git pull 提示权限问题，使用 bettafish 用户
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && git pull origin main"
```

## 📝 完整命令序列（复制粘贴）

```bash
# 切换到后端目录
cd /home/bettafish/Public_Opinion/BettaFish-main

# 确保在 main 分支
git checkout main

# 拉取最新代码
git pull origin main

# 重启服务
sudo systemctl restart bettafish

# 等待并检查状态
sleep 5
sudo systemctl status bettafish

# 测试 API
curl http://localhost:5000/api/system/status
```

## ✅ 更新完成检查清单

- [ ] 代码已拉取（`git log` 显示最新 commit）
- [ ] 服务已重启（`systemctl status` 显示 `active (running)`）
- [ ] API 可以访问（`curl` 返回 JSON）
- [ ] 没有错误日志（`journalctl` 没有错误信息）

