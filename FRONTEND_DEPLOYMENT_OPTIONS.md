# 前端部署选项

## ⚠️ Windows系统限制

`@cloudflare/next-on-pages` 在Windows上需要bash，可能无法正常工作。

## 🎯 推荐方案：使用GitHub集成（最简单）

### 方法1: GitHub集成部署（推荐）

1. **推送代码到GitHub**
   ```powershell
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **在Cloudflare Dashboard配置**
   - 访问: https://dash.cloudflare.com
   - 进入 **Pages** > **Create a project**
   - 选择 **Connect to Git**
   - 选择你的仓库
   - 配置构建设置:
     - **Framework preset**: Next.js
     - **Build command**: `npm run build && npx @cloudflare/next-on-pages`
     - **Build output directory**: `.vercel/output/static`
     - **Root directory**: `bettafish-frontend` (如果仓库根目录)
   - 添加环境变量:
     - `NEXT_PUBLIC_API_URL` = `https://bettafish-api-dev.keithhe2021.workers.dev`
   - 点击 **Save and Deploy**

### 方法2: 使用WSL（Windows Subsystem for Linux）

如果你有WSL，可以在WSL中运行：
```bash
cd /mnt/d/Code/Public_Opinion/bettafish-frontend
npm run build
npx @cloudflare/next-on-pages
wrangler pages deploy .vercel/output/static --project-name=bettafish-frontend
```

### 方法3: 手动上传（临时方案）

1. 构建项目（已完成）
2. 在Cloudflare Dashboard手动上传构建产物

## ⏭️ 下一步

选择最适合你的方法进行部署。

