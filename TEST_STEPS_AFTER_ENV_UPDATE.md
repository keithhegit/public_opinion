# .env 更新后的测试步骤

## ✅ Step 1: 验证 .env 文件内容

```bash
# 检查 API Key 是否正确设置
sudo cat /home/bettafish/Public_Opinion/BettaFish-main/.env | grep BOCHA_WEB_SEARCH_API_KEY

# 应该看到：
# BOCHA_WEB_SEARCH_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd
```

---

## 🔄 Step 2: 重启服务以加载新环境变量

```bash
# 重启 bettafish 服务
sudo systemctl restart bettafish

# 检查服务状态
sudo systemctl status bettafish

# 等待几秒后，确认服务运行正常
# 应该看到 "Active: active (running)"
```

---

## 📋 Step 3: 检查服务日志

```bash
# 查看最近的日志（最后50行）
sudo journalctl -u bettafish -n 50 --no-pager

# 实时查看日志
sudo journalctl -u bettafish -f

# 查找 Bocha API 相关的日志
sudo journalctl -u bettafish | grep -i "bocha\|api.*key" | tail -20
```

**期望结果：**
- 不应该看到 "API Key 未找到" 或 "401 Unauthorized" 错误
- 应该看到服务正常启动的日志

---

## 🧪 Step 4: 测试 Bocha API（从服务器内部）

```bash
# 切换到 bettafish 用户
sudo su - bettafish

# 进入项目目录
cd /home/bettafish/Public_Opinion/BettaFish-main

# 激活虚拟环境（如果存在）
source venv/bin/activate 2>/dev/null || true

# 测试 Bocha API
curl -X POST https://api.bochaai.com/v1/ai-search \
  -H "Authorization: Bearer sk-f2d544f236214b4fb8d090861176e3dd" \
  -H "Content-Type: application/json; charset=utf-8" \
  -H "Accept: */*" \
  -d '{"query": "人工智能对未来教育的影响", "count": 5, "answer": true}'

# 退出 bettafish 用户
exit
```

**期望结果：**
- 返回 `code: 200`
- 包含 `conversation_id`、`messages` 等字段

---

## 🌐 Step 5: 测试前端搜索功能

1. **打开浏览器**，访问你的应用地址（例如：`http://你的服务器IP:5000`）

2. **执行搜索任务**：
   - 在前端界面输入搜索关键词
   - 点击搜索按钮
   - 观察是否正常返回结果

3. **检查引擎日志**：
   ```bash
   # 查看 Media Engine 日志（Bocha API 在这里使用）
   tail -f /home/bettafish/Public_Opinion/BettaFish-main/logs/media_engine.log
   
   # 或者查看所有引擎日志
   ls -la /home/bettafish/Public_Opinion/BettaFish-main/logs/
   ```

**期望结果：**
- 搜索任务成功执行
- 返回搜索结果
- 日志中没有 Bocha API 相关的错误

---

## 🔍 Step 6: 验证环境变量是否被正确加载

```bash
# 方法 1: 检查 systemd 服务环境变量
sudo systemctl show bettafish | grep EnvironmentFile

# 方法 2: 在 Python 中验证（如果应用有健康检查接口）
curl http://localhost:5000/api/health 2>/dev/null || echo "健康检查接口可能不存在"

# 方法 3: 检查应用启动日志中是否有环境变量加载信息
sudo journalctl -u bettafish | grep -i "env\|config" | tail -10
```

---

## ⚠️ 如果遇到问题

### 问题 1: 服务启动失败

```bash
# 查看详细错误日志
sudo journalctl -u bettafish -n 100 --no-pager

# 检查 .env 文件权限
ls -la /home/bettafish/Public_Opinion/BettaFish-main/.env
# 应该是：-rw------- (600) 权限
```

### 问题 2: API Key 仍然无效

```bash
# 确认 .env 文件内容
sudo cat /home/bettafish/Public_Opinion/BettaFish-main/.env | grep BOCHA

# 确认服务已重新加载环境变量
sudo systemctl daemon-reload
sudo systemctl restart bettafish
```

### 问题 3: 网络连接问题

```bash
# 测试网络连接
curl -I https://api.bochaai.com

# 测试 DNS 解析
nslookup api.bochaai.com
```

---

## ✅ 成功标志

如果以下所有条件都满足，说明配置成功：

- [x] `.env` 文件中包含正确的 `BOCHA_WEB_SEARCH_API_KEY`
- [x] 服务成功重启且状态为 `active (running)`
- [x] 服务日志中没有 API Key 相关错误
- [x] curl 测试返回 `code: 200`
- [x] 前端搜索功能正常工作
- [x] 引擎日志中没有 Bocha API 错误

---

## 📝 快速测试命令（一键执行）

```bash
#!/bin/bash
echo "=========================================="
echo "测试 Bocha API 配置"
echo "=========================================="

echo "1. 检查 .env 文件..."
sudo grep "BOCHA_WEB_SEARCH_API_KEY" /home/bettafish/Public_Opinion/BettaFish-main/.env

echo ""
echo "2. 检查服务状态..."
sudo systemctl status bettafish --no-pager -l | head -10

echo ""
echo "3. 测试 Bocha API..."
curl -s -X POST https://api.bochaai.com/v1/ai-search \
  -H "Authorization: Bearer sk-f2d544f236214b4fb8d090861176e3dd" \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "count": 1, "answer": true}' | grep -o '"code":[0-9]*' || echo "API 调用失败"

echo ""
echo "=========================================="
echo "测试完成"
echo "=========================================="
```

保存为 `test_bocha_config.sh`，然后运行：
```bash
chmod +x test_bocha_config.sh
./test_bocha_config.sh
```

