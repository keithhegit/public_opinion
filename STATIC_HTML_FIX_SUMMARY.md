# 静态 HTML 前端修复总结

## ✅ 已修复的问题

### 1. API 请求返回 HTML 而不是 JSON

**问题**: 所有 API 请求使用相对路径 `/api/...`，这些请求被发送到 Pages 域名，但 Pages 只托管静态文件，不处理 API 路由。

**解决方案**: 
- 添加了 `API_BASE_URL` 常量，指向 Workers URL: `https://bettafish-api-prod.keithhe2021.workers.dev`
- 将所有 API 端点从相对路径改为使用 `API_BASE_URL`

**修改的端点**:
- `/api/config` → `${API_BASE_URL}/api/config`
- `/api/system/status` → `${API_BASE_URL}/api/system/status`
- `/api/system/start` → `${API_BASE_URL}/api/system/start`
- `/api/status` → `${API_BASE_URL}/api/status`
- `/api/report/*` → `${API_BASE_URL}/api/report/*`
- `/api/forum/*` → `${API_BASE_URL}/api/forum/*`
- `/api/reports/*` → `${API_BASE_URL}/api/reports/*`
- `/api/output/*` → `${API_BASE_URL}/api/output/*`

### 2. Mixed Content 错误

**问题**: iframe 使用 `http://` 协议，但页面通过 HTTPS 加载，导致浏览器阻止混合内容。

**解决方案**:
- 创建了 Streamlit 代理路由 `/api/proxy/:app`
- 将 iframe 的 URL 从 `http://hostname:port` 改为 `${API_BASE_URL}/api/proxy/${app}`
- Workers 代理会转发请求到后端 Streamlit 服务

**修改的代码**:
- iframe 预加载: `http://${window.location.hostname}:${port}` → `${API_BASE_URL}/api/proxy/${app}`
- 搜索请求: `http://${window.location.hostname}:${ports[app]}?query=...` → `${API_BASE_URL}/api/proxy/${app}?query=...`

## 📋 新增文件

1. **`bettafish-workers/src/routes/proxy.ts`**
   - Streamlit 服务代理路由
   - 支持代理 insight (8501), media (8502), query (8503) 三个 Streamlit 服务

## 🔄 修改的文件

1. **`static-frontend/index.html`**
   - 添加 `API_BASE_URL` 常量
   - 更新所有 API 调用使用 Workers URL
   - 修复 iframe 协议问题

2. **`bettafish-workers/src/index.ts`**
   - 导入 `proxyRoutes`
   - 注册 `/api` 路由下的代理路由

## 🚀 部署步骤

1. **Workers 已更新**（需要重新部署）
   ```bash
   cd bettafish-workers
   npm run deploy
   ```

2. **Pages 会自动重新部署**（已推送代码到 GitHub）

## ✅ 验证

部署后，检查：
1. ✅ API 请求不再返回 HTML
2. ✅ 不再有 Mixed Content 错误
3. ✅ iframe 可以正常加载 Streamlit 应用
4. ✅ 所有功能正常工作

## 📝 注意事项

- Workers 需要能够访问后端服务器的 Streamlit 端口（8501, 8502, 8503）
- 如果后端服务器在私有网络，可能需要配置网络访问
- 确保 Workers 的 `BACKEND_URL` 环境变量正确配置

