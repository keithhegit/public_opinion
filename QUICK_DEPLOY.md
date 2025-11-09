# ⚡ 快速部署前端到Cloudflare Pages

## 🚀 5步完成部署

### 1️⃣ 打开Cloudflare Dashboard
**访问**: https://dash.cloudflare.com

### 2️⃣ 创建Pages项目
- 左侧菜单 → **Pages**
- 点击 **Create a project**
- 选择 **Connect to Git**

### 3️⃣ 连接GitHub仓库
- 授权Cloudflare（如需要）
- 选择仓库: **keithhegit/public_opinion**
- 点击 **Begin setup**

### 4️⃣ 配置构建设置

**项目名称**: `bettafish-frontend`

**构建命令**:
```
cd bettafish-frontend && npm install && npm run build && npx @cloudflare/next-on-pages
```

**输出目录**:
```
bettafish-frontend/.vercel/output/static
```

**环境变量**:
- Name: `NEXT_PUBLIC_API_URL`
- Value: `https://bettafish-api-prod.keithhe2021.workers.dev`

### 5️⃣ 部署
- 点击 **Save and Deploy**
- 等待3-5分钟

## ✅ 完成！

部署成功后访问你的Pages URL测试功能。

---

**详细说明**: 查看 [PAGES_DEPLOY_NOW.md](./PAGES_DEPLOY_NOW.md)

