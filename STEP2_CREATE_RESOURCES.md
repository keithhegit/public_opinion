# Step 2: 创建Cloudflare资源

## ✅ Step 1 完成

- ✅ Cloudflare登录成功！

## 🎯 Step 2: 创建D1数据库和KV命名空间

### 2.1 创建生产环境D1数据库

运行以下命令：

```powershell
wrangler d1 create bettafish-db
```

**重要**: 复制输出的 `database_id`，稍后需要更新到 `wrangler.toml`

### 2.2 创建开发环境D1数据库

```powershell
wrangler d1 create bettafish-db-dev
```

**重要**: 复制输出的 `database_id`

### 2.3 创建生产环境KV命名空间

```powershell
# 生产KV
wrangler kv:namespace create "BETTAFISH_CACHE"

# 生产预览KV
wrangler kv:namespace create "BETTAFISH_CACHE" --preview
```

**重要**: 复制输出的 `id` 和 `preview_id`

### 2.4 创建开发环境KV命名空间

```powershell
# 开发KV
wrangler kv:namespace create "BETTAFISH_CACHE_DEV"

# 开发预览KV
wrangler kv:namespace create "BETTAFISH_CACHE_DEV" --preview
```

**重要**: 复制输出的 `id` 和 `preview_id`

## 📝 需要记录的信息

创建资源后，请记录以下信息：

### D1数据库ID
- 生产: `database_id = "________________"`
- 开发: `database_id = "________________"`

### KV命名空间ID
- 生产ID: `id = "________________"`
- 生产预览ID: `preview_id = "________________"`
- 开发ID: `id = "________________"`
- 开发预览ID: `preview_id = "________________"`

## ⏭️ 下一步

创建完所有资源后，我们将：
- **Step 3**: 更新 `wrangler.toml` 配置文件
- **Step 4**: 部署Workers API
- **Step 5**: 部署前端

---

**提示**: 每个命令的输出都会显示需要复制的ID，请仔细保存。

