# 回退完成 - 下一步操作

## ✅ 已完成

1. **回退到稳定版本**: commit `16a2002`
2. **创建保护分支**: `stable-before-forum`
3. **修复 Next.js 配置**:
   - 移除 `output: 'standalone'`
   - 添加 `@cloudflare/next-on-pages@^1.13.0`
4. **代码已推送**: 到 `stable-before-forum` 分支

## 🔧 当前状态

### Next.js 前端
- ✅ Next.js 16.0.1
- ✅ 配置已修复（移除 standalone）
- ✅ 添加了 Cloudflare Pages 支持
- ⚠️ 需要测试是否兼容（如果不行，需要降级到 15.5.2）

### Workers
- ✅ 包含所有核心路由
- ✅ Forum API 支持（后端）
- ⚠️ 前端没有 Forum UI 按钮（这是稳定的原因）

## 🚀 下一步操作

### 选项 1: 使用稳定分支部署（推荐）

1. **切换到 main 分支并合并稳定版本**
   ```bash
   git checkout main
   git merge stable-before-forum
   git push origin main
   ```

2. **在 Cloudflare Pages 中配置**
   - 根目录: `bettafish-frontend`
   - 构建命令: `cd bettafish-frontend && npm install && npm run build && npx @cloudflare/next-on-pages`
   - 输出目录: `bettafish-frontend/.vercel/output/static`

### 选项 2: 测试兼容性

如果 Next.js 16.0.1 与 `@cloudflare/next-on-pages@1.13.0` 不兼容：

1. **降级 Next.js**
   ```bash
   cd bettafish-frontend
   npm install next@15.5.2 eslint-config-next@15.5.2
   ```

2. **测试构建**
   ```bash
   npm run build
   npx @cloudflare/next-on-pages
   ```

## 📝 注意事项

- 这个版本**没有** Forum Engine 的前端 UI
- 这个版本**有** Forum API 支持（如果需要，可以手动添加 UI）
- 建议先确保基本功能正常，再考虑添加 Forum UI

## ✅ 验证清单

- [ ] 本地构建成功
- [ ] Cloudflare Pages 部署成功
- [ ] 前端可以正常加载
- [ ] API 调用正常工作
- [ ] 所有 Engine 功能正常

