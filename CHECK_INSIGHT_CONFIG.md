# Insight Engine 配置检查指南

## 🔍 问题诊断

从日志可以看到，Insight Engine 实际使用的配置是：
```
provider: 'gemini'
model: 'gemini-2.5-pro'
api_base: 'https://generativelanguage.googleapis.com/v1beta/openai/'
```

这说明虽然 API Key 是 GLM 的，但是 **BASE_URL 或 MODEL_NAME 可能还是 Gemini 的配置**。

## 📋 检查步骤

### 1. 检查 .env 文件中的配置

在服务器上执行：

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main
cat .env | grep -E "INSIGHT_ENGINE_(BASE_URL|MODEL_NAME)"
```

**应该看到的配置**（GLM）：
```env
INSIGHT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
INSIGHT_ENGINE_MODEL_NAME=glm-4.6
```

**如果看到的是**（Gemini，错误）：
```env
INSIGHT_ENGINE_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
INSIGHT_ENGINE_MODEL_NAME=gemini-2.5-pro
```

### 2. 检查配置传递逻辑

配置传递流程：
1. `.env` 文件 → `config.py` (主配置)
2. `config.py` → `app.py` 的 `execute_engine_search()`
3. `app.py` → `InsightEngine.utils.config.Settings` (Engine 自己的配置)
4. `InsightEngine.utils.config.Settings` → `LLMClient`

**关键点**：
- `InsightEngine/utils/config.py` 中的 `Settings` 默认值是 `None`
- 如果 `.env` 文件中没有设置 `INSIGHT_ENGINE_BASE_URL` 和 `INSIGHT_ENGINE_MODEL_NAME`，它们会是 `None`
- 但是 `app.py` 中会从主 `config.py` 传递这些值

### 3. 可能的问题

**问题 1**: `.env` 文件中可能设置了 Gemini 的 BASE_URL 和 MODEL_NAME

**问题 2**: `.env` 文件中可能没有设置这些值，但环境变量中设置了

**问题 3**: 代码中可能有其他地方硬编码了 Gemini 配置

## ✅ 解决方案

### 方案 1: 检查并更新 .env 文件

```bash
# 编辑 .env 文件
nano /home/bettafish/Public_Opinion/BettaFish-main/.env
```

确保以下配置是 GLM 的：

```env
# Insight Engine 配置（GLM API）
INSIGHT_ENGINE_API_KEY=d21f186794bc4232ac09f1cfdb7b92e6.2fLNtg6XZNm2JMDw
INSIGHT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
INSIGHT_ENGINE_MODEL_NAME=glm-4.6
```

**重要**：如果 `.env` 文件中有 `INSIGHT_ENGINE_BASE_URL` 或 `INSIGHT_ENGINE_MODEL_NAME` 设置为 Gemini 的值，需要删除或修改它们。

### 方案 2: 检查环境变量

```bash
# 检查系统环境变量
env | grep INSIGHT_ENGINE
```

如果环境变量中设置了 Gemini 的配置，需要清除它们。

### 方案 3: 重启服务

更新配置后，重启服务：

```bash
sudo systemctl restart bettafish
```

## 🧪 验证配置

重启服务后，检查日志：

```bash
sudo journalctl -u bettafish -n 100 | grep -i insight
```

应该看到：
```
使用LLM: {'provider': 'openai-compatible', 'model': 'glm-4.6', 'api_base': 'https://api.z.ai/api/paas/v4/'}
```

而不是：
```
使用LLM: {'provider': 'gemini', 'model': 'gemini-2.5-pro', 'api_base': 'https://generativelanguage.googleapis.com/v1beta/openai/'}
```

## 📝 配置优先级

配置读取优先级（从高到低）：
1. 环境变量
2. `.env` 文件
3. `config.py` 中的默认值

如果 `.env` 文件中设置了 Gemini 的配置，它会覆盖 `config.py` 中的 GLM 默认值。

