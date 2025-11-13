# PowerShell 版本的 curl 测试脚本
# 设置控制台编码为 UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$apiKey = "sk-f2d544f236214b4fb8d090861176e3dd"
$apiUrl = "https://api.bochaai.com/v1/ai-search"
$testQuery = "人工智能对未来教育的影响"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Bocha AI Search API Test (PowerShell)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "API Endpoint: $apiUrl" -ForegroundColor Yellow
Write-Host "API Key: $($apiKey.Substring(0,10))...$($apiKey.Substring($apiKey.Length-4))" -ForegroundColor Yellow
Write-Host "Test Query: $testQuery" -ForegroundColor Yellow
Write-Host "------------------------------------------------------------" -ForegroundColor Gray
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json; charset=utf-8"
    "Accept" = "*/*"
}

# 使用 UTF-8 编码创建 JSON 请求体
$bodyObj = @{
    query = $testQuery
    count = 5
    answer = $true
}

# 确保 JSON 使用 UTF-8 编码
$body = $bodyObj | ConvertTo-Json -Depth 10 -Compress
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
$body = [System.Text.Encoding]::UTF8.GetString($bodyBytes)

try {
    Write-Host "Sending request..." -ForegroundColor Green
    Write-Host "Request Body (UTF-8):" -ForegroundColor Cyan
    Write-Host $body
    Write-Host ""
    
    $startTime = Get-Date
    
    # 使用 UTF-8 编码发送请求
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -ContentType "application/json; charset=utf-8"
    
    $elapsed = ((Get-Date) - $startTime).TotalSeconds
    Write-Host "Request completed in $([math]::Round($elapsed, 2)) seconds" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    
    if ($response.code -eq 200) {
        Write-Host ""
        Write-Host "[SUCCESS] API call successful!" -ForegroundColor Green
        Write-Host "conversation_id: $($response.conversation_id)" -ForegroundColor Green
        Write-Host "messages count: $($response.messages.Count)" -ForegroundColor Green
    }
    
} catch {
    Write-Host "[ERROR] Request failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Test completed!" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

