# LLM API Key 配置说明

## 架构说明

```
前端 (Cloudflare Pages) 
    ↓ HTTP 请求
Workers (Cloudflare Workers) - API 网关
    ↓ HTTP 请求
后端 (Railway) - Python Flask + 引擎
    ↓ 调用 LLM API
Gemini API
```

## 关键点

**LLM API Key 必须在后端配置**，因为：
- 引擎在后端运行（Insight, Media, Query, Report）
- 引擎需要直接调用 LLM API
- 前端只是 UI，不直接调用 LLM

## 配置方式

### 方式 1: 直接在 Railway 设置环境变量（推荐）

**优点：**
- ✅ 更安全（不暴露到前端）
- ✅ 不需要重启服务
- ✅ 配置立即生效

**步骤：**
1. 进入 Railway Dashboard
2. 选择 `publicopinion-production` 服务
3. 点击 `Variables` 标签
4. 添加以下环境变量：

```
REPORT_ENGINE_API_KEY=你的Gemini_API_Key
INSIGHT_ENGINE_API_KEY=你的Gemini_API_Key
MEDIA_ENGINE_API_KEY=你的Gemini_API_Key
QUERY_ENGINE_API_KEY=你的Gemini_API_Key
```

**注意：** 只需要设置 API Key，`BASE_URL` 和 `MODEL_NAME` 会自动使用默认值。

### 方式 2: 通过前端 UI 配置

**流程：**
1. 前端通过 `/api/config` POST 请求发送配置到后端
2. 后端保存到 `.env` 文件
3. 需要重启服务才能生效

**缺点：**
- ❌ 需要重启服务
- ❌ 配置保存在 `.env` 文件中（可能丢失）
- ❌ 不如环境变量安全

## 前端环境变量（可选）

前端的 `NEXT_PUBLIC_*` 环境变量**不是必需的**，它们只是用于：
- 在 UI 中显示已配置的 Key（如果设置了）
- 通过前端 UI 配置时，自动填充到表单

**前端环境变量（Cloudflare Pages）：**
```
NEXT_PUBLIC_INSIGHT_ENGINE_API_KEY=你的Gemini_API_Key  # 可选
NEXT_PUBLIC_MEDIA_ENGINE_API_KEY=你的Gemini_API_Key    # 可选
NEXT_PUBLIC_QUERY_ENGINE_API_KEY=你的Gemini_API_Key   # 可选
NEXT_PUBLIC_REPORT_ENGINE_API_KEY=你的Gemini_API_Key  # 可选
```

**注意：** 这些变量会暴露到浏览器，所以**不建议**在前端设置真实的 API Key。

## 推荐配置

### 最小配置（推荐）

**只在 Railway 设置：**
```
REPORT_ENGINE_API_KEY=你的Gemini_API_Key
INSIGHT_ENGINE_API_KEY=你的Gemini_API_Key
MEDIA_ENGINE_API_KEY=你的Gemini_API_Key
QUERY_ENGINE_API_KEY=你的Gemini_API_Key
```

**前端不需要设置任何 LLM API Key 环境变量。**

### 完整配置（如果需要通过前端 UI 配置）

**Railway 环境变量：**
```
REPORT_ENGINE_API_KEY=你的Gemini_API_Key
INSIGHT_ENGINE_API_KEY=你的Gemini_API_Key
MEDIA_ENGINE_API_KEY=你的Gemini_API_Key
QUERY_ENGINE_API_KEY=你的Gemini_API_Key
```

**Cloudflare Pages 环境变量（可选，用于 UI 显示）：**
```
NEXT_PUBLIC_INSIGHT_ENGINE_API_KEY=你的Gemini_API_Key  # 可选，会暴露到浏览器
NEXT_PUBLIC_MEDIA_ENGINE_API_KEY=你的Gemini_API_Key    # 可选，会暴露到浏览器
NEXT_PUBLIC_QUERY_ENGINE_API_KEY=你的Gemini_API_Key   # 可选，会暴露到浏览器
NEXT_PUBLIC_REPORT_ENGINE_API_KEY=你的Gemini_API_Key  # 可选，会暴露到浏览器
```

## 总结

- ✅ **必须在 Railway 设置环境变量**（后端需要）
- ❌ **不需要在 Cloudflare Pages 设置**（前端只是 UI）
- 🔒 **安全建议：** 不要在前端暴露真实的 API Key

