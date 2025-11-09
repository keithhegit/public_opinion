# 🚀 立即部署前端到Cloudflare Pages

## 📋 部署方式：GitHub集成（推荐）

由于Windows系统限制，推荐使用Cloudflare Dashboard的GitHub集成方式部署。

## 🎯 步骤1: 访问Cloudflare Dashboard

1. **打开浏览器访问**: https://dash.cloudflare.com
2. **登录你的账户**

## 🎯 步骤2: 创建Pages项目

1. **左侧菜单** → 点击 **Pages**
2. **点击** **Create a project** 按钮
3. **选择** **Connect to Git**

## 🎯 步骤3: 连接GitHub仓库

1. **如果首次使用**:
   - 点击 **Connect GitHub** 或 **Authorize Cloudflare**
   - 在GitHub授权页面点击 **Authorize Cloudflare**
   - 返回Cloudflare Dashboard

2. **选择仓库**:
   - 在仓库列表中找到 `keithhegit/public_opinion`
   - **点击** 该仓库

3. **点击** **Begin setup**

## 🎯 步骤4: 配置构建设置

### 项目设置
- **Project name**: `bettafish-frontend` (或你喜欢的名称)

### 构建设置
- **Framework preset**: 选择 **Next.js** (或留空)
- **Build command**: 
  ```
  cd bettafish-frontend && npm install && npm run build && npx @cloudflare/next-on-pages
  ```
- **Build output directory**: 
  ```
  bettafish-frontend/.vercel/output/static
  ```
- **Root directory**: `/` (留空，表示根目录)

### 环境变量
点击 **Add environment variable**:
- **Variable name**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://bettafish-api-prod.keithhe2021.workers.dev`
- **Environment**: 选择 **Production** (或 **All environments**)

## 🎯 步骤5: 部署

1. **检查所有设置**是否正确
2. **点击** **Save and Deploy** 按钮
3. **等待构建完成**（通常需要3-5分钟）

## ✅ 部署成功后

部署完成后，你会看到：
- **部署URL**: 类似 `https://bettafish-frontend.pages.dev`
- **部署状态**: ✅ Success

## 🧪 测试部署

1. **访问部署URL**
2. **测试功能**:
   - 页面加载
   - 搜索功能
   - 配置管理
   - 报告生成
   - API连接

## ⚠️ 如果构建失败

### 检查构建日志
1. 在Pages项目页面
2. 点击失败的部署
3. 查看 **Build logs**

### 常见问题

**问题1: @cloudflare/next-on-pages 失败**
- **解决**: 尝试修改构建命令为:
  ```
  cd bettafish-frontend && npm install && npm run build
  ```
  然后手动处理Pages适配

**问题2: 找不到模块**
- **解决**: 确保 `npm install` 在构建命令中

**问题3: 环境变量未生效**
- **解决**: 检查环境变量是否正确设置，并重新部署

## 📝 快速配置总结

```
项目名称: bettafish-frontend
构建命令: cd bettafish-frontend && npm install && npm run build && npx @cloudflare/next-on-pages
输出目录: bettafish-frontend/.vercel/output/static
环境变量: NEXT_PUBLIC_API_URL=https://bettafish-api-prod.keithhe2021.workers.dev
```

---

**现在去Cloudflare Dashboard配置并部署！** 🚀

