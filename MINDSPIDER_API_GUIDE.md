# MindSpider API 获取指引

## 📋 概述

**MindSpider** 是一个 AI 驱动的爬虫系统，用于从 13 个社交媒体平台爬取数据并构建私有舆情数据库。

**API 用途**：
- 话题提取和分析
- 关键词生成
- 新闻总结生成
- 爬虫决策支持

---

## 🔑 API 提供商：Gemini（已统一）

### 为什么使用 Gemini？

**已统一为 Gemini API**，与其他引擎保持一致：
- **统一管理**：所有引擎使用同一个 API Key
- **降低成本**：无需额外申请 DeepSeek API
- **稳定可靠**：Google 官方 API，全球可用
- **对中文支持良好**：适合话题提取和分析

### 配置信息

- **Base URL**：`https://generativelanguage.googleapis.com/v1beta/openai/`（Gemini 官方 API 的 OpenAI 兼容端点）
- **Model Name**：
  - `gemini-2.5-pro`（推荐，性能最强）
  - `gemini-2.5-flash`（推荐，速度更快，成本更低）
- **环境变量**：`MINDSPIDER_API_KEY`（可以复用其他引擎的 Gemini API Key）

---

## 📝 申请步骤

### Step 1: 访问 Google AI Studio

打开浏览器，访问：**https://aistudio.google.com/**

### Step 2: 登录 Google 账号

1. 使用 Google 账号登录（如果没有，需要先注册）
2. 完成账号验证

### Step 3: 获取 API Key

1. 登录后，点击页面左侧的 **"Get API Key"** 或 **"获取 API 密钥"**
2. 选择 **"Create API Key"** 或 **"创建 API 密钥"**
3. 选择项目（如果没有，会提示创建新项目）
4. 复制生成的 API Key（格式类似：`AIzaSy...`）

### Step 4: 查看定价和额度

- 访问 Gemini API 定价页面：https://ai.google.dev/pricing
- 查看免费额度和付费价格
- 通常有免费试用额度

---

## ⚙️ 配置方法

### 方法 1: Railway 环境变量（推荐）

1. 登录 Railway Dashboard
2. 进入你的项目
3. 点击 **Variables** 标签
4. 添加新的环境变量：
   - **Key**: `MINDSPIDER_API_KEY`
   - **Value**: 你从 DeepSeek 获取的 API Key
5. 点击 **Add** 保存
6. 重新部署服务

### 方法 2: 本地 .env 文件

在项目根目录的 `.env` 文件中添加：

```env
MINDSPIDER_API_KEY=你的Gemini_API_Key
MINDSPIDER_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
MINDSPIDER_MODEL_NAME=gemini-2.5-pro
```

**注意**：如果已经配置了其他引擎的 Gemini API Key，可以直接复用：
```env
# 复用其他引擎的 Gemini API Key（推荐）
MINDSPIDER_API_KEY=${{INSIGHT_ENGINE_API_KEY}}
MINDSPIDER_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
MINDSPIDER_MODEL_NAME=gemini-2.5-pro
```

---

## 🔍 验证配置

部署后，检查日志中是否显示：

```
MindSpider AI爬虫项目
基础配置检查通过
```

如果显示 **"基础配置检查通过"**，说明配置成功！

---

## 💰 价格参考

### Gemini API 定价（参考，以官网为准）

- **免费额度**：通常包含一定数量的免费请求
- **付费计划**：按 Token 计费，价格相对便宜
- **具体价格**：请查看 Gemini API 定价页面：https://ai.google.dev/pricing

### 成本优化建议

1. **复用其他引擎的 API Key**（推荐）
   - 如果已经配置了 `INSIGHT_ENGINE_API_KEY`、`MEDIA_ENGINE_API_KEY` 等
   - 可以直接复用，无需额外申请
   - 统一管理，降低成本

2. **使用 `gemini-2.5-flash` 而非 `gemini-2.5-pro`**（如果性能足够）
   - `gemini-2.5-flash` 速度更快，成本更低
   - 对于话题提取，通常足够使用

