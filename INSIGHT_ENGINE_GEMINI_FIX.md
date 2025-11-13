# Insight Engine Gemini API 地理位置限制修复指南

## 🔍 问题诊断

### 错误信息

```
Error code: 400 - [{'error': {'code': 400, 'message': 'User location is not supported for the API use.', 'status': 'FAILED_PRECONDITION'}}]
```

### 根本原因

Insight Engine 配置使用了 **Gemini API**，但服务器位置（香港）不支持 Gemini API 的地理位置限制。

### 日志证据

从 `report_engine_log_2025-11-13T09-56-19-732Z.txt` 中可以看到：

```
2025-11-12 17:21:22.400 | INFO | InsightEngine.agent:__init__:60 - 使用LLM: {'provider': 'gemini', 'model': 'gemini-2.5-pro', 'api_base': 'https://generativelanguage.googleapis.com/v1beta/openai/'}
2025-11-12 17:21:22.437 | ERROR | InsightEngine.llms.base:stream_invoke:147 - 流式请求失败: Error code: 400 - [{'error': {'code': 400, 'message': 'User location is not supported for the API use.', 'status': 'FAILED_PRECONDITION'}}]
```

---

## ✅ 解决方案

### 方案：使用 GLM API（推荐）

GLM API 支持香港位置，且与 OpenAI API 兼容。

### 配置步骤

#### 1. 检查当前配置

在服务器上检查 `.env` 文件：

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main
cat .env | grep INSIGHT_ENGINE
```

**当前可能的问题配置**：
```env
INSIGHT_ENGINE_API_KEY=AIzaSy...  # Gemini API Key
INSIGHT_ENGINE_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
INSIGHT_ENGINE_MODEL_NAME=gemini-2.5-pro
```

#### 2. 更新配置

使用 GLM API 配置：

```env
# Insight Engine 配置（使用 GLM API，支持香港位置）
INSIGHT_ENGINE_API_KEY=你的GLM_API_Key  # 从 Z.AI (https://docs.z.ai/) 获取
INSIGHT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
INSIGHT_ENGINE_MODEL_NAME=glm-4.6
```

#### 3. 编辑 .env 文件

```bash
nano /home/bettafish/Public_Opinion/BettaFish-main/.env
```

找到以下行并更新：
- `INSIGHT_ENGINE_API_KEY` → 改为 GLM API Key
- `INSIGHT_ENGINE_BASE_URL` → 改为 `https://api.z.ai/api/paas/v4/`
- `INSIGHT_ENGINE_MODEL_NAME` → 改为 `glm-4.6`

#### 4. 重启服务

```bash
sudo systemctl restart bettafish
```

#### 5. 验证配置

检查服务日志，确认 Insight Engine 使用 GLM：

```bash
sudo journalctl -u bettafish -n 50 | grep -i insight
```

应该看到类似：
```
使用LLM: {'provider': 'openai-compatible', 'model': 'glm-4.6', 'api_base': 'https://api.z.ai/api/paas/v4/'}
```

---

## 🔧 代码逻辑说明

### Insight Engine LLM Provider 推断逻辑

在 `InsightEngine/llms/base.py` 中：

```python
# 根据 base_url 或 model_name 推断 provider
if base_url and "generativelanguage.googleapis.com" in base_url:
    self.provider = "gemini"  # ❌ 这会导致使用 Gemini
elif base_url and "moonshot.cn" in base_url:
    self.provider = "moonshot"
elif base_url and "deepseek.com" in base_url:
    self.provider = "deepseek"
elif model_name.startswith("gemini"):
    self.provider = "gemini"  # ❌ 这也会导致使用 Gemini
else:
    self.provider = "openai-compatible"  # ✅ 使用 GLM 时会到这里
```

### 如何确保使用 GLM

1. **Base URL**: 使用 `https://api.z.ai/api/paas/v4/`（不是 Gemini 的 URL）
2. **Model Name**: 使用 `glm-4.6`（不是 `gemini-2.5-pro`）
3. **API Key**: 使用 GLM API Key（不是 Gemini API Key）

---

## 📋 配置检查清单

- [ ] `INSIGHT_ENGINE_API_KEY` 是 GLM API Key（不是 Gemini）
- [ ] `INSIGHT_ENGINE_BASE_URL` 是 `https://api.z.ai/api/paas/v4/`（不是 Gemini URL）
- [ ] `INSIGHT_ENGINE_MODEL_NAME` 是 `glm-4.6`（不是 `gemini-2.5-pro`）
- [ ] 已重启服务
- [ ] 日志中显示 `provider: 'openai-compatible'` 而不是 `provider: 'gemini'`

---

## 🧪 测试步骤

1. **更新配置后，启动 Insight Engine**
2. **执行搜索任务**
3. **检查日志**，确认：
   - ✅ 不再有 `User location is not supported` 错误
   - ✅ 使用 GLM API 成功调用
   - ✅ 搜索任务正常完成

---

## ⚠️ 注意事项

1. **API Key 获取**：
   - GLM API Key 需要从 Z.AI (https://docs.z.ai/) 获取
   - 确保 API Key 有足够的额度

2. **其他 Engine**：
   - Media Engine 和 Report Engine 可能也有类似问题
   - 检查它们的配置，确保也使用支持香港位置的 API

3. **配置同步**：
   - 确保 `.env` 文件中的配置正确
   - 重启服务后配置才会生效

---

**修复完成时间**: 2025-11-13

