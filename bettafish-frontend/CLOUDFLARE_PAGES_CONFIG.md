# Cloudflare Pages 配置说明

## 🎯 重要提示

前端托管在 **Cloudflare Pages**，本地测试需要考虑生产环境的特性。

## 📋 Cloudflare Pages 特性

### 1. 构建环境
- **操作系统**: Linux
- **Node.js**: 自动检测（通常是最新 LTS）
- **构建命令**: 在 Linux 环境中执行

### 2. 运行时环境
- **边缘计算**: 代码在 Cloudflare 边缘网络运行
- **无服务器**: 不需要管理服务器
- **全球 CDN**: 自动全球分发

### 3. 环境变量
- 需要在 Cloudflare Pages Dashboard 中配置
- `NEXT_PUBLIC_*` 变量会在构建时注入

## 🔧 当前配置

### next.config.ts
```typescript
const nextConfig: NextConfig = {
  // 已移除 output: 'standalone' - Cloudflare Pages 不需要
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://bettafish-api-prod.keithhe2021.workers.dev',
  },
};
```

### package.json
- Next.js: 15.5.2
- @cloudflare/next-on-pages: ^1.13.0

### API 客户端配置
- 使用环境变量 `NEXT_PUBLIC_API_URL`
- 默认指向 Workers: `https://bettafish-api-prod.keithhe2021.workers.dev`

## 🚀 Cloudflare Pages 部署配置

### 构建设置

**根目录**: `bettafish-frontend`

**构建命令**:
```bash
npm install && npm run build && npx @cloudflare/next-on-pages
```

**构建输出目录**: `.vercel/output/static`

**Framework preset**: Next.js

### 环境变量

在 Cloudflare Pages Dashboard 中配置：

- **NEXT_PUBLIC_API_URL**: `https://bettafish-api-prod.keithhe2021.workers.dev`

## 🧪 本地测试注意事项

### 1. API 地址
- 本地开发时，API 会指向 Workers（生产环境）
- 确保 Workers 已正确部署
- 确保 CORS 配置允许本地访问（如果需要）

### 2. 构建测试
- 本地构建成功 ≠ Cloudflare Pages 构建成功
- Cloudflare Pages 在 Linux 环境构建
- 使用 `npm ci` 而不是 `npm install`（更严格）

### 3. 环境变量
- 本地使用 `.env.local` 文件
- Cloudflare Pages 使用 Dashboard 配置的环境变量

## ✅ 验证清单

- [x] Next.js 配置已优化（移除 standalone）
- [x] @cloudflare/next-on-pages 已添加
- [x] Next.js 版本兼容（15.5.2）
- [x] API 客户端使用环境变量
- [ ] Cloudflare Pages 环境变量已配置
- [ ] Cloudflare Pages 构建成功

## 📝 部署后检查

1. **检查构建日志**
   - 确保构建成功
   - 检查是否有警告

2. **检查运行时**
   - 访问部署 URL
   - 检查浏览器控制台
   - 验证 API 调用

3. **检查环境变量**
   - 确保 `NEXT_PUBLIC_API_URL` 正确
   - 验证 API 请求指向正确的 Workers URL

