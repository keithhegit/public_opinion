# Cloudflare Pages 配置指南

## ✅ 代码已推送到GitHub

**仓库**: https://github.com/keithhegit/public_opinion

## 🚀 在Cloudflare Dashboard配置Pages

### Step 1: 创建Pages项目

1. 访问: https://dash.cloudflare.com
2. 左侧菜单选择 **Pages**
3. 点击 **Create a project**
4. 选择 **Connect to Git**

### Step 2: 连接GitHub仓库

1. 如果首次使用，授权Cloudflare访问GitHub
2. 选择仓库: `keithhegit/public_opinion`
3. 点击 **Begin setup**

### Step 3: 配置构建设置

**项目名称**: `bettafish-frontend`

**构建设置**:
```
Framework preset: Next.js
Build command: cd bettafish-frontend && npm install && npm run build && npx @cloudflare/next-on-pages
Build output directory: bettafish-frontend/.vercel/output/static
Root directory: / (留空)
```

### Step 4: 环境变量

点击 **Add environment variable**:

**变量1**:
- Name: `NEXT_PUBLIC_API_URL`
- Value: `https://bettafish-api-prod.keithhe2021.workers.dev`
- Environment: `Production` (或 `All environments`)

### Step 5: 部署

1. 点击 **Save and Deploy**
2. 等待构建完成（约3-5分钟）
3. 获取部署URL

## 📋 构建配置总结

```
项目名称: bettafish-frontend
框架: Next.js
构建命令: cd bettafish-frontend && npm install && npm run build && npx @cloudflare/next-on-pages
输出目录: bettafish-frontend/.vercel/output/static
环境变量: NEXT_PUBLIC_API_URL=https://bettafish-api-prod.keithhe2021.workers.dev
```

## ⚠️ 如果构建失败

### 方案1: 使用GitHub Actions

如果 `@cloudflare/next-on-pages` 在Cloudflare构建环境中失败，可以使用GitHub Actions。

### 方案2: 修改构建命令

尝试简化构建命令：
```
cd bettafish-frontend && npm ci && npm run build
```

然后手动运行 `npx @cloudflare/next-on-pages`。

## ✅ 部署后验证

1. 访问部署的Pages URL
2. 测试前端功能
3. 检查API连接
4. 验证所有功能正常

---

**现在去Cloudflare Dashboard配置Pages项目吧！** 🚀

