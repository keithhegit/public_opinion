# 🔐 LLM API Key 环境变量设置指南

## 📋 概述

将4个重要的LLM API Key设置为环境变量，而不是通过前端配置界面输入。这样更安全，也避免了每次部署都需要重新配置。

## 🎯 需要设置的环境变量

在Cloudflare Pages中设置以下环境变量：

1. `NEXT_PUBLIC_INSIGHT_ENGINE_API_KEY` - Insight Engine API Key
2. `NEXT_PUBLIC_MEDIA_ENGINE_API_KEY` - Media Engine API Key
3. `NEXT_PUBLIC_QUERY_ENGINE_API_KEY` - Query Engine API Key
4. `NEXT_PUBLIC_REPORT_ENGINE_API_KEY` - Report Engine API Key

## 🚀 设置步骤

### Step 1: 在Cloudflare Pages Dashboard设置

1. **访问Cloudflare Dashboard**
   - https://dash.cloudflare.com
   - 登录账户

2. **进入Pages项目**
   - 左侧菜单 → **Pages**
   - 点击项目: **bettafish-frontend**

3. **进入设置**
   - 点击 **Settings** 标签
   - 向下滚动找到 **Environment variables**

4. **添加环境变量**

   点击 **Add environment variable**，依次添加：

   **变量1**:
   - **Variable name**: `NEXT_PUBLIC_INSIGHT_ENGINE_API_KEY`
   - **Value**: 你的Insight Engine API Key
   - **Environment**: `Production` (或 `All environments`)

   **变量2**:
   - **Variable name**: `NEXT_PUBLIC_MEDIA_ENGINE_API_KEY`
   - **Value**: 你的Media Engine API Key
   - **Environment**: `Production`

   **变量3**:
   - **Variable name**: `NEXT_PUBLIC_QUERY_ENGINE_API_KEY`
   - **Value**: 你的Query Engine API Key
   - **Environment**: `Production`

   **变量4**:
   - **Variable name**: `NEXT_PUBLIC_REPORT_ENGINE_API_KEY`
   - **Value**: 你的Report Engine API Key
   - **Environment**: `Production`

5. **保存并重新部署**
   - 点击 **Save**
   - 进入 **Deployments** 标签
   - 触发新的部署（或等待自动部署）

## 📝 开发环境设置

### 本地开发

创建 `bettafish-frontend/.env.local`:

```env
# Workers API URL
NEXT_PUBLIC_API_URL=http://localhost:8787

# LLM API Keys
NEXT_PUBLIC_INSIGHT_ENGINE_API_KEY=your-insight-api-key
NEXT_PUBLIC_MEDIA_ENGINE_API_KEY=your-media-api-key
NEXT_PUBLIC_QUERY_ENGINE_API_KEY=your-query-api-key
NEXT_PUBLIC_REPORT_ENGINE_API_KEY=your-report-api-key
```

**注意**: `.env.local` 文件已添加到 `.gitignore`，不会被提交到Git。

### Pages预览环境

在Cloudflare Dashboard的Environment variables中，为 **Preview** 环境也添加相同的变量。

## 🔄 工作原理

### 1. 环境变量优先级

- **环境变量** > **手动输入** > **后端存储**
- 如果环境变量已配置，前端会自动使用环境变量的值
- 如果环境变量未配置，仍可通过配置界面手动输入

### 2. 配置界面行为

- **已配置环境变量**: 显示为只读状态，显示"已从环境变量加载"
- **未配置环境变量**: 可以手动输入，保存到后端

### 3. API调用

- `updateConfig()` 会自动合并环境变量中的API Keys
- 确保后端始终收到完整的配置（环境变量 + 手动配置）

## ✅ 验证

设置完成后：
1. 重新部署前端
2. 检查环境变量是否正确加载
3. 测试配置功能

---

**详细实现**: 查看代码更新说明

