# 上传部署脚本到远程主机
# 在本地Windows PowerShell中执行

$remoteHost = "14.136.93.109"
$remoteUser = "ubuntu"
$scriptPath = "BettaFish-main\deploy-hk-ubuntu.sh"
$remotePath = "/tmp/deploy-hk-ubuntu.sh"

Write-Host "正在上传脚本到远程主机..." -ForegroundColor Green
Write-Host "源文件: $scriptPath" -ForegroundColor Cyan
Write-Host "目标: ${remoteUser}@${remoteHost}:${remotePath}" -ForegroundColor Cyan
Write-Host ""

# 检查文件是否存在
if (-not (Test-Path $scriptPath)) {
    Write-Host "错误: 脚本文件不存在: $scriptPath" -ForegroundColor Red
    Write-Host "请确保在项目根目录执行此脚本" -ForegroundColor Yellow
    exit 1
}

# 使用scp上传
scp $scriptPath "${remoteUser}@${remoteHost}:${remotePath}"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "上传成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步: SSH连接到主机并执行:" -ForegroundColor Yellow
    Write-Host "  ssh ${remoteUser}@${remoteHost}" -ForegroundColor Cyan
    Write-Host "  sudo bash ${remotePath}" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "上传失败，请检查:" -ForegroundColor Red
    Write-Host "  1. SSH连接是否正常" -ForegroundColor Yellow
    Write-Host "  2. 文件路径是否正确" -ForegroundColor Yellow
    Write-Host "  3. 是否有写入权限" -ForegroundColor Yellow
}

