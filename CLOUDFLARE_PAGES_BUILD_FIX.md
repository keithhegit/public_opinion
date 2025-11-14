# Cloudflare Pages 构建修复指南

## 🔍 问题诊断

从 Cloudflare Pages 设置看，构建配置存在以下问题：

1. **Next.js 配置问题**：`next.config.ts` 中使用了 `output: 'standalone'`，这是用于 Node.js 部署的，不适合 Cloudflare Pages
2. **缺少依赖**：`package.json` 中缺少 `@cloudflare/next-on-pages` 依赖
3. **构建输出目录**：可能需要调整

## ✅ 已修复的问题

### 1. 修复 `next.config.ts`
- 移除了 `output: 'standalone'` 配置
- 保留环境变量配置

### 2. 添加 `@cloudflare/next-on-pages` 依赖
- 添加到 `devDependencies`

## 📋 Cloudflare Pages 配置建议

### 当前配置（需要更新）

**构建命令**：
```bash
cd bettafish-frontend && npm install && npm run build && npx @cloudflare/next-on-pages
```

**构建输出目录**：
```
bettafish-frontend/.vercel/output/static
```

**根目录**：
```
bettafish-frontend
```

### 推荐配置

**方案 1：使用根目录设置（推荐）**

**根目录**：
```
bettafish-frontend
```

**构建命令**：
```bash
npm install && npm run build && npx @cloudflare/next-on-pages
```

**构建输出目录**：
```
.vercel/output/static
```

**方案 2：保持当前配置（如果方案1不行）**

**根目录**：
```
（留空）
```

**构建命令**：
```bash
cd bettafish-frontend && npm install && npm run build && npx @cloudflare/next-on-pages
```

**构建输出目录**：
```
bettafish-frontend/.vercel/output/static
```

## 🔄 更新步骤

### 1. 更新代码并推送

代码已经修复，需要推送：

```bash
cd bettafish-frontend
git add next.config.ts package.json
git commit -m "Fix Cloudflare Pages build configuration"
git push
```

### 2. 在 Cloudflare Pages 中更新配置

1. 进入 Cloudflare Dashboard
2. 选择 `bettafish-frontend` 项目
3. 进入"设置" > "构建"
4. 更新配置：

   **推荐配置**：
   - **根目录**：`bettafish-frontend`
   - **构建命令**：`npm install && npm run build && npx @cloudflare/next-on-pages`
   - **构建输出目录**：`.vercel/output/static`

5. 点击"保存"

### 3. 触发新的部署

1. 在"部署"标签页
2. 点击"重新部署"或等待自动部署

## 🧪 验证构建

部署后，检查构建日志：

1. 进入"部署"标签页
2. 查看最新的部署日志
3. 检查是否有错误

### 常见错误及解决方案

**错误 1：找不到 `@cloudflare/next-on-pages`**
- 解决：确保 `package.json` 中已添加依赖并已推送

**错误 2：找不到构建输出目录**
- 解决：检查构建输出目录路径是否正确
- 尝试使用方案 1 的配置

**错误 3：构建超时**
- 解决：Cloudflare Pages 构建有 20 分钟限制
- 如果超时，可能需要优化构建过程

## 📝 检查清单

- [ ] 代码已推送（`next.config.ts` 和 `package.json` 已更新）
- [ ] Cloudflare Pages 配置已更新
- [ ] 环境变量 `NEXT_PUBLIC_API_URL` 已设置
- [ ] 触发新的部署
- [ ] 检查构建日志是否有错误
- [ ] 验证部署是否成功

## 🔗 相关文档

- [Cloudflare Pages Next.js 文档](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [@cloudflare/next-on-pages 文档](https://github.com/cloudflare/next-on-pages)

