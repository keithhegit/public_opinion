# 修复 502 Bad Gateway 错误

## 🔍 问题分析

### 错误信息
- 所有 API 请求都返回 502 错误
- 前端通过 Cloudflare Workers (`bettafish-api-prod.keithhe2021.workers.dev`) 访问后端
- 502 表示 Cloudflare Workers 无法连接到后端服务器

### 可能的原因
1. **后端服务未运行** - Flask 应用没有启动
2. **后端服务崩溃** - 应用启动后崩溃
3. **网络连接问题** - Cloudflare Workers 无法访问后端服务器
4. **防火墙阻止** - 服务器防火墙阻止了连接
5. **Cloudflare Workers 配置错误** - Workers 配置的后端地址不正确

---

## 🔧 诊断步骤

### Step 1: 检查后端服务状态

在服务器上执行：

```bash
# 检查服务状态
sudo systemctl status bettafish

# 查看最近的日志
sudo journalctl -u bettafish -n 50 --no-pager

# 检查服务是否在监听端口 5000
sudo netstat -tlnp | grep 5000
# 或
sudo ss -tlnp | grep 5000
```

### Step 2: 检查服务是否正常运行

```bash
# 检查进程
ps aux | grep "python.*app.py"

# 检查端口监听
sudo lsof -i :5000
```

### Step 3: 测试本地连接

```bash
# 在服务器上测试本地连接
curl http://localhost:5000/api/system/status

# 测试外部访问（从服务器本身）
curl http://14.136.93.109:5000/api/system/status
```

### Step 4: 检查防火墙

```bash
# 检查防火墙状态
sudo ufw status

# 如果防火墙开启，确保端口 5000 已开放
sudo ufw allow 5000/tcp
```

### Step 5: 检查 Cloudflare Workers 配置

需要检查 Cloudflare Workers 的配置，确保：
- 后端地址正确：`http://14.136.93.109:5000` 或 `http://api.keithhe.com:5000`
- Workers 有权限访问后端服务器

---

## 🚀 解决方案

### 方案 1: 重启后端服务

```bash
# 重启服务
sudo systemctl restart bettafish

# 等待几秒后检查状态
sleep 5
sudo systemctl status bettafish

# 查看日志确认启动成功
sudo journalctl -u bettafish -n 20 --no-pager
```

### 方案 2: 检查应用启动错误

```bash
# 查看完整错误日志
sudo journalctl -u bettafish --since "10 minutes ago" | grep -i "error\|exception\|traceback"

# 如果服务无法启动，尝试手动运行
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && source venv/bin/activate && python app.py"
```

### 方案 3: 检查代码更新后的兼容性问题

如果刚刚更新了代码，可能有语法错误或导入错误：

```bash
# 检查 Python 语法
cd /home/bettafish/Public_Opinion/BettaFish-main
python -m py_compile app.py
python -m py_compile templates/index.html  # 这个会失败，但可以检查其他 Python 文件

# 检查导入
python -c "from MediaEngine.utils.config import settings; print('OK')"
```

### 方案 4: 检查 Cloudflare Workers 配置

如果使用 Cloudflare Workers 作为反向代理，需要：
1. 登录 Cloudflare Dashboard
2. 检查 Workers 配置
3. 确认后端地址正确
4. 检查 Workers 是否有权限访问后端

---

## 📝 关于 Forum Engine 按钮不显示

502 错误可能导致前端无法正常加载，从而按钮不显示。

**解决顺序**：
1. 先修复 502 错误（确保后端服务正常运行）
2. 然后检查 Forum Engine 按钮是否显示

---

## ✅ 快速诊断脚本

```bash
#!/bin/bash
echo "============================================================"
echo "502 错误诊断"
echo "============================================================"

echo "1. 检查服务状态..."
sudo systemctl is-active bettafish && echo "   ✅ 服务运行中" || echo "   ❌ 服务未运行"

echo ""
echo "2. 检查端口监听..."
if sudo netstat -tlnp | grep -q ":5000"; then
    echo "   ✅ 端口 5000 正在监听"
    sudo netstat -tlnp | grep ":5000"
else
    echo "   ❌ 端口 5000 未监听"
fi

echo ""
echo "3. 测试本地连接..."
if curl -s http://localhost:5000/api/system/status > /dev/null; then
    echo "   ✅ 本地连接成功"
else
    echo "   ❌ 本地连接失败"
fi

echo ""
echo "4. 检查最近错误..."
sudo journalctl -u bettafish --since "5 minutes ago" | grep -i "error\|exception" | tail -5

echo ""
echo "============================================================"
```

