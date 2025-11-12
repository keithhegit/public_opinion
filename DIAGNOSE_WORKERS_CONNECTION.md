# 诊断 Cloudflare Workers 连接问题

## ✅ 已确认
- 后端服务器正常运行
- 后端 API 正常响应（200 状态码）
- 防火墙和端口配置正常
- 外部可以直接访问后端

## 🔍 需要检查

### 1. Cloudflare Workers 环境变量配置

**步骤**：
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages**
3. 选择 **bettafish-api-prod**
4. 点击 **Settings** → **Variables and Secrets**
5. 检查以下环境变量：

**BACKEND_URL**：
- ✅ 应该是：`http://14.136.93.109`
- ❌ 不应该是：`https://14.136.93.109`（除非已配置 HTTPS）
- ❌ 不应该有尾随斜杠：`http://14.136.93.109/`
- ❌ 不应该有路径：`http://14.136.93.109/api`

**截图或记录当前值**：________________

---

### 2. Cloudflare Workers 日志

**步骤**：
1. 在 Cloudflare Dashboard 中
2. 进入 **Workers & Pages** → **bettafish-api-prod**
3. 点击 **Logs** 标签（或 **Real-time Logs**）
4. 在前端触发一次 Engine 启动（点击启动按钮）
5. 查看日志中的错误信息

**查找以下内容**：
- 错误代码 1003
- "Failed to fetch"
- "fetch failed"
- "Connection refused"
- "DNS resolution failed"

**记录错误信息**：________________

---

### 3. 测试 Cloudflare Workers 端点

在浏览器中访问以下 URL，查看响应：

#### 测试 1: Workers 健康检查
```
https://bettafish-api-prod.keithhe2021.workers.dev/api/health
```

**预期结果**：返回 JSON，包含 `status: "ok"`

**实际结果**：________________

#### 测试 2: Workers 状态检查
```
https://bettafish-api-prod.keithhe2021.workers.dev/api/status
```

**预期结果**：返回 JSON，包含后端状态信息

**实际结果**：________________

#### 测试 3: 直接测试 Workers 启动 API
在浏览器开发者工具（F12）的 Console 中执行：

```javascript
fetch('https://bettafish-api-prod.keithhe2021.workers.dev/api/start/insight', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**查看返回的错误信息**：________________

---

### 4. 检查 Workers 部署状态

**步骤**：
1. 在 Cloudflare Dashboard 中
2. 进入 **Workers & Pages** → **bettafish-api-prod**
3. 检查 **Deployments** 标签
4. 确认最新部署是否成功
5. 如果有失败的部署，查看错误信息

**部署状态**：________________

---

### 5. 检查 Workers 代码更新

确认 Workers 代码是否已更新到最新版本（包含改进的错误处理）：

**检查**：
- 代码仓库是否已推送最新更改
- Workers 是否已重新部署

---

## 🎯 最可能的原因

基于错误代码 **1003**，最可能的原因是：

### Cloudflare Workers 无法连接 HTTP 端点

**原因**：
- Cloudflare Workers 对从 Workers 到外部 HTTP 服务的连接可能有安全限制
- 某些情况下，Workers 只能连接到 HTTPS 端点

**验证方法**：
1. 查看 Workers 日志中的具体错误信息
2. 如果错误信息包含 "1003" 或 "DNS resolution failed"，很可能是这个问题

**解决方案**：
- 配置 HTTPS（见 FIX_CLOUDFLARE_1003_ERROR.md）
- 或使用 Cloudflare Tunnel

---

## 📋 诊断清单

- [ ] 检查 BACKEND_URL 环境变量配置
- [ ] 查看 Cloudflare Workers 日志
- [ ] 测试 Workers 健康检查端点
- [ ] 测试 Workers 状态检查端点
- [ ] 检查 Workers 部署状态
- [ ] 确认 Workers 代码已更新

---

## 🔧 临时测试方案

如果想快速验证是否是 HTTP 连接问题，可以：

1. **临时配置 HTTPS**（使用自签名证书）
2. **更新 BACKEND_URL 为 HTTPS**
3. **测试是否能连接**

如果 HTTPS 可以连接，说明确实是 HTTP 连接限制问题。

---

**请执行上述诊断步骤，并告诉我结果！**

