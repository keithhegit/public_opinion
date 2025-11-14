# 回退到稳定版本总结

## ✅ 已完成的回退操作

1. **切换到稳定 commit**: `16a2002` - "Add report download functionality for Media and Query Engines"
2. **创建保护分支**: `stable-before-forum` - 用于保留这个稳定版本
3. **确认状态**: 这是添加 Forum Engine 功能之前的最后一个稳定版本

## 📋 该版本的状态

### Next.js 前端 (`bettafish-frontend`)
- ✅ Next.js 版本: `16.0.1`
- ✅ 包含完整的组件：
  - `SearchSection.tsx`
  - `MainContent.tsx`
  - `ConsoleSection.tsx`
  - `ConfigDialog.tsx`
  - `ReportDialog.tsx`
- ✅ API 客户端: `lib/api-client.ts`
- ⚠️ `next.config.ts` 中有 `output: 'standalone'` - 需要移除用于 Cloudflare Pages

### Workers (`bettafish-workers`)
- ✅ 包含所有核心路由
- ✅ 没有 Forum Engine 相关代码（这是稳定的原因）

### 后端 (`BettaFish-main`)
- ✅ 包含报告下载功能
- ✅ 没有 Forum Engine 相关的前端修改

## 🔧 需要修复的配置

### 1. Next.js Cloudflare Pages 配置

需要修改 `bettafish-frontend/next.config.ts`:

```typescript
// 移除 output: 'standalone'（用于 Cloudflare Pages）
const nextConfig: NextConfig = {
  // output: 'standalone', // 移除这行
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://bettafish-api-prod.keithhe2021.workers.dev',
  },
};
```

### 2. 添加 Cloudflare Pages 支持

需要添加 `@cloudflare/next-on-pages` 到 `package.json`:

```json
{
  "devDependencies": {
    "@cloudflare/next-on-pages": "^1.13.0",
    // ... 其他依赖
  }
}
```

### 3. 降级 Next.js（如果需要）

如果 `@cloudflare/next-on-pages` 不支持 Next.js 16，可能需要降级到 15.5.2。

## 🚀 下一步操作

1. **修复 Next.js 配置**
2. **测试本地构建**
3. **部署到 Cloudflare Pages**
4. **验证功能正常**

## 📝 注意事项

- 这个版本**没有** Forum Engine 的前端功能
- 这个版本**没有** static-frontend 目录
- 这个版本使用 Next.js 16.0.1
- 需要确保 Workers 也回退到对应的版本

