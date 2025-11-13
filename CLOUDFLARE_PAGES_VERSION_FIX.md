# Cloudflare Pages 版本修复

## 🔍 问题

构建失败，错误信息：
```
npm error notarget No matching version found for @cloudflare/next-on-pages@^1.15.0.
```

## ✅ 已修复

已将 `@cloudflare/next-on-pages` 版本从 `^1.15.0` 改为 `^1.13.0`。

## 📋 下一步

1. **等待自动部署**（如果已启用自动部署）
   - Cloudflare Pages 会自动检测到新的提交并开始构建

2. **或手动触发部署**
   - 在 Cloudflare Pages Dashboard 中点击"重新部署"

3. **如果仍然失败**

   尝试使用最新可用版本。检查可用版本：
   ```bash
   npm view @cloudflare/next-on-pages versions
   ```

   或者使用 `latest` 标签（不推荐，但可以尝试）：
   ```json
   "@cloudflare/next-on-pages": "latest"
   ```

## 🔄 替代方案

如果 `@cloudflare/next-on-pages` 仍然有问题，可以考虑：

### 方案 1: 使用静态导出

修改 `next.config.ts`：
```typescript
const nextConfig: NextConfig = {
  output: 'export',  // 静态导出
  // ...
};
```

然后构建输出目录改为：`.next/out` 或 `out`

### 方案 2: 使用 GitHub Actions 构建

在 GitHub Actions 中构建，然后将构建产物上传到 Cloudflare Pages。

## 📝 当前配置

- **版本**：`@cloudflare/next-on-pages@^1.13.0`
- **状态**：已推送，等待 Cloudflare Pages 自动部署

