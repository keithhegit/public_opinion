# BettaFish Cloudflare 部署步骤记录

## Step 1: 登录Cloudflare

### 1.1 检查Wrangler安装

```powershell
wrangler --version
```

如果未安装，运行：
```powershell
npm install -g wrangler
```

### 1.2 登录Cloudflare

```powershell
wrangler login
```

**操作步骤**:
1. 运行命令后会打开浏览器
2. 登录你的Cloudflare账户
3. 点击"Allow"授权Wrangler访问

### 1.3 验证登录

```powershell
wrangler whoami
```

**应该显示**:
- 账户邮箱
- 账户ID

---

## Step 2: 创建D1数据库

### 2.1 创建生产数据库

```powershell
wrangler d1 create bettafish-db
```

**复制输出的database_id**

### 2.2 创建开发数据库

```powershell
wrangler d1 create bettafish-db-dev
```

**复制输出的database_id**

---

## Step 3: 创建KV命名空间

### 3.1 创建生产KV

```powershell
wrangler kv:namespace create "BETTAFISH_CACHE"
wrangler kv:namespace create "BETTAFISH_CACHE" --preview
```

**复制输出的id和preview_id**

### 3.2 创建开发KV

```powershell
wrangler kv:namespace create "BETTAFISH_CACHE_DEV"
wrangler kv:namespace create "BETTAFISH_CACHE_DEV" --preview
```

**复制输出的id和preview_id**

---

## Step 4: 更新wrangler.toml

编辑 `bettafish-workers/wrangler.toml`，替换所有ID。

---

## Step 5: 部署Workers API

```powershell
cd bettafish-workers
npm run deploy:dev
```

---

## Step 6: 部署前端

```powershell
cd bettafish-frontend
npm install @cloudflare/next-on-pages --save-dev
npm run build
npx @cloudflare/next-on-pages
wrangler pages deploy .vercel/output/static --project-name=bettafish-frontend
```

---

**当前步骤**: Step 1 - 登录Cloudflare

