# Bocha API 诊断报告

## 📊 当前状态分析

### 1. 日志时间分析
- **旧错误时间**: 2025-11-13 10:15:11 和 10:15:24（401 错误）
- **服务重启时间**: 2025-11-13 15:23:18
- **结论**: 日志中的 401 错误是**重启之前的旧错误**，不是当前配置的问题

### 2. 代码逻辑检查
代码会按以下顺序读取 API Key：
```python
api_key = settings.BOCHA_WEB_SEARCH_API_KEY or settings.BOCHA_API_KEY
```

### 3. 环境变量配置
- ✅ `.env` 文件已更新：`BOCHA_WEB_SEARCH_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd`
- ✅ 服务已重启

---

## 🔍 诊断步骤

### Step 1: 验证环境变量是否被正确加载

```bash
# 检查 systemd 服务是否加载了 .env 文件
sudo systemctl show bettafish | grep EnvironmentFile

# 应该显示：
# EnvironmentFile=/home/bettafish/Public_Opinion/BettaFish-main/.env
```

### Step 2: 检查应用启动日志（重启后的新日志）

```bash
# 查看重启后的日志（15:23 之后）
sudo journalctl -u bettafish --since "2025-11-13 15:23:00" | grep -i "bocha\|api.*key\|warning\|error" | tail -30
```

### Step 3: 测试 Bocha API（从服务器内部）

```bash
# 测试 API 是否正常工作
curl -X POST https://api.bochaai.com/v1/ai-search \
  -H "Authorization: Bearer sk-f2d544f236214b4fb8d090861176e3dd" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{"query": "test", "count": 1, "answer": true}' | jq '.code'
```

### Step 4: 检查 Python 应用是否正确读取环境变量

```bash
# 进入 Python 环境测试（如果可能）
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && source venv/bin/activate && python -c \"from MediaEngine.utils.config import settings; print('BOCHA_WEB_SEARCH_API_KEY:', settings.BOCHA_WEB_SEARCH_API_KEY[:20] if settings.BOCHA_WEB_SEARCH_API_KEY else 'None')\""
```

### Step 5: 触发一次搜索任务，查看新日志

在前端执行一次搜索，然后查看日志：

```bash
# 实时查看日志
sudo journalctl -u bettafish -f

# 或者查看最近的日志
sudo journalctl -u bettafish --since "5 minutes ago" | grep -i "bocha\|401\|unauthorized"
```

---

## ⚠️ 可能的问题

### 问题 1: 环境变量未正确加载

**症状**: 日志中仍然显示 "Bocha API Key未找到"

**解决方案**:
```bash
# 确认 systemd 服务配置
sudo cat /etc/systemd/system/bettafish.service | grep EnvironmentFile

# 如果不存在，需要更新服务文件
# 应该包含：EnvironmentFile=/home/bettafish/Public_Opinion/BettaFish-main/.env
```

### 问题 2: .env 文件权限问题

**检查**:
```bash
ls -la /home/bettafish/Public_Opinion/BettaFish-main/.env
# 应该是：-rw------- (600) 权限，所有者是 bettafish
```

### 问题 3: Python 应用缓存了旧配置

**解决方案**:
```bash
# 完全重启服务（包括重新加载所有模块）
sudo systemctl stop bettafish
sleep 2
sudo systemctl start bettafish
```

---

## ✅ 验证清单

- [ ] systemd 服务配置中包含 `EnvironmentFile`
- [ ] `.env` 文件权限正确（600，所有者 bettafish）
- [ ] 服务重启后的日志中没有 "API Key未找到" 警告
- [ ] curl 测试返回 `code: 200`
- [ ] 前端搜索任务执行成功
- [ ] 新的日志中没有 401 错误

