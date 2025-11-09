# BettaFish 部署检查清单

## ✅ 部署前检查

### 代码检查
- [x] 所有代码通过lint检查
- [x] TypeScript编译无错误
- [x] 所有依赖已安装
- [x] 环境变量配置完成

### 功能检查
- [ ] 本地测试通过
- [ ] API端点测试通过
- [ ] 前端功能测试通过
- [ ] 错误处理测试通过

### 配置检查
- [ ] `wrangler.toml` 配置正确
- [ ] `.env.local` 配置正确
- [ ] `.dev.vars` 配置正确（开发环境）
- [ ] CORS配置正确

## 📦 Cloudflare资源配置

### D1数据库
- [ ] 创建数据库: `wrangler d1 create bettafish-db`
- [ ] 更新 `wrangler.toml` 中的 `database_id`
- [ ] 执行迁移（如需要）: `wrangler d1 execute bettafish-db --file=./schema.sql`

### Workers KV
- [ ] 创建生产KV: `wrangler kv:namespace create "BETTAFISH_CACHE"`
- [ ] 创建预览KV: `wrangler kv:namespace create "BETTAFISH_CACHE" --preview`
- [ ] 更新 `wrangler.toml` 中的 `id` 和 `preview_id`

### Secrets
- [ ] 设置 `BACKEND_TOKEN`（如需要）: `wrangler secret put BACKEND_TOKEN`

## 🚀 部署步骤

### Workers API部署

1. **开发环境部署**
   ```bash
   cd bettafish-workers
   npm run deploy:dev
   ```
   - [ ] 部署成功
   - [ ] 获取部署URL
   - [ ] 测试健康检查

2. **生产环境部署**
   ```bash
   npm run deploy
   ```
   - [ ] 部署成功
   - [ ] 更新前端API URL
   - [ ] 测试所有端点

### 前端Pages部署

1. **安装Pages适配器**
   ```bash
   cd bettafish-frontend
   npm install @cloudflare/next-on-pages --save-dev
   ```
   - [ ] 安装成功

2. **构建**
   ```bash
   npm run build
   npx @cloudflare/next-on-pages
   ```
   - [ ] 构建成功
   - [ ] 无错误

3. **部署**
   ```bash
   wrangler pages deploy .vercel/output/static
   ```
   - [ ] 部署成功
   - [ ] 获取Pages URL

4. **配置环境变量**
   - [ ] 在Cloudflare Dashboard设置 `NEXT_PUBLIC_API_URL`
   - [ ] 重新部署（如需要）

## 🧪 部署后测试

### API测试
- [ ] `GET /api/health` - 健康检查
- [ ] `GET /api/status` - 系统状态
- [ ] `POST /api/start/insight` - 启动Engine
- [ ] `GET /api/output/insight` - 获取输出
- [ ] `POST /api/search` - 搜索功能
- [ ] `GET /api/config` - 获取配置
- [ ] `POST /api/config` - 更新配置

### 前端测试
- [ ] 页面加载
- [ ] 搜索功能
- [ ] Engine管理
- [ ] 配置管理
- [ ] 报告生成
- [ ] 控制台输出

### 集成测试
- [ ] 前端 → Workers API 通信
- [ ] Workers API → Python后端 通信
- [ ] 缓存机制
- [ ] 错误处理

## 📊 监控和日志

### Cloudflare Dashboard
- [ ] Workers Analytics配置
- [ ] Pages Analytics配置
- [ ] 错误日志查看
- [ ] 性能监控

### 日志检查
- [ ] Workers日志正常
- [ ] 前端日志正常
- [ ] 错误日志记录

## 🔒 安全检查

- [ ] Secrets正确配置
- [ ] CORS配置正确
- [ ] API认证（如需要）
- [ ] 敏感信息未暴露

## 📝 文档更新

- [ ] 更新README
- [ ] 更新部署文档
- [ ] 记录部署URL
- [ ] 记录配置信息

## 🎯 完成标准

- [ ] 所有测试通过
- [ ] 生产环境正常运行
- [ ] 监控配置完成
- [ ] 文档更新完成
- [ ] 团队通知完成

---

**部署完成后**: 更新 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md) 标记为已部署

