# Step 5: 部署前端到Cloudflare Pages

## 🚀 部署步骤

### 5.1 安装Pages适配器

```powershell
cd bettafish-frontend
npm install @cloudflare/next-on-pages --save-dev
```

### 5.2 构建Next.js应用

```powershell
npm run build
```

### 5.3 适配为Pages格式

```powershell
npx @cloudflare/next-on-pages
```

### 5.4 部署到Pages

```powershell
wrangler pages deploy .vercel/output/static --project-name=bettafish-frontend
```

## ⚙️ 配置环境变量

部署后，在Cloudflare Dashboard设置环境变量：
- `NEXT_PUBLIC_API_URL` = `https://bettafish-api-dev.keithhe2021.workers.dev`

## ⏭️ 下一步

部署成功后，可以：
1. 测试前端功能
2. 部署到生产环境（可选）

