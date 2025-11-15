# 检查后端服务状态

## 🔍 诊断步骤

### Step 1: 检查后端服务是否运行

在服务器上执行：

```bash
# 检查服务状态
sudo systemctl status bettafish

# 应该显示: Active: active (running)
```

### Step 2: 检查端口监听

```bash
# 检查端口 5000 是否监听
sudo netstat -tlnp | grep 5000
# 或
sudo ss -tlnp | grep 5000

# 应该看到类似: 0.0.0.0:5000 或 :::5000
```

### Step 3: 测试本地 API

```bash
# 测试系统状态 API
curl http://localhost:5000/api/system/status

# 应该返回 JSON: {"started":false,"starting":false,"success":true}

# 测试搜索 API（模拟请求）
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"测试"}'

# 查看返回的错误信息
```

### Step 4: 查看后端日志

```bash
# 查看最近的服务日志（最后50行）
sudo journalctl -u bettafish -n 50 --no-pager

# 实时查看日志
sudo journalctl -u bettafish -f

# 查看错误日志
sudo journalctl -u bettafish --since "10 minutes ago" | grep -i "error\|exception\|traceback"
```

### Step 5: 检查 Engine 日志文件

```bash
# 查看各个引擎的日志文件
tail -20 /home/bettafish/Public_Opinion/BettaFish-main/logs/insight.log
tail -20 /home/bettafish/Public_Opinion/BettaFish-main/logs/media.log
tail -20 /home/bettafish/Public_Opinion/BettaFish-main/logs/query.log
tail -20 /home/bettafish/Public_Opinion/BettaFish-main/logs/report.log
```

### Step 6: 测试 Workers 到后端的连接

```bash
# 从服务器测试 Workers API
curl https://bettafish-api-prod.keithhe2021.workers.dev/api/system/status

# 应该返回与本地相同的 JSON
```

## 🚨 常见问题

### 问题 1: 服务未运行

**症状**: `systemctl status` 显示 `inactive (dead)`

**解决**:
```bash
sudo systemctl start bettafish
sudo systemctl status bettafish
```

### 问题 2: 端口未监听

**症状**: `netstat` 或 `ss` 没有显示端口 5000

**解决**:
```bash
# 重启服务
sudo systemctl restart bettafish

# 等待几秒后再次检查
sleep 5
sudo ss -tlnp | grep 5000
```

### 问题 3: API 返回 500 错误

**症状**: `/api/search` 返回 500 Internal Server Error

**排查**:
1. 查看后端日志中的错误信息
2. 检查 Python 依赖是否完整
3. 检查环境变量是否正确
4. 检查数据库连接（如果使用）

### 问题 4: 404 错误（日志文件不存在）

**症状**: `/api/tasks/.../logs/insight` 返回 404

**说明**: 这是正常的，如果任务还没有完成或日志文件还没有生成，会返回 404。

## 📝 快速诊断脚本

将以下内容保存为 `check_backend.sh` 并执行：

```bash
#!/bin/bash
echo "=== 后端服务诊断 ==="
echo ""
echo "1. 服务状态:"
sudo systemctl status bettafish --no-pager -l | head -10
echo ""
echo "2. 端口监听:"
sudo ss -tlnp | grep 5000 || echo "端口 5000 未监听"
echo ""
echo "3. API 测试:"
curl -s http://localhost:5000/api/system/status || echo "API 无法访问"
echo ""
echo "4. 最近错误:"
sudo journalctl -u bettafish --since "5 minutes ago" | grep -i "error\|exception" | tail -5 || echo "无错误"
```

