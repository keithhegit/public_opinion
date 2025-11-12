# 测试后端 API

## PowerShell 测试命令

### 1. 测试健康检查

```powershell
Invoke-WebRequest -Uri "http://14.136.93.109/api/health" -Method GET | Select-Object -ExpandProperty Content
```

或者：

```powershell
curl.exe http://14.136.93.109/api/health
```

### 2. 测试启动 Insight Engine

```powershell
Invoke-WebRequest -Uri "http://14.136.93.109/api/start/insight" -Method POST | Select-Object -ExpandProperty Content
```

或者：

```powershell
curl.exe -X POST http://14.136.93.109/api/start/insight
```

### 3. 测试获取状态

```powershell
Invoke-WebRequest -Uri "http://14.136.93.109/api/status" -Method GET | Select-Object -ExpandProperty Content
```

### 4. 测试所有 Engine 启动

```powershell
$engines = @("insight", "media", "query", "report")
foreach ($engine in $engines) {
    Write-Host "Testing $engine..."
    Invoke-WebRequest -Uri "http://14.136.93.109/api/start/$engine" -Method POST | Select-Object StatusCode, Content
}
```

---

## 诊断 Cloudflare Workers 连接问题

### 步骤 1: 检查 Cloudflare Workers 环境变量

1. 登录 Cloudflare Dashboard
2. 进入 **Workers & Pages**
3. 选择 **bettafish-api-prod**
4. 点击 **Settings** → **Variables**
5. 检查 `BACKEND_URL` 的值：
   - ✅ 应该是：`http://14.136.93.109`
   - ❌ 不应该是：`https://14.136.93.109`（除非配置了 HTTPS）
   - ❌ 不应该有尾随斜杠：`http://14.136.93.109/`

### 步骤 2: 检查 Cloudflare Workers 日志

1. 在 Cloudflare Dashboard 中
2. 进入 **Workers & Pages** → **bettafish-api-prod**
3. 点击 **Logs** 标签
4. 查看最近的错误日志
5. 查找包含 "1003" 或 "Failed to fetch" 的错误

### 步骤 3: 测试 Cloudflare Workers 直接访问后端

在浏览器中打开：

```
https://bettafish-api-prod.keithhe2021.workers.dev/api/health
```

如果返回正常，说明 Workers 本身正常。

然后测试：

```
https://bettafish-api-prod.keithhe2021.workers.dev/api/status
```

查看是否能获取后端状态。

### 步骤 4: 检查后端 API 路由

确认后端有以下路由：

- ✅ `/api/health` - 健康检查
- ✅ `/api/start/:app` - 启动 Engine
- ✅ `/api/stop/:app` - 停止 Engine
- ✅ `/api/output/:app` - 获取输出
- ✅ `/api/status` - 获取状态

---

## 可能的问题和解决方案

### 问题 1: Cloudflare Workers 无法连接 HTTP

**症状**：错误代码 1003

**原因**：Cloudflare Workers 可能对 HTTP 连接有安全限制

**解决方案**：配置 HTTPS（见 FIX_CLOUDFLARE_1003_ERROR.md）

### 问题 2: BACKEND_URL 配置错误

**检查**：
- URL 格式是否正确
- 是否有协议前缀（http://）
- 是否有尾随斜杠
- 是否使用了 HTTPS 但服务器只支持 HTTP

### 问题 3: 后端路由不存在

**检查**：确认后端有对应的路由处理

```bash
# 在服务器上检查路由
curl http://localhost:5000/api/start/insight
```

---

## 快速诊断脚本

在 PowerShell 中执行：

```powershell
# 测试所有关键 API 端点
$baseUrl = "http://14.136.93.109"

Write-Host "Testing Backend APIs..."
Write-Host ""

# 1. 健康检查
Write-Host "1. Health Check:"
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/health" -Method GET
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)"
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

Write-Host ""

# 2. 系统状态
Write-Host "2. System Status:"
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/status" -Method GET
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content.Substring(0, [Math]::Min(200, $response.Content.Length)))..."
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

Write-Host ""

# 3. 启动 Insight Engine
Write-Host "3. Start Insight Engine:"
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/start/insight" -Method POST
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)"
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host "   Status Code: $($_.Exception.Response.StatusCode.value__)"
}

Write-Host ""
Write-Host "Diagnosis complete!"
```

