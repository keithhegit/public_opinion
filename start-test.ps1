# BettaFish 测试启动脚本

Write-Host "🚀 Starting BettaFish Test Environment" -ForegroundColor Cyan
Write-Host ""

# 检查依赖
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow

if (-not (Test-Path "bettafish-workers\node_modules")) {
    Write-Host "Installing Workers dependencies..." -ForegroundColor Yellow
    Set-Location bettafish-workers
    npm install
    Set-Location ..
}

if (-not (Test-Path "bettafish-frontend\node_modules")) {
    Write-Host "Installing Frontend dependencies..." -ForegroundColor Yellow
    Set-Location bettafish-frontend
    npm install
    Set-Location ..
}

Write-Host "✅ Dependencies ready" -ForegroundColor Green
Write-Host ""

# 启动Workers API
Write-Host "🔧 Starting Workers API..." -ForegroundColor Yellow
Write-Host "  → Opening new window..." -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\bettafish-workers'; Write-Host 'Starting Workers API...' -ForegroundColor Cyan; npm run dev" -WindowStyle Normal

# 等待5秒让Workers API启动
Write-Host "  → Waiting for Workers API to start..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# 启动前端
Write-Host "🎨 Starting Frontend..." -ForegroundColor Yellow
Write-Host "  → Opening new window..." -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\bettafish-frontend'; Write-Host 'Starting Frontend...' -ForegroundColor Cyan; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Services starting..." -ForegroundColor Green
Write-Host ""
Write-Host "📊 Service URLs:" -ForegroundColor Cyan
Write-Host "  Workers API: http://localhost:8787" -ForegroundColor White
Write-Host "  Frontend:    http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "🧪 Test endpoints:" -ForegroundColor Cyan
Write-Host "  Health:      http://localhost:8787/api/health" -ForegroundColor White
Write-Host "  Status:      http://localhost:8787/api/status" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

