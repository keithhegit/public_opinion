# 最后一步：更新 Cloudflare Workers 配置

## ✅ 已完成
- [x] DNS 配置（api.keithhe.com → Cloudflare IP）
- [x] SSL/TLS Flexible 模式
- [x] Nginx 配置完成
- [x] HTTPS 访问正常

## 🔧 最后一步：更新 Workers BACKEND_URL

### 步骤 1: 更新环境变量

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages**
3. 选择 **bettafish-api-prod**
4. 点击 **Settings** → **Variables and Secrets**
5. 找到 **BACKEND_URL** 环境变量
6. 点击 **Edit**（或编辑图标）
7. 更新值为：`https://api.keithhe.com`
   - ✅ 使用 `https://`（不是 `http://`）
   - ✅ 使用域名 `api.keithhe.com`（不是 IP）
   - ✅ 没有尾随斜杠
8. 点击 **Save**

### 步骤 2: 验证 Workers 连接

#### 测试 1: Workers 健康检查
在浏览器中访问：
```
https://bettafish-api-prod.keithhe2021.workers.dev/api/health
```

**预期结果**：返回 JSON，包含 `status: "ok"`

#### 测试 2: Workers 状态检查
在浏览器中访问：
```
https://bettafish-api-prod.keithhe2021.workers.dev/api/status
```

**预期结果**：返回 JSON，包含后端状态信息

#### 测试 3: 测试 Engine 启动
在浏览器开发者工具（F12）Console 中执行：

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

**预期结果**：返回成功消息，不再有 1003 错误

---

## 🧪 完整功能测试

### 1. 前端连接测试

1. 访问前端：`https://bettafish-frontend.pages.dev`
2. 打开浏览器开发者工具（F12）→ Console
3. 检查是否有错误
4. 确认显示"连接成功"（不是"等待连接..."）

### 2. Engine 启动测试

在前端界面：

1. **检查 LLM 配置**
   - 确认 API Keys 已配置

2. **点击"保存并启动系统"**
   - 观察所有 Engine 状态
   - 应该看到：Insight Engine、Media Engine、Query Engine、Report Engine 状态变为 "running"
   - 检查是否有错误提示

3. **测试各个 Engine**
   - Insight Engine：查看输出日志
   - Media Engine：查看输出日志
   - Query Engine：执行查询任务
   - Report Engine：生成报告

---

## 🐛 如果还有问题

### 问题 1: 仍然有 1003 错误

**检查**：
- 确认 BACKEND_URL 已更新为 `https://api.keithhe.com`
- 确认 Workers 已保存配置
- 等待几分钟让配置生效
- 清除浏览器缓存

### 问题 2: Workers 无法连接

**检查**：
- 测试 `https://api.keithhe.com/api/health` 是否正常
- 查看 Cloudflare Workers 日志
- 确认 SSL/TLS 模式是 Flexible

### 问题 3: CORS 错误

**检查**：
- 后端 CORS 配置是否包含前端域名
- Workers CORS 配置是否正确

---

## 📊 验证清单

- [ ] Cloudflare Workers BACKEND_URL 已更新为 `https://api.keithhe.com`
- [ ] Workers 健康检查正常
- [ ] Workers 状态检查正常
- [ ] 前端可以连接后端
- [ ] Engine 可以正常启动
- [ ] 没有 1003 错误
- [ ] 没有 CORS 错误

---

**更新 BACKEND_URL 后，告诉我测试结果！** 🚀

