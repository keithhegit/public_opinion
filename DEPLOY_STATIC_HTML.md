# 部署静态 HTML 前端到 Cloudflare Pages

## 🎯 方案说明

原始前端 `BettaFish-main/templates/index.html` 是**纯 HTML 文件**，无需 Next.js，可以直接部署到 Cloudflare Pages。

## ✅ 优势

1. **无需构建**：直接部署 HTML 文件
2. **无依赖问题**：不需要 npm、Node.js 等
3. **快速部署**：几秒钟即可完成
4. **易于维护**：直接编辑 HTML 即可

## 📋 部署步骤

### 方案 A: 使用现有 HTML 文件（推荐）

1. **在 Cloudflare Pages 中更新配置**

   **根目录**：`BettaFish-main/templates`

   **构建命令**：（留空，不需要构建）

   **构建输出目录**：（留空，或设置为 `.`）

   **Framework preset**：选择 `None` 或 `Plain HTML`

2. **或者创建专门的静态目录**

   ```bash
   mkdir -p static-frontend
   cp BettaFish-main/templates/index.html static-frontend/index.html
   ```

   然后设置根目录为 `static-frontend`

### 方案 B: 修复 Next.js 构建（如果必须使用 Next.js）

1. **更新 package-lock.json**

   在本地运行：
   ```bash
   cd bettafish-frontend
   rm package-lock.json
   npm install
   git add package-lock.json
   git commit -m "Update package-lock.json for Next.js 15.5.2"
   git push
   ```

2. **修改 Cloudflare Pages 构建命令**

   **构建命令**：
   ```bash
   cd bettafish-frontend && npm install && npm run build && npx @cloudflare/next-on-pages
   ```

   （使用 `npm install` 代替 `npm ci`，这样即使 lock 文件不同步也能工作）

## 🎯 推荐方案

**强烈推荐使用方案 A（静态 HTML）**：
- 更简单
- 更快速
- 更稳定
- 原始架构就是这样的

## 📝 检查 API 地址

在部署前，检查 `index.html` 中的 API 地址是否正确：

1. 查找所有 API 调用
2. 确保指向 `https://bettafish-api-prod.keithhe2021.workers.dev`
3. 而不是 `http://localhost:5000` 或其他本地地址