3. **控制请求频率**
   - MindSpider 主要用于数据爬取，不是实时服务
   - 可以设置定时任务，降低 API 调用频率

---

## 🎯 MindSpider 功能说明

### 核心功能

1. **话题提取**（`BroadTopicExtraction`）
   - 从 13 个社交媒体平台收集热点新闻
   - 使用 DeepSeek API 提取关键词和生成总结
   - 维护每日话题分析表

2. **深度爬取**（`DeepSentimentCrawling`）
   - 基于提取的话题，深度爬取各平台的细粒度舆情反馈
   - 支持 13 个平台：微博、B站、抖音、快手、小红书、知乎、贴吧等

3. **数据存储**
   - 将爬取的数据存储到 MySQL/PostgreSQL 数据库
   - 为 Insight Engine 提供数据源

### 支持的平台

- 微博（Weibo）
- B站（Bilibili）
- 抖音（Douyin）
- 快手（Kuaishou）
- 小红书（Xiaohongshu）
- 知乎（Zhihu）
- 贴吧（Tieba）
- GitHub
- 酷安
- 其他平台...

---

## ⚠️ 注意事项

### 1. API Key 安全

- ✅ 不要将 API Key 提交到 Git 仓库
- ✅ 使用环境变量或 `.env` 文件管理（`.env` 已在 `.gitignore` 中）
- ✅ 定期轮换 API Key

### 2. 使用限制

- ⚠️ 注意免费额度的限制
- ⚠️ 监控 API 使用量，避免超出预算
- ⚠️ 遵守 DeepSeek 的使用条款

### 3. 错误处理

- 如果 API Key 无效，MindSpider 会记录错误
- 系统会继续运行，但话题提取功能会被禁用
- 检查 Railway 环境变量是否正确设置

### 4. 可选配置

**MindSpider 是可选的**：
- 如果未配置 `MINDSPIDER_API_KEY`，系统会继续运行
- Insight Engine 可以在没有 MindSpider 数据库的情况下工作
- 只是无法使用私有舆情数据库功能

---

## ✅ 已统一为 Gemini API

**MindSpider 已默认使用 Gemini API**，与其他引擎保持一致。

**配置示例**：
```env
MINDSPIDER_API_KEY=你的Gemini_API_Key
MINDSPIDER_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
MINDSPIDER_MODEL_NAME=gemini-2.5-pro
```

**复用其他引擎的 API Key**（推荐）：
```env
# 在 Railway 中，可以使用 Shared Variables 引用
MINDSPIDER_API_KEY=${{INSIGHT_ENGINE_API_KEY}}
```

---

## 📚 相关文档

- **Google AI Studio**：https://aistudio.google.com/
- **Gemini API 文档**：https://ai.google.dev/docs
- **Gemini API 定价**：https://ai.google.dev/pricing
- **MindSpider README**：`BettaFish-main/MindSpider/README.md`
- **项目配置**：`BettaFish-main/MindSpider/config.py`

---

## 🆘 常见问题

### Q: MindSpider 是必需的吗？

**A**: 不是必需的。MindSpider 是可选的增强功能：
- 如果未配置，系统会继续运行
- Insight Engine 可以在没有 MindSpider 数据库的情况下工作
- 只是无法使用私有舆情数据库功能

### Q: 可以使用 Gemini API 吗？

**A**: ✅ **已默认使用 Gemini API**！无需额外配置，系统已统一为 Gemini。

如果已经配置了其他引擎的 Gemini API Key，可以直接复用：
```env
MINDSPIDER_API_KEY=${{INSIGHT_ENGINE_API_KEY}}
```

### Q: 如何验证配置是否正确？

**A**: 部署后检查日志：
- 如果显示 "基础配置检查通过"，说明配置成功
- 如果显示 "配置缺失"，请检查环境变量

### Q: MindSpider 会阻断系统启动吗？

**A**: 不会。即使配置缺失，系统也会继续运行，只是相关功能会被禁用。

---

**最后更新**：2025-11-11
**状态**: ✅ 完整指引

