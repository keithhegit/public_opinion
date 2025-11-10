# Workers 后端连接问题修复指南

## 问题诊断

所有 API 请求返回 500 错误，可能的原因：

1. **BACKEND_URL 配置错误**
2. **后端无法访问**
3. **后端返回错误**
4. **网络连接问题**

## 已完成的修复

✅ **已添加 BACKEND_URL 检查**
- `config.ts` 现在会检查 `BACKEND_URL` 是否配置
- 如果未配置，返回 503 错误（而不是 500）
- 错误消息更清晰

## 诊断步骤

### Step 1: 检查 Workers 环境变量

1. 打开 Cloudflare Dashboard
2. 进入 Workers & Pages → bettafish-api-prod
3. 进入 Settings → Variables
4. 检查以下变量：

```
BACKEND_URL: https://your-railway-url.railway.app
ENVIRONMENT: production
```

**重要**：确保 `BACKEND_URL` 是您的 Railway 后端 URL（不是占位符）

### Step 2: 测试后端连接

在浏览器或使用 curl 测试：

```bash
# 测试健康检查
curl https://your-railway-url.railway.app/health

# 测试配置端点
curl https://your-railway-url.railway.app/api/config

# 测试论坛日志
curl https://your-railway-url.railway.app/api/forum/log
```

**预期结果**：
- `/health` 应该返回 `{"status":"ok",...}`
- `/api/config` 应该返回配置对象
- `/api/forum/log` 应该返回论坛日志

### Step 3: 测试 Workers 连接

```bash
# 测试 Workers 健康检查
curl https://bettafish-api-prod.keithhe2021.workers.dev/api/health

# 测试 Workers 配置端点（应该转发到后端）
curl https://bettafish-api-prod.keithhe2021.workers.dev/api/config
```

### Step 4: 检查 Workers 日志

1. 打开 Cloudflare Dashboard
2. 进入 Workers & Pages → bettafish-api-prod
3. 进入 Logs 标签
4. 查看最近的错误日志

查找以下错误：
- `Backend not configured` - BACKEND_URL 未配置
- `Failed to get config` - 后端连接失败
- `Network error` - 网络连接问题

## 常见问题解决

### 问题 1: BACKEND_URL 未配置

**症状**：返回 503 错误，消息 "Backend not configured"

**解决**：
1. 在 Cloudflare Dashboard 中设置 `BACKEND_URL`
2. 值应该是您的 Railway URL（例如：`https://your-app.railway.app`）
3. 不要包含尾部斜杠

### 问题 2: 后端无法访问

**症状**：返回 500 错误，消息 "Failed to get config"

**可能原因**：
- Railway 应用未运行
- URL 不正确
- 网络连接问题

**解决**：
1. 检查 Railway Dashboard，确认应用正在运行
2. 验证 URL 是否正确（从 Railway Dashboard 复制）
3. 测试直接访问后端 URL

### 问题 3: CORS 错误

**症状**：浏览器控制台显示 CORS 错误

**解决**：
- Workers 已经配置了 CORS
- 如果仍有问题，检查后端是否也配置了 CORS

### 问题 4: 后端返回错误

**症状**：后端返回 500 错误

**解决**：
1. 检查 Railway 部署日志
2. 查看后端错误信息
3. 确保后端应用正常运行

## 验证清单

- [ ] Workers `BACKEND_URL` 已正确配置
- [ ] Railway 后端应用正在运行
- [ ] 可以直接访问后端 URL（`/health` 端点）
- [ ] Workers 可以访问后端（测试 `/api/config`）
- [ ] 前端可以访问 Workers（测试 `/api/health`）
- [ ] 没有 CORS 错误
- [ ] Workers 日志中没有错误

## 下一步

1. **更新 BACKEND_URL**（如果未配置）
   - 从 Railway Dashboard 获取正确的 URL
   - 在 Cloudflare Workers 中设置环境变量

2. **测试连接**
   - 使用 curl 或浏览器测试各个端点
   - 检查 Workers 日志

3. **如果问题仍然存在**
   - 检查 Railway 部署日志
   - 验证后端应用是否正常运行
   - 查看 Workers 日志中的详细错误信息

## 快速测试命令

```bash
# 1. 测试后端健康检查
curl https://your-railway-url.railway.app/health

# 2. 测试 Workers 健康检查
curl https://bettafish-api-prod.keithhe2021.workers.dev/api/health

# 3. 测试 Workers 配置端点
curl https://bettafish-api-prod.keithhe2021.workers.dev/api/config

# 4. 测试 Workers 论坛日志
curl https://bettafish-api-prod.keithhe2021.workers.dev/api/forum/log
```

## 预期结果

✅ **成功的情况**：
- 所有端点返回 200 状态码
- 返回 JSON 数据（不是错误消息）
- 前端不再显示 500 错误

❌ **失败的情况**：
- 返回 503：BACKEND_URL 未配置
- 返回 500：后端连接失败或后端错误
- 返回 404：路由不存在

