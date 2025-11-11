# Tavily API 开通指引

## 📋 概述

**Tavily** 是一个专为 AI 应用设计的搜索 API，提供高质量的新闻和网页搜索结果。在 BettaFish 系统中，Tavily 用于 **Query Engine（查询优化引擎）**，负责国内外网页搜索和新闻分析。

## 🎯 为什么需要 Tavily API？

- **Query Engine 的核心功能**：Query Engine 使用 Tavily 进行网页搜索和新闻分析
- **与 Bocha 共存**：
  - **Media Engine** 使用 **Bocha**（多模态搜索：网页、图片、视频、结构化数据）
  - **Query Engine** 使用 **Tavily**（新闻搜索：网页、图片、新闻）
- **原库设计**：两个搜索工具服务于不同的引擎，是共存关系，不是二选一

## 🔑 申请步骤

### Step 1: 访问 Tavily 官网

打开浏览器，访问：**https://www.tavily.com/**

### Step 2: 注册账号

1. 点击页面右上角的 **"Sign Up"** 或 **"Get Started"** 按钮
2. 使用邮箱注册账号（支持 Google、GitHub 等第三方登录）
3. 完成邮箱验证

### Step 3: 获取 API Key

1. 登录后，进入 **Dashboard**（控制台）
2. 在左侧菜单中找到 **"API Keys"** 或 **"Settings"**
3. 点击 **"Create API Key"** 或 **"Generate New Key"**
4. 复制生成的 API Key（格式类似：`tvly-xxxxxxxxxxxxxxxxxxxxx`）

### Step 4: 查看免费额度

Tavily 提供免费额度：
- **免费计划**：通常包含一定数量的免费搜索请求
- **付费计划**：按使用量付费，价格相对便宜

## ⚙️ 配置方法

### 方法 1: Railway 环境变量（推荐）

1. 登录 Railway Dashboard
2. 进入你的项目
3. 点击 **Variables** 标签
4. 添加新的环境变量：
   - **Key**: `TAVILY_API_KEY`
   - **Value**: 你从 Tavily 获取的 API Key
5. 点击 **Add** 保存
6. 重新部署服务

### 方法 2: 本地 .env 文件

在项目根目录的 `.env` 文件中添加：

```env
TAVILY_API_KEY=tvly-xxxxxxxxxxxxxxxxxxxxx
```

## ✅ 验证配置

部署后，检查日志中是否显示：

```
=== Query Engine 配置 ===
LLM 模型: gemini-2.5-pro
LLM Base URL: https://generativelanguage.googleapis.com/v1beta/openai/
Tavily API Key: 已配置
...
```

如果显示 **"Tavily API Key: 已配置"**，说明配置成功！

## 🔍 Tavily 功能特性

### Query Engine 使用的 Tavily 工具

1. **basic_search_news** - 标准通用新闻搜索
2. **deep_search_news** - 深度新闻分析
3. **search_news_last_24_hours** - 24小时内最新动态
4. **search_news_last_week** - 过去一周主要报道
5. **search_images_for_news** - 新闻相关图片搜索
6. **search_news_by_date** - 指定日期范围搜索

### 返回数据格式

Tavily 返回的数据包含：
- **results**: 网页搜索结果（标题、URL、内容、发布日期）
- **images**: 图片搜索结果
- **answer**: AI 生成的搜索摘要

## 💰 价格参考

- **免费计划**：通常包含每月一定数量的免费请求
- **付费计划**：按请求数付费，价格相对便宜
- 具体价格请查看 Tavily 官网：https://www.tavily.com/pricing

## 📚 相关文档

- **Tavily 官网**：https://www.tavily.com/
- **API 文档**：https://docs.tavily.com/
- **Python SDK**：https://github.com/tavily/tavily-python

## ⚠️ 注意事项

1. **API Key 安全**：
   - 不要将 API Key 提交到 Git 仓库
   - 使用环境变量或 `.env` 文件管理（`.env` 已在 `.gitignore` 中）

2. **使用限制**：
   - 注意免费额度的限制
   - 监控 API 使用量，避免超出预算

3. **错误处理**：
   - 如果 API Key 无效，Query Engine 会抛出错误
   - 检查 Railway 环境变量是否正确设置

## 🔄 与 Bocha 的区别

| 特性 | Tavily (Query Engine) | Bocha (Media Engine) |
|------|---------------------|---------------------|
| 主要用途 | 新闻搜索、网页搜索 | 多模态搜索（网页、图片、视频） |
| 支持视频 | ❌ | ✅ |
| 结构化数据 | ❌ | ✅（模态卡） |
| AI 总结 | ✅ | ✅ |
| 时效性搜索 | ✅ | ✅ |
| 价格 | 便宜 | 中等 |

## 🆘 常见问题

### Q: 为什么需要两个搜索 API？

**A**: 原库设计让不同引擎使用不同的搜索工具：
- **Media Engine** 需要多模态能力（视频、图片、结构化数据），使用 Bocha
- **Query Engine** 专注于新闻和网页搜索，使用 Tavily

### Q: 可以只用 Bocha 吗？

**A**: 技术上可以，但需要修改代码。建议保持原库设计，两个 API 共存。

### Q: Tavily API Key 在哪里配置？

**A**: 在 Railway 环境变量中配置 `TAVILY_API_KEY`，或在本地 `.env` 文件中配置。

---

**最后更新**：2025-11-11

