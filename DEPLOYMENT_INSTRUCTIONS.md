# 📋 Cloudflare Pages 部署详细指令

## 🎯 现在开始部署

### 方法：通过Cloudflare Dashboard（推荐）

## Step 1: 打开Cloudflare Dashboard

**访问**: https://dash.cloudflare.com

## Step 2: 进入Pages

1. 左侧菜单找到 **Pages**
2. 点击 **Create a project**

## Step 3: 连接GitHub

1. 选择 **Connect to Git**
2. 如果首次使用，授权Cloudflare访问GitHub
3. 选择仓库: **keithhegit/public_opinion**
4. 点击 **Begin setup**

## Step 4: 配置项目

### 基本信息
- **Project name**: `bettafish-frontend`

### 构建设置（重要！）

**Build command**:
```
cd bettafish-frontend && npm install && npm run build && npx @cloudflare/next-on-pages
```

**Build output directory**:
```
bettafish-frontend/.vercel/output/static
```

**Root directory**: 留空（使用 `/`）

### 环境变量（重要！）

点击 **Add environment variable**，添加：

**变量1**:
- **Name**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://bettafish-api-prod.keithhe2021.workers.dev`
- **Environment**: `Production` (或 `All environments`)

## Step 5: 保存并部署

1. 检查所有配置
2. 点击 **Save and Deploy**
3. 等待构建（3-5分钟）

## ✅ 部署完成

部署成功后，你会获得一个URL，类似：
- `https://bettafish-frontend.pages.dev`
- 或 `https://bettafish-frontend-xxxxx.pages.dev`

## 🧪 验证部署

1. 访问部署URL
2. 打开浏览器开发者工具（F12）
3. 检查Console是否有错误
4. 测试功能：
   - 搜索
   - 配置管理
   - 报告生成

## 📊 配置截图参考

### 构建设置
```
Framework preset: Next.js
Build command: cd bettafish-frontend && npm install && npm run build && npx @cloudflare/next-on-pages
Build output directory: bettafish-frontend/.vercel/output/static
```

### 环境变量
```
NEXT_PUBLIC_API_URL = https://bettafish-api-prod.keithhe2021.workers.dev
```

---

**立即去Cloudflare Dashboard部署！** 🚀

