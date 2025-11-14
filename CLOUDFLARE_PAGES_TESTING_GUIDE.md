# Cloudflare Pages 测试指南

## 🎯 重要提示

前端托管在 **Cloudflare Pages**，本地测试需要考虑生产环境的特性。

## 📋 Cloudflare Pages 特性

### 1. 构建环境差异
- **本地**: Windows/Linux/macOS，可能使用不同的 Node.js 版本
- **Cloudflare Pages**: Linux，自动检测 Node.js 版本
- **构建命令**: 在 Linux 环境中执行

### 2. 运行时环境
- **边缘计算**: 代码在 Cloudflare 边缘网络运行
- **无服务器**: 不需要管理服务器
- **全球 CDN**: 自动全球分发
- **环境变量**: 在构建时注入，运行时可用

### 3. API 调用
- **生产环境**: 默认指向 Workers (`https://bettafish-api-prod.keithhe2021.workers.dev`)
- **CORS**: Workers 需要允许 Pages 域名访问
- **HTTPS**: 所有请求都是 HTTPS

## 🔧 当前配置状态

### ✅ 已优化

1. **API 客户端** (`lib/api-client.ts`)
   - 默认 URL 指向生产 Workers
   - 使用环境变量 `NEXT_PUBLIC_API_URL`
   - 支持 Cloudflare Pages 环境变量注入

2. **Next.js 配置** (`next.config.ts`)
   - 已移除 `output: 'standalone'`
   - 环境变量配置正确

3. **依赖版本**
   - Next.js 15.5.2（兼容 @cloudflare/next-on-pages）
   - @cloudflare/next-on-pages@1.13.0

### ⚠️ 需要注意

1. **环境变量**
   - 必须在 Cloudflare Pages Dashboard 中配置
   - `NEXT_PUBLIC_API_URL` 必须设置

2. **构建命令**
   - 使用 `npm install`（不是 `npm ci`）
   - 确保 `package-lock.json` 已提交

3. **CORS 配置**
   - Workers 必须允许 Pages 域名访问
   - 检查 Workers 的 CORS 设置

## 🧪 本地测试 vs 生产环境

### 本地测试限制

- ❌ 无法完全模拟 Cloudflare Pages 环境
- ❌ Windows 上无法运行 `@cloudflare/next-on-pages`
- ✅ 可以测试 Next.js 构建
- ✅ 可以测试 API 调用（如果 Workers 已部署）

### 生产环境特性

- ✅ Linux 构建环境
- ✅ 自动运行 `@cloudflare/next-on-pages`
- ✅ 环境变量自动注入
- ✅ 全球 CDN 加速

## 🚀 Cloudflare Pages 部署配置

### 构建设置

**根目录**: `bettafish-frontend`

**构建命令**:
```bash
npm install && npm run build && npx @cloudflare/next-on-pages
```

**构建输出目录**: `.vercel/output/static`

**Framework preset**: `Next.js`

### 环境变量（必须配置）

**NEXT_PUBLIC_API_URL**:
- **Value**: `https://bettafish-api-prod.keithhe2021.workers.dev`
- **Environment**: `Production`（或 `All environments`）

## ✅ 验证步骤

### 1. 构建验证
- [ ] Cloudflare Pages 构建成功
- [ ] 没有构建错误
- [ ] 构建日志显示成功

### 2. 运行时验证
- [ ] 页面可以正常加载
- [ ] 浏览器控制台没有错误
- [ ] API 请求返回正确响应

### 3. 功能验证
- [ ] 搜索功能正常
- [ ] 配置管理正常
- [ ] Engine 启动/停止正常
- [ ] 报告生成正常

## 📝 重要提醒

1. **本地构建成功 ≠ 生产构建成功**
   - Cloudflare Pages 在 Linux 环境构建
   - 可能遇到不同的依赖问题

2. **环境变量必须配置**
   - 在 Cloudflare Pages Dashboard 中设置
   - `NEXT_PUBLIC_*` 变量在构建时注入

3. **API 地址**
   - 确保指向正确的 Workers URL
   - 确保 Workers CORS 配置正确

4. **CORS 问题**
   - 如果遇到 CORS 错误，检查 Workers 配置
   - 确保允许 Pages 域名访问

## 🎯 下一步

1. 在 Cloudflare Pages Dashboard 中配置项目
2. 设置环境变量
3. 触发部署
4. 检查构建日志
5. 验证功能

