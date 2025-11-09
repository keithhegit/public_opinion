# 🚀 立即开始Cloudflare部署

## 📋 快速部署步骤

### Step 1: 登录Cloudflare (2分钟)

```powershell
# 确保已安装wrangler
npm install -g wrangler

# 登录
wrangler login
```

✅ 在浏览器中完成登录授权

---

### Step 2: 创建资源 (5分钟)

#### 2.1 创建D1数据库

```powershell
# 生产数据库
wrangler d1 create bettafish-db

# 开发数据库
wrangler d1 create bettafish-db-dev
```

**复制输出的database_id**

#### 2.2 创建KV命名空间

```powershell
# 生产KV
wrangler kv:namespace create "BETTAFISH_CACHE"
wrangler kv:namespace create "BETTAFISH_CACHE" --preview

# 开发KV
wrangler kv:namespace create "BETTAFISH_CACHE_DEV"
wrangler kv:namespace create "BETTAFISH_CACHE_DEV" --preview
```

**复制输出的id和preview_id**

---

### Step 3: 更新配置 (3分钟)

编辑 `bettafish-workers/wrangler.toml`:

1. **替换D1 database_id** (第17行和第35行)
2. **替换KV id和preview_id** (第11-12行和第29-30行)
3. **设置BACKEND_URL** (第21行，生产环境后端URL)

---

### Step 4: 部署Workers API (2分钟)

```powershell
cd bettafish-workers

# 部署到开发环境
npm run deploy:dev

# 或部署到生产环境
npm run deploy
```

✅ 复制输出的部署URL

---

### Step 5: 部署前端 (5分钟)

```powershell
cd bettafish-frontend

# 安装Pages适配器
npm install @cloudflare/next-on-pages --save-dev

# 构建
npm run build
npx @cloudflare/next-on-pages

# 部署
wrangler pages deploy .vercel/output/static --project-name=bettafish-frontend
```

✅ 复制输出的Pages URL

---

### Step 6: 配置前端环境变量

在Cloudflare Dashboard:
1. 进入 **Pages** > **bettafish-frontend** > **Settings** > **Environment variables**
2. 添加:
   - `NEXT_PUBLIC_API_URL` = `https://bettafish-api-prod.your-subdomain.workers.dev`
3. 重新部署

---

### Step 7: 验证部署

**测试Workers API**:
```powershell
curl https://bettafish-api-prod.your-subdomain.workers.dev/api/health
```

**测试前端**:
- 访问Pages URL
- 测试所有功能

---

## ✅ 部署检查清单

- [ ] Cloudflare登录成功
- [ ] D1数据库创建完成
- [ ] KV命名空间创建完成
- [ ] wrangler.toml已更新
- [ ] Workers API部署成功
- [ ] 前端Pages部署成功
- [ ] 环境变量已配置
- [ ] 功能测试通过

---

## 🆘 遇到问题？

查看详细指南: [CLOUDFLARE_DEPLOYMENT_GUIDE.md](./CLOUDFLARE_DEPLOYMENT_GUIDE.md)

---

**预计总时间**: 15-20分钟

