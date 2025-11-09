# GitHub仓库设置和Cloudflare Pages部署指南

## ✅ 代码已推送到GitHub

**仓库地址**: https://github.com/keithhegit/public_opinion

## 🚀 下一步：配置Cloudflare Pages

### Step 1: 在Cloudflare Dashboard创建Pages项目

1. **访问Cloudflare Dashboard**
   - 网址: https://dash.cloudflare.com
   - 登录你的账户

2. **进入Pages**
   - 在左侧菜单找到 **Pages**
   - 点击 **Create a project**

3. **连接GitHub仓库**
   - 选择 **Connect to Git**
   - 如果首次使用，需要授权Cloudflare访问GitHub
   - 选择仓库: `keithhegit/public_opinion`

### Step 2: 配置构建设置

**项目名称**: `bettafish-frontend` (或你喜欢的名称)

**构建设置**:
- **Framework preset**: `Next.js`
- **Build command**: 
  ```
  cd bettafish-frontend && npm install && npm run build && npx @cloudflare/next-on-pages
  ```
- **Build output directory**: 
  ```
  bettafish-frontend/.vercel/output/static
  ```
- **Root directory**: `/` (留空或 `/`)

**环境变量**:
点击 **Add environment variable**，添加：
- **Variable name**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://bettafish-api-prod.keithhe2021.workers.dev`
- **Environment**: 选择 `Production` (或 `All environments`)

### Step 3: 部署

1. 点击 **Save and Deploy**
2. Cloudflare会自动开始构建和部署
3. 等待部署完成（通常需要几分钟）

### Step 4: 获取部署URL

部署完成后，你会获得一个Pages URL，类似：
- `https://bettafish-frontend.pages.dev`
- 或 `https://bettafish-frontend-xxxxx.pages.dev`

## 📝 重要提示

### 如果构建失败

1. **检查构建日志**
   - 在Pages项目页面查看构建日志
   - 查找错误信息

2. **常见问题**:
   - 如果 `@cloudflare/next-on-pages` 失败，可能需要使用WSL或Linux环境
   - 或者使用GitHub Actions进行构建

### 使用GitHub Actions构建（备选方案）

如果Cloudflare Pages构建失败，可以创建GitHub Actions工作流：

创建 `.github/workflows/deploy-pages.yml`:
```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd bettafish-frontend
          npm install
      - name: Build
        run: |
          cd bettafish-frontend
          npm run build
          npx @cloudflare/next-on-pages
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: bettafish-frontend
          directory: bettafish-frontend/.vercel/output/static
```

## ✅ 部署检查清单

- [x] 代码已推送到GitHub
- [ ] 在Cloudflare Dashboard创建Pages项目
- [ ] 配置构建设置
- [ ] 设置环境变量
- [ ] 部署成功
- [ ] 测试前端功能

## 🔗 相关链接

- GitHub仓库: https://github.com/keithhegit/public_opinion
- Cloudflare Dashboard: https://dash.cloudflare.com
- Workers API (生产): https://bettafish-api-prod.keithhe2021.workers.dev
- Workers API (开发): https://bettafish-api-dev.keithhe2021.workers.dev

---

**下一步**: 在Cloudflare Dashboard配置Pages项目并部署！

