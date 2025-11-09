# Step 6: 部署到生产环境（可选）

## 🚀 部署Workers API到生产环境

### 6.1 更新生产环境配置

编辑 `bettafish-workers/wrangler.toml`，确保生产环境配置正确：

```toml
[env.production.vars]
ENVIRONMENT = "production"
BACKEND_URL = "https://your-backend-api.com"  # 替换为实际后端URL
```

### 6.2 部署到生产环境

```powershell
cd bettafish-workers
npm run deploy
```

**部署URL**: `https://bettafish-api-prod.keithhe2021.workers.dev`

## 📝 更新前端配置

部署生产环境Workers API后，更新前端环境变量：

```env
NEXT_PUBLIC_API_URL=https://bettafish-api-prod.keithhe2021.workers.dev
```

## ✅ 验证生产部署

测试生产环境API：
- https://bettafish-api-prod.keithhe2021.workers.dev/api/health
- https://bettafish-api-prod.keithhe2021.workers.dev/api/status

---

**注意**: 生产环境部署前，确保：
- [ ] 后端API已部署
- [ ] 所有配置已更新
- [ ] 测试通过

