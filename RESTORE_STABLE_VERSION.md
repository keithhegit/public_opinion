# 恢复稳定版本操作指南

## ✅ 当前状态

- **已切换到**: commit `16a2002` - "Add report download functionality for Media and Query Engines"
- **分支**: `stable-before-forum` (新创建的保护分支)
- **状态**: 这是添加 Forum Engine 前端功能之前的最后一个稳定版本

## 📋 版本分析

### 该版本包含的内容

1. **Next.js 前端** (`bettafish-frontend`)
   - ✅ Next.js 16.0.1
   - ✅ 完整的组件结构
   - ✅ API 客户端包含 Forum API 方法（但前端 UI 可能没有 Forum 按钮）
   - ⚠️ `next.config.ts` 有 `output: 'standalone'` - 需要移除用于 Cloudflare Pages

2. **Workers** (`bettafish-workers`)
   - ✅ 包含 Forum 路由（后端 API 支持）
   - ✅ 所有核心功能路由

3. **后端** (`BettaFish-main`)
   - ✅ 报告下载功能
   - ✅ 所有 Engine 支持

### 该版本不包含的内容

- ❌ Forum Engine 的前端 UI 按钮（下载日志、查看日志）
- ❌ static-frontend 目录
- ❌ Next.js 降级到 15.5.2
- ❌ @cloudflare/next-on-pages 配置

## 🔧 需要修复的配置

### 1. 修复 Next.js Cloudflare Pages 配置

**文件**: `bettafish-frontend/next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 移除 output: 'standalone' - Cloudflare Pages 不需要
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://bettafish-api-prod.keithhe2021.workers.dev',
  },
};

export default nextConfig;
```

### 2. 添加 Cloudflare Pages 支持

**文件**: `bettafish-frontend/package.json`

需要添加：
```json
{
  "devDependencies": {
    "@cloudflare/next-on-pages": "^1.13.0",
    // ... 其他依赖
  }
}
```

### 3. 检查 Next.js 版本兼容性

如果 `@cloudflare/next-on-pages@1.13.0` 不支持 Next.js 16.0.1，可能需要：
- 降级 Next.js 到 15.5.2
- 或升级 `@cloudflare/next-on-pages` 到支持 Next.js 16 的版本

## 🚀 恢复步骤

### 步骤 1: 确认当前分支

```bash
git branch
# 应该显示: * stable-before-forum
```

### 步骤 2: 修复 Next.js 配置

1. 编辑 `bettafish-frontend/next.config.ts` - 移除 `output: 'standalone'`
2. 编辑 `bettafish-frontend/package.json` - 添加 `@cloudflare/next-on-pages`

### 步骤 3: 测试本地构建

```bash
cd bettafish-frontend
npm install
npm run build
```

### 步骤 4: 部署到 Cloudflare Pages

1. 推送代码到 GitHub
2. Cloudflare Pages 会自动构建
3. 检查构建日志

## 📝 注意事项

- 这个版本**有** Forum API 支持（后端和 Workers）
- 这个版本**没有** Forum 的前端 UI 按钮
- 如果需要 Forum 前端功能，需要手动添加（但这是稳定版本，建议先确保基本功能正常）

## ✅ 验证清单

- [ ] Next.js 配置已修复
- [ ] 本地构建成功
- [ ] Cloudflare Pages 部署成功
- [ ] 前端可以正常加载
- [ ] API 调用正常工作
- [ ] 所有 Engine 功能正常

