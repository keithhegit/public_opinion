# BettaFish 后端连接测试脚本

Write-Host "=== BettaFish 后端连接测试 ===" -ForegroundColor Cyan
Write-Host ""

# 从 wrangler.toml 读取 BACKEND_URL
$backendUrl = "https://publicopinion-production.up.railway.app"
$workersUrl = "https://bettafish-api-prod.keithhe2021.workers.dev"

Write-Host "后端 URL: $backendUrl" -ForegroundColor Yellow
Write-Host "Workers URL: $workersUrl" -ForegroundColor Yellow
Write-Host ""

# 测试 1: 后端健康检查
Write-Host "测试 1: 后端健康检查..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/health" -Method GET -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ 成功: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "响应: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ 失败: $_" -ForegroundColor Red
}
Write-Host ""

# 测试 2: 后端配置端点
Write-Host "测试 2: 后端配置端点..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/api/config" -Method GET -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ 成功: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "响应长度: $($response.Content.Length) 字符" -ForegroundColor Gray
} catch {
    Write-Host "❌ 失败: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "错误详情: $responseBody" -ForegroundColor Red
    }
}
Write-Host ""

# 测试 3: 后端论坛日志
Write-Host "测试 3: 后端论坛日志..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/api/forum/log" -Method GET -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ 成功: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "响应长度: $($response.Content.Length) 字符" -ForegroundColor Gray
} catch {
    Write-Host "❌ 失败: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "错误详情: $responseBody" -ForegroundColor Red
    }
}
Write-Host ""

# 测试 4: Workers 健康检查
Write-Host "测试 4: Workers 健康检查..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$workersUrl/api/health" -Method GET -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ 成功: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "响应: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ 失败: $_" -ForegroundColor Red
}
Write-Host ""

# 测试 5: Workers 配置端点
Write-Host "测试 5: Workers 配置端点..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$workersUrl/api/config" -Method GET -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ 成功: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "响应长度: $($response.Content.Length) 字符" -ForegroundColor Gray
} catch {
    Write-Host "❌ 失败: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "错误详情: $responseBody" -ForegroundColor Red
    }
}
Write-Host ""

# 测试 6: Workers 论坛日志
Write-Host "测试 6: Workers 论坛日志..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$workersUrl/api/forum/log" -Method GET -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ 成功: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "响应长度: $($response.Content.Length) 字符" -ForegroundColor Gray
} catch {
    Write-Host "❌ 失败: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "错误详情: $responseBody" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "=== 测试完成 ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "如果后端测试失败，请检查：" -ForegroundColor Yellow
Write-Host "1. Railway 应用是否正在运行" -ForegroundColor Yellow
Write-Host "2. URL 是否正确" -ForegroundColor Yellow
Write-Host "3. Railway 部署日志中是否有错误" -ForegroundColor Yellow
Write-Host ""
Write-Host "如果 Workers 测试失败，请检查：" -ForegroundColor Yellow
Write-Host "1. BACKEND_URL 环境变量是否正确配置" -ForegroundColor Yellow
Write-Host "2. Workers 日志中的错误信息" -ForegroundColor Yellow
Write-Host "3. 后端是否可以访问" -ForegroundColor Yellow

