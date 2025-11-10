# 环境变量配置检查清单

## ✅ 已完成的修改

### 1. config.py 默认值已更新

所有 Engine 现在默认使用 Gemini：

| Engine | Base URL | Model Name | 状态 |
|--------|----------|------------|------|
| **Insight Engine** | `https://aihubmix.com/v1` | `gemini-2.5-pro` | ✅ 已修改 |
| **Media Engine** | `https://aihubmix.com/v1` | `gemini-2.5-pro` | ✅ 正确 |
| **Query Engine** | `https://aihubmix.com/v1` | `gemini-2.5-pro` | ✅ 已修改 |
| **Report Engine** | `https://aihubmix.com/v1` | `gemini-2.5-pro` | ✅ 正确 |

## 📋 环境变量配置检查

### Railway 后端环境变量

在 Railway Dashboard → Variables 中需要配置以下环境变量：

#### 必需的环境变量

```bash
# LLM API Keys（所有 Engine 使用同一个 Key）
INSIGHT_ENGINE_API_KEY=你的Gemini_API_Key
MEDIA_ENGINE_API_KEY=你的Gemini_API_Key
QUERY_ENGINE_API_KEY=你的Gemini_API_Key
REPORT_ENGINE_API_KEY=你的Gemini_API_Key

# LLM Base URLs（可选，如果不设置会使用 config.py 的默认值）
INSIGHT_ENGINE_BASE_URL=https://aihubmix.com/v1
MEDIA_ENGINE_BASE_URL=https://aihubmix.com/v1
QUERY_ENGINE_BASE_URL=https://aihubmix.com/v1
REPORT_ENGINE_BASE_URL=https://aihubmix.com/v1

# LLM Model Names（可选，如果不设置会使用 config.py 的默认值）
INSIGHT_ENGINE_MODEL_NAME=gemini-2.5-pro
MEDIA_ENGINE_MODEL_NAME=gemini-2.5-pro
QUERY_ENGINE_MODEL_NAME=gemini-2.5-pro
REPORT_ENGINE_MODEL_NAME=gemini-2.5-pro

# 数据库配置（如果使用数据库）
DB_HOST=your_db_host
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_CHARSET=utf8mb4
DB_DIALECT=mysql

# 其他 API Keys（如果需要）
TAVILY_API_KEY=你的Tavily_API_Key
BOCHA_WEB_SEARCH_API_KEY=你的Bocha_API_Key
FORUM_HOST_API_KEY=你的Forum_API_Key
KEYWORD_OPTIMIZER_API_KEY=你的Keyword_Optimizer_API_Key
```

#### Railway 自动设置的环境变量

```bash
PORT=8080  # Railway 自动设置，无需手动配置
HOST=0.0.0.0  # Railway 自动设置，无需手动配置
```

### Cloudflare Pages 前端环境变量

在 Cloudflare Pages Dashboard → Settings → Environment Variables 中需要配置：

```bash
# API Gateway URL
NEXT_PUBLIC_API_URL=https://bettafish-api-prod.keithhe2021.workers.dev

# LLM API Keys（所有 Engine 使用同一个 Key）
NEXT_PUBLIC_INSIGHT_ENGINE_API_KEY=你的Gemini_API_Key
NEXT_PUBLIC_MEDIA_ENGINE_API_KEY=你的Gemini_API_Key
NEXT_PUBLIC_QUERY_ENGINE_API_KEY=你的Gemini_API_Key
NEXT_PUBLIC_REPORT_ENGINE_API_KEY=你的Gemini_API_Key
```

### Cloudflare Workers API Gateway 环境变量

在 Cloudflare Workers Dashboard → Settings → Variables 中需要配置：

```bash
# 后端 URL
BACKEND_URL=https://你的Railway后端URL.railway.app

# 环境标识
ENVIRONMENT=production
```

## 🔍 配置优先级

### 后端配置优先级（从高到低）

1. **环境变量**（Railway Variables）
2. **.env 文件**（如果存在）
3. **config.py 默认值**（已更新为 Gemini）

### 前端配置优先级（从高到低）

1. **Cloudflare Pages 环境变量**
2. **next.config.ts 中的默认值**

## ✅ 验证步骤

### 1. 检查 Railway 环境变量

1. 登录 Railway Dashboard
2. 进入你的项目
3. 点击 **Variables** 标签
4. 确认以下变量已设置：
   - ✅ `INSIGHT_ENGINE_API_KEY`
   - ✅ `MEDIA_ENGINE_API_KEY`
   - ✅ `QUERY_ENGINE_API_KEY`
   - ✅ `REPORT_ENGINE_API_KEY`
   - ✅ `INSIGHT_ENGINE_BASE_URL`（可选，默认已正确）
   - ✅ `INSIGHT_ENGINE_MODEL_NAME`（可选，默认已正确）

### 2. 检查 Cloudflare Pages 环境变量

1. 登录 Cloudflare Dashboard
2. 进入 Pages → bettafish-frontend
3. 点击 **Settings** → **Environment Variables**
4. 确认以下变量已设置：
   - ✅ `NEXT_PUBLIC_API_URL`
   - ✅ `NEXT_PUBLIC_INSIGHT_ENGINE_API_KEY`
   - ✅ `NEXT_PUBLIC_MEDIA_ENGINE_API_KEY`
   - ✅ `NEXT_PUBLIC_QUERY_ENGINE_API_KEY`
   - ✅ `NEXT_PUBLIC_REPORT_ENGINE_API_KEY`

### 3. 检查 Cloudflare Workers 环境变量

1. 登录 Cloudflare Dashboard
2. 进入 Workers & Pages → bettafish-api-prod
3. 点击 **Settings** → **Variables**
4. 确认以下变量已设置：
   - ✅ `BACKEND_URL`（指向 Railway 后端 URL）
   - ✅ `ENVIRONMENT=production`

## 🚨 常见问题

### Q: 如果环境变量未设置会怎样？

A: 系统会使用 `config.py` 中的默认值。现在所有 Engine 的默认值都已更新为 Gemini，所以即使不设置环境变量，也会使用 Gemini。

### Q: 环境变量和 config.py 默认值不一致怎么办？

A: 环境变量优先级更高，会覆盖 config.py 的默认值。建议在环境变量中明确设置，避免混淆。

### Q: 如何确认配置已生效？

A: 查看后端日志，应该能看到：
```
Report Engine初始化成功
使用模型: gemini-2.5-pro
```

## 📝 下一步

1. ✅ 已修改 `config.py` 默认值
2. ⏳ 提交代码到 GitHub
3. ⏳ 等待 Railway 自动重新部署
4. ⏳ 验证所有 Engine 使用 Gemini 配置

