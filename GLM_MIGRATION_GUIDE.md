# Gemini 到 GLM 迁移指南

## ✅ 已完成的更改

### 1. 配置文件更新

- ✅ `config.py` - 所有 Engine 的默认 BASE_URL 和 MODEL_NAME 已更新为 GLM
- ✅ `ReportEngine/flask_interface.py` - 默认值已更新
- ✅ `ForumEngine/llm_host.py` - 默认值已更新
- ✅ `MediaEngine/utils/config.py` - MindSpider 配置已更新
- ✅ `MindSpider/config.py` - 配置已更新
- ✅ `deploy-hk-ubuntu.sh` - 部署脚本注释已更新

### 2. URL 检查逻辑更新

- ✅ `ForumEngine/llm_host.py` - URL 检查从 Gemini 改为 GLM
- ✅ `MindSpider/BroadTopicExtraction/topic_extractor.py` - URL 检查已更新
- ✅ `InsightEngine/tools/keyword_optimizer.py` - URL 检查已更新

### 3. 代码逻辑

所有 Engine 的 LLM Client 已经使用 OpenAI SDK，所以只需要更新配置即可，无需修改调用代码。

---

## 🔧 GLM API 配置

### API 端点
- **Base URL**: `https://api.z.ai/api/paas/v4/`
- **Model Name**: `glm-4.6`

### 获取 API Key
1. 访问 [Z.AI 文档](https://docs.z.ai/)
2. 注册账号并获取 API Key
3. 在环境变量中配置

---

## 📝 环境变量更新

### 需要更新的环境变量

在服务器上的 `.env` 文件中，更新以下变量：

```env
# 旧配置（Gemini）
# INSIGHT_ENGINE_API_KEY=你的Gemini_API_Key
# INSIGHT_ENGINE_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
# INSIGHT_ENGINE_MODEL_NAME=gemini-2.5-pro

# 新配置（GLM）
INSIGHT_ENGINE_API_KEY=你的GLM_API_Key
INSIGHT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
INSIGHT_ENGINE_MODEL_NAME=glm-4.6

MEDIA_ENGINE_API_KEY=你的GLM_API_Key
MEDIA_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
MEDIA_ENGINE_MODEL_NAME=glm-4.6

QUERY_ENGINE_API_KEY=你的GLM_API_Key
QUERY_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
QUERY_ENGINE_MODEL_NAME=glm-4.6

REPORT_ENGINE_API_KEY=你的GLM_API_Key
REPORT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
REPORT_ENGINE_MODEL_NAME=glm-4.6

# MindSpider（如果使用）
MINDSPIDER_API_KEY=你的GLM_API_Key
MINDSPIDER_BASE_URL=https://api.z.ai/api/paas/v4/
MINDSPIDER_MODEL_NAME=glm-4.6
```

**注意**：如果 `BASE_URL` 和 `MODEL_NAME` 使用默认值，可以省略，系统会自动使用 GLM 的默认值。

---

## 🚀 部署步骤

### 1. 更新代码

```bash
# 在服务器上
cd /home/bettafish/Public_Opinion/BettaFish-main
git pull
```

### 2. 更新环境变量

编辑 `.env` 文件：

```bash
sudo nano /home/bettafish/Public_Opinion/BettaFish-main/.env
```

更新所有 `*_API_KEY` 为 GLM API Key（如果所有 Engine 使用同一个 Key，可以只设置一次）。

### 3. 重启服务

```bash
sudo systemctl restart bettafish
sudo systemctl status bettafish
```

### 4. 验证

- 检查服务日志：`sudo journalctl -u bettafish -f`
- 测试 Engine 启动
- 检查是否有错误

---

## 📋 迁移检查清单

- [ ] 代码已更新（git pull）
- [ ] 环境变量已更新（.env 文件）
- [ ] GLM API Key 已获取并配置
- [ ] 服务已重启
- [ ] 所有 Engine 可以正常启动
- [ ] 测试各个 Engine 功能正常

---

## ⚠️ 注意事项

1. **API Key 格式**：GLM API Key 格式与 Gemini 不同，确保使用正确的 Key
2. **区域限制**：GLM 可以在 HK 区域使用，解决了 Gemini 的区域限制问题
3. **模型名称**：使用 `glm-4.6`，不要使用其他模型名称
4. **Base URL**：必须使用 `https://api.z.ai/api/paas/v4/`，注意末尾的 `/`

---

## 🔍 故障排查

### 问题 1: API Key 错误

**症状**：Engine 启动失败，日志显示认证错误

**解决**：
- 检查 API Key 是否正确
- 确认 API Key 有足够的额度
- 检查环境变量是否正确加载

### 问题 2: 连接超时

**症状**：请求超时

**解决**：
- 检查网络连接
- 确认 GLM API 服务正常
- 检查防火墙设置

### 问题 3: 模型不存在

**症状**：返回模型不存在的错误

**解决**：
- 确认使用 `glm-4.6` 作为模型名称
- 检查 Base URL 是否正确

---

**迁移完成后，所有 Engine 将使用 GLM API，可以在 HK 区域正常使用！** 🎉

