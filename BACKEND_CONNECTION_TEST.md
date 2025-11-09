# 🔗 后端连接测试指南

## ✅ 配置已完成

你已经将 Cloudflare Workers 的 `BACKEND_URL` 更新为：
```
https://publicopinion-production.up.railway.app
```

## 🧪 测试步骤

### Step 1: 测试 Railway 后端是否可访问

在浏览器中访问：
```
https://publicopinion-production.up.railway.app/api/status
```

**预期结果**：
- 如果返回 JSON 数据（包含系统状态），说明后端正常运行 ✅
- 如果返回 404 或错误，需要检查 Railway 部署状态

### Step 2: 测试 Cloudflare Workers API 连接

在浏览器中访问：
```
https://bettafish-api-prod.keithhe2021.workers.dev/api/status
```

**预期结果**：
- 返回包含 `workers` 和 `backend` 状态的 JSON
- `backend.status` 应该是 `"ok"` 或包含引擎信息
- 如果 `backend.status` 是 `"error"`，说明 Workers 无法连接到 Railway 后端

### Step 3: 测试前端连接

1. 打开前端页面：`https://bettafish-frontend.pages.dev`
2. 打开浏览器开发者工具（F12）
3. 查看 Console 标签
4. 检查是否有错误信息

**预期结果**：
- 没有 CORS 错误
- 能够成功获取系统状态
- 能够看到引擎状态信息

### Step 4: 测试启动引擎功能

1. 在前端页面点击 "启动 Engine" 按钮（例如：Insight Engine）
2. 观察控制台输出

**预期结果**：
- 没有 500 错误
- 引擎状态从 `stopped` 变为 `starting` 再变为 `running`
- 如果出现错误，查看错误信息

## 🔍 常见问题排查

### 问题 1: Workers API 返回 503 "Backend not configured"

**原因**：Cloudflare Workers 环境变量未正确设置

**解决方法**：
1. 进入 Cloudflare Dashboard
2. 进入 Workers & Pages > bettafish-api-prod
3. 进入 Settings > Variables
4. 确认 `BACKEND_URL` 值为：`https://publicopinion-production.up.railway.app`
5. 保存并等待几秒钟让更改生效

### 问题 2: Workers API 返回 500 "Failed to get forum log"

**原因**：Railway 后端未运行或无法访问

**解决方法**：
1. 检查 Railway Dashboard 中的服务状态
2. 确认服务是 "Active" 状态
3. 查看 Railway 的部署日志，确认没有错误
4. 直接访问 `https://publicopinion-production.up.railway.app/api/status` 测试

### 问题 3: CORS 错误

**原因**：Railway 后端未配置 CORS

**解决方法**：
- Railway 后端需要允许来自 `https://bettafish-api-prod.keithhe2021.workers.dev` 的请求
- 或者允许所有来源（开发阶段）

### 问题 4: 连接超时

**原因**：Railway 服务可能正在启动或已停止

**解决方法**：
1. 检查 Railway Dashboard 中的服务状态
2. 如果服务已停止，重新启动
3. 等待服务完全启动（可能需要 1-2 分钟）

## 📋 验证清单

- [ ] Railway 后端可以访问：`https://publicopinion-production.up.railway.app/api/status`
- [ ] Workers API 可以访问：`https://bettafish-api-prod.keithhe2021.workers.dev/api/status`
- [ ] Workers API 返回的后端状态是 `"ok"`
- [ ] 前端可以正常加载，没有控制台错误
- [ ] 可以成功启动引擎

## 🎉 如果所有测试都通过

恭喜！你的完整架构已经部署成功：

- ✅ **前端**: Cloudflare Pages (`bettafish-frontend.pages.dev`)
- ✅ **API 网关**: Cloudflare Workers (`bettafish-api-prod.workers.dev`)
- ✅ **后端**: Railway (`publicopinion-production.up.railway.app`)

现在可以开始使用系统了！🚀

