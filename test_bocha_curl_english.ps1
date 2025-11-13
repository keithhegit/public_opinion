# PowerShell 测试脚本（使用英文查询，避免编码问题）

$apiKey = "sk-f2d544f236214b4fb8d090861176e3dd"
$apiUrl = "https://api.bochaai.com/v1/ai-search"

# 使用英文查询避免 PowerShell 编码问题
$testQuery = "AI impact on future education"

Write-Host "============================================================"
Write-Host "Bocha AI Search API Test (PowerShell - English Query)"
Write-Host "============================================================"
Write-Host "API Endpoint: $apiUrl"
Write-Host "API Key: $($apiKey.Substring(0,10))...$($apiKey.Substring($apiKey.Length-4))"
Write-Host "Test Query: $testQuery"
Write-Host "------------------------------------------------------------"
Write-Host ""

$bodyObj = @{
    query = $testQuery
    count = 5
    answer = $true
}

$jsonBody = $bodyObj | ConvertTo-Json -Compress

Write-Host "Request Body:"
Write-Host $jsonBody
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json; charset=utf-8"
}

try {
    Write-Host "Sending request..." -ForegroundColor Green
    $startTime = Get-Date
    
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $jsonBody -ContentType "application/json; charset=utf-8"
    
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
        
        # 检查 answer
        $answerMsg = $response.messages | Where-Object { $_.type -eq "answer" } | Select-Object -First 1
        if ($answerMsg) {
            Write-Host ""
            Write-Host "Answer (AI Summary):" -ForegroundColor Cyan
            Write-Host $answerMsg.content
        }
        
        # 检查 follow_ups
        $followUpMsg = $response.messages | Where-Object { $_.type -eq "follow_up" } | Select-Object -First 1
        if ($followUpMsg) {
            Write-Host ""
            Write-Host "Follow-ups:" -ForegroundColor Cyan
            try {
                $followUps = $followUpMsg.content | ConvertFrom-Json
                foreach ($fu in $followUps) {
                    Write-Host "  - $fu"
                }
            } catch {
                Write-Host "  $($followUpMsg.content)"
            }
        }
        
        # 检查网页结果
        $webpageMsg = $response.messages | Where-Object { $_.type -eq "source" -and $_.content_type -eq "webpage" } | Select-Object -First 1
        if ($webpageMsg) {
            try {
                $webpageData = $webpageMsg.content | ConvertFrom-Json
                if ($webpageData.value) {
                    Write-Host ""
                    Write-Host "Web Pages: $($webpageData.value.Count) results" -ForegroundColor Cyan
                }
            } catch {
                Write-Host "  Could not parse webpage data"
            }
        }
    }
    
} catch {
    Write-Host "[ERROR] Request failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================================"
Write-Host "Test completed!"
Write-Host "============================================================"

