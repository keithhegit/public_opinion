# BettaFish Workers API 测试脚本 (PowerShell)

Write-Host "🧪 Testing BettaFish Workers API" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8787"

# 健康检查
Write-Host "1. Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/health" -Method GET -UseBasicParsing
    $response.Content | ConvertFrom-Json | ConvertTo-Json
} catch {
    Write-Host "Failed: $_" -ForegroundColor Red
}
Write-Host ""

# 系统状态
Write-Host "2. System Status..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/status" -Method GET -UseBasicParsing
    $response.Content | ConvertFrom-Json | ConvertTo-Json
} catch {
    Write-Host "Failed: $_" -ForegroundColor Red
}
Write-Host ""

# 获取配置
Write-Host "3. Get Config..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/config" -Method GET -UseBasicParsing
    $response.Content | ConvertFrom-Json | ConvertTo-Json
} catch {
    Write-Host "Failed: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "✅ Tests completed" -ForegroundColor Green

