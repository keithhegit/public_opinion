# 关键词优化器替代方案

## 功能分析

关键词优化器的核心功能：
- 将正式/学术化的查询转换为网民常用的口语化关键词
- 例如："武汉大学舆情管理 未来展望" → "武大"、"武汉大学"、"学校管理"
- 需要理解中文语境和网络用语

**技术实现**：使用 OpenAI SDK，支持任何 OpenAI 兼容格式的 API

---

## 推荐方案（按优先级）

### 🥇 方案 1：复用 Gemini API Key（推荐）

**优点**：
- ✅ 无需额外 API Key（复用已有的 `INSIGHT_ENGINE_API_KEY`）
- ✅ 零额外成本
- ✅ 统一管理，配置简单
- ✅ Gemini 对中文支持良好

**实现方式**：
修改 `keyword_optimizer.py`，优先使用 `INSIGHT_ENGINE_API_KEY`，如果没有则使用 `KEYWORD_OPTIMIZER_API_KEY`

**配置**：
```python
# 在 keyword_optimizer.py 中
api_key = settings.INSIGHT_ENGINE_API_KEY or settings.KEYWORD_OPTIMIZER_API_KEY
base_url = settings.INSIGHT_ENGINE_BASE_URL or settings.KEYWORD_OPTIMIZER_BASE_URL
model_name = settings.INSIGHT_ENGINE_MODEL_NAME or settings.KEYWORD_OPTIMIZER_MODEL_NAME
```

**模型推荐**：
- `gemini-2.0-flash-exp`（快速，适合关键词优化）
- `gemini-1.5-pro`（更准确，但稍慢）

---

### 🥈 方案 2：使用 OpenAI API

**优点**：
- ✅ 官方 API，稳定可靠
- ✅ 对中文支持良好
- ✅ GPT-4o-mini 价格便宜

**申请地址**：https://platform.openai.com/

**配置**：
```python
KEYWORD_OPTIMIZER_API_KEY = "sk-..."  # OpenAI API Key
KEYWORD_OPTIMIZER_BASE_URL = "https://api.openai.com/v1"  # 或留空使用默认
KEYWORD_OPTIMIZER_MODEL_NAME = "gpt-4o-mini"  # 或 "gpt-3.5-turbo"
```

**成本**：
- GPT-4o-mini: $0.15 / 1M input tokens, $0.60 / 1M output tokens
- GPT-3.5-turbo: $0.50 / 1M input tokens, $1.50 / 1M output tokens

---

### 🥉 方案 3：使用 DeepSeek 国际版

**优点**：
- ✅ 对中文支持优秀
- ✅ 价格便宜
- ✅ 支持 OpenAI 兼容格式

**申请地址**：https://platform.deepseek.com/

**配置**：
```python
KEYWORD_OPTIMIZER_API_KEY = "sk-..."  # DeepSeek API Key
KEYWORD_OPTIMIZER_BASE_URL = "https://api.deepseek.com/v1"
KEYWORD_OPTIMIZER_MODEL_NAME = "deepseek-chat"  # 或 "deepseek-reasoner"
```

**成本**：
- DeepSeek Chat: $0.14 / 1M input tokens, $0.28 / 1M output tokens

---

### 方案 4：使用 Anthropic Claude

**优点**：
- ✅ 对中文理解能力强
- ✅ 输出质量高

**申请地址**：https://console.anthropic.com/

**配置**：
```python
KEYWORD_OPTIMIZER_API_KEY = "sk-ant-..."  # Claude API Key
KEYWORD_OPTIMIZER_BASE_URL = "https://api.anthropic.com/v1"
KEYWORD_OPTIMIZER_MODEL_NAME = "claude-3-haiku-20240307"  # 或 "claude-3-5-sonnet-20241022"
```

**注意**：Claude API 不完全兼容 OpenAI 格式，可能需要修改代码

---

### 方案 5：使用其他国际 LLM 服务

**其他选项**：
- **Groq**：https://console.groq.com/（超快，免费额度）
- **Together AI**：https://api.together.xyz/（多种开源模型）
- **Perplexity**：https://www.perplexity.ai/（如果支持 API）

---

## 实施建议

### 推荐实施：方案 1（复用 Gemini）

**理由**：
1. 你已经统一使用 Gemini，不需要额外配置
2. Gemini 对中文支持良好，完全能满足关键词优化需求
3. 零额外成本
4. 配置最简单

**修改代码**：
修改 `BettaFish-main/InsightEngine/tools/keyword_optimizer.py`，让它优先使用 `INSIGHT_ENGINE_API_KEY`

---

## 性能对比

| 方案 | 中文支持 | 速度 | 成本 | 配置难度 |
|------|---------|------|------|---------|
| Gemini（复用） | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 免费（已配置） | ⭐⭐⭐⭐⭐ |
| OpenAI | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 低 | ⭐⭐⭐⭐ |
| DeepSeek | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 很低 | ⭐⭐⭐⭐ |
| Claude | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 中 | ⭐⭐⭐ |

---

## 结论

**最佳选择**：复用 Gemini API Key（方案 1）

这样可以：
- 避免使用中国平台
- 零额外配置和成本
- 保持系统统一性

需要我帮你实现方案 1 的代码修改吗？

