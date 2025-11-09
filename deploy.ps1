# BettaFish 部署脚本

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("dev", "prod", "all")]
    [string]$Environment = "all"
)

Write-Host "🚀 BettaFish Deployment Script" -ForegroundColor Cyan
Write-Host ""

# 检查wrangler
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
try {
    $wranglerVersion = wrangler --version
    Write-Host "✅ Wrangler installed: $wranglerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Wrangler not found. Installing..." -ForegroundColor Red
    npm install -g wrangler
}

Write-Host ""

# 部署Workers API
if ($Environment -eq "all" -or $Environment -eq "dev" -or $Environment -eq "prod") {
    Write-Host "🔧 Deploying Workers API..." -ForegroundColor Yellow
    Set-Location bettafish-workers
    
    if ($Environment -eq "dev" -or $Environment -eq "all") {
        Write-Host "  → Deploying to development..." -ForegroundColor Cyan
        npm run deploy:dev
    }
    
    if ($Environment -eq "prod" -or $Environment -eq "all") {
        Write-Host "  → Deploying to production..." -ForegroundColor Cyan
        npm run deploy
    }
    
    Set-Location ..
    Write-Host "✅ Workers API deployed" -ForegroundColor Green
    Write-Host ""
}

# 部署前端
if ($Environment -eq "all" -or $Environment -eq "prod") {
    Write-Host "🎨 Deploying Frontend..." -ForegroundColor Yellow
    Set-Location bettafish-frontend
    
    # 检查Pages适配器
    if (-not (Test-Path "node_modules\@cloudflare\next-on-pages")) {
        Write-Host "  → Installing Pages adapter..." -ForegroundColor Cyan
        npm install @cloudflare/next-on-pages --save-dev
    }
    
    # 构建
    Write-Host "  → Building..." -ForegroundColor Cyan
    npm run build
    
    # 适配Pages
    Write-Host "  → Adapting for Pages..." -ForegroundColor Cyan
    npx @cloudflare/next-on-pages
    
    # 部署
    Write-Host "  → Deploying to Pages..." -ForegroundColor Cyan
    wrangler pages deploy .vercel/output/static
    
    Set-Location ..
    Write-Host "✅ Frontend deployed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Deployment completed!" -ForegroundColor Green

