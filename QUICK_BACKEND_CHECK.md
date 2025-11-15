# 快速检查后端状态

## 🚨 问题症状

- 前端显示四个引擎都"已启动"（绿色勾）
- 但点击"搜索"按钮时，console 显示：
  - `POST /api/search` 返回 **500 Internal Server Error**
  - `GET /api/tasks/.../logs/insight` 返回 **404**（日志文件不存在，这是正常的）

## 🔍 快速诊断命令

在服务器上执行以下命令：

```bash
# 1. 检查服务是否运行
sudo systemctl status bettafish

# 2. 检查端口是否监听
sudo ss -tlnp | grep 5000

# 3. 测试本地 API
curl http://localhost:5000/api/system/status

# 4. 测试搜索 API（查看具体错误）
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"测试"}' \
  -v

# 5. 查看最近的后端日志（查找错误）
sudo journalctl -u bettafish -n 100 --no-pager | grep -i "error\|exception\|traceback" | tail -20
```

## 📋 可能的原因

### 原因 1: 后端服务未运行

**检查**:
```bash
sudo systemctl status bettafish
```

**如果显示 `inactive (dead)`**:
```bash
sudo systemctl start bettafish
sudo systemctl status bettafish
```

### 原因 2: 后端服务崩溃

**检查日志**:
```bash
sudo journalctl -u bettafish -n 50 --no-pager
```

**如果看到 Python 错误**:
- 可能是代码错误
- 可能是依赖缺失
- 可能是环境变量问题

### 原因 3: 引擎未真正启动

**检查**:
```bash
# 检查进程
ps aux | grep streamlit

# 检查端口
sudo ss -tlnp | grep -E "8501|8502|8503|8504"
```

**如果引擎未启动**:
- 前端显示的"已启动"可能是缓存的状态
- 需要在前端点击"启动引擎"按钮

### 原因 4: `/api/search` 内部错误

**可能的原因**:
1. `check_app_status()` 函数出错
2. `execute_engine_search()` 函数出错
3. `save_task_to_index()` 函数出错
4. 文件权限问题（无法创建日志文件或任务目录）

**检查**:
```bash
# 查看详细错误日志
sudo journalctl -u bettafish --since "5 minutes ago" | tail -50

# 检查文件权限
ls -la /home/bettafish/Public_Opinion/BettaFish-main/logs/
ls -la /home/bettafish/Public_Opinion/BettaFish-main/tasks_history/
```

## 🔧 解决方案

### 方案 1: 重启后端服务

```bash
sudo systemctl restart bettafish
sleep 5
sudo systemctl status bettafish
```

### 方案 2: 检查并修复文件权限

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main
sudo chown -R bettafish:bettafish logs/ tasks_history/
chmod -R 755 logs/ tasks_history/
```

### 方案 3: 检查代码更新

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main
git pull
sudo systemctl restart bettafish
```

### 方案 4: 查看完整错误信息

执行测试命令后，将错误信息发给我，我可以帮你诊断具体问题。

## 📝 测试步骤

1. **执行快速诊断命令**（上面的命令）
2. **将输出结果发给我**，特别是：
   - `systemctl status` 的输出
   - `curl` 测试的响应
   - 日志中的错误信息

3. **如果服务未运行**，执行重启命令
4. **如果服务运行但 API 返回 500**，查看日志中的具体错误

