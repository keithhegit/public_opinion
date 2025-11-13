# Engine 错误修复指南

## ✅ 已修复的问题

### 1. Insight Engine - 缩进错误 ✅

**问题**: `IndentationError` 在 `db.py` 第 67 行

**修复**: 已修复 `try` 语句后的缩进问题

**状态**: 代码已提交，需要拉取更新

---

### 2. Query Engine - 配置缺失 ✅

**问题**: `QUERY_ENGINE_MODEL_NAME` 字段必需但未提供

**修复**: 已在 `QueryEngine/utils/config.py` 中添加默认值：
- `QUERY_ENGINE_BASE_URL`: `"https://api.z.ai/api/paas/v4/"`
- `QUERY_ENGINE_MODEL_NAME`: `"glm-4.6"`

**状态**: 代码已提交，需要拉取更新

---

### 3. Media Engine - Bocha API 401 错误 ⚠️

**问题**: `401 Client Error` 从 `https://api.bochaai.com/v1/ai-search`

**原因**: Bocha API Key 认证失败

**可能的原因**:
1. API Key 未设置或为空
2. API Key 无效或过期
3. API Key 格式不正确

---

## 🔧 修复步骤

### 在服务器上执行

```bash
# 1. 停止服务
sudo systemctl stop bettafish

# 2. 拉取最新代码
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && git pull"

# 3. 检查 .env 文件中的配置
sudo -u bettafish cat /home/bettafish/Public_Opinion/BettaFish-main/.env | grep -E "QUERY_ENGINE|BOCHA"
```

### 修复 Bocha API 401 错误

编辑 `.env` 文件：

```bash
sudo nano /home/bettafish/Public_Opinion/BettaFish-main/.env
```

**检查并更新以下配置**：

```env
# Bocha API Key（必需，用于 Media Engine 的多模态搜索）
BOCHA_WEB_SEARCH_API_KEY=你的Bocha_API_Key

# Query Engine 配置（如果缺失，添加以下行）
QUERY_ENGINE_API_KEY=你的GLM_API_Key
QUERY_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
QUERY_ENGINE_MODEL_NAME=glm-4.6
```

**重要**：
- `BOCHA_WEB_SEARCH_API_KEY` 必须设置且有效
- 如果 Bocha API Key 无效，Media Engine 的多模态搜索功能将被禁用
- Query Engine 的配置现在有默认值，但如果环境变量未设置，仍需要显式配置

### 重启服务

```bash
# 重启服务
sudo systemctl start bettafish

# 检查状态
sudo systemctl status bettafish

# 查看日志
sudo journalctl -u bettafish -f
```

---

## 📋 验证清单

### Insight Engine
- [ ] 代码已更新（git pull）
- [ ] 服务已重启
- [ ] 没有缩进错误
- [ ] Engine 可以正常启动

### Query Engine
- [ ] 代码已更新（git pull）
- [ ] `.env` 文件中配置了 `QUERY_ENGINE_API_KEY`
- [ ] 服务已重启
- [ ] 没有配置验证错误
- [ ] Engine 可以正常启动

### Media Engine
- [ ] `.env` 文件中配置了 `BOCHA_WEB_SEARCH_API_KEY`
- [ ] API Key 有效（不是过期或无效的 Key）
- [ ] 服务已重启
- [ ] 没有 401 错误
- [ ] Engine 可以正常启动

---

## 🔍 Bocha API Key 获取

如果 Bocha API Key 无效或未设置：

1. 访问 [Bocha AI 开放平台](https://open.bochaai.com/)
2. 注册/登录账号
3. 获取 API Key
4. 更新 `.env` 文件中的 `BOCHA_WEB_SEARCH_API_KEY`

**注意**: 如果无法获取有效的 Bocha API Key，Media Engine 的多模态搜索功能将被禁用，但其他功能仍可正常使用。

---

## 🐛 如果问题仍然存在

### Insight Engine 仍有错误

```bash
# 检查代码是否正确拉取
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && git log -1 --oneline"

# 检查 db.py 文件
sudo -u bettafish head -n 80 /home/bettafish/Public_Opinion/BettaFish-main/InsightEngine/utils/db.py | tail -n 20
```

### Query Engine 仍有错误

```bash
# 检查环境变量
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && source venv/bin/activate && python -c 'from QueryEngine.utils.config import settings; print(settings.QUERY_ENGINE_MODEL_NAME)'"
```

### Media Engine 仍有 401 错误

```bash
# 检查 API Key 是否正确设置
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && grep BOCHA_WEB_SEARCH_API_KEY .env"

# 测试 API Key（如果可能）
# 注意：这需要有效的 API Key
```

---

**执行上述步骤后，告诉我结果！** 🚀

