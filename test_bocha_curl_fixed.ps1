# PowerShell 版本的 curl 测试脚本（修复 UTF-8 编码问题）
# 请确保此文件以 UTF-8 with BOM 编码保存

# 设置 UTF-8 编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

$apiKey = "sk-f2d544f236214b4fb8d090861176e3dd"
$apiUrl = "https://api.bochaai.com/v1/ai-search"

# 直接使用中文字符串（确保脚本文件是 UTF-8 编码）
$testQuery = "人工智能对未来教育的影响"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Bocha AI Search API Test (PowerShell - Fixed UTF-8)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "API Endpoint: $apiUrl" -ForegroundColor Yellow
Write-Host "API Key: $($apiKey.Substring(0,10))...$($apiKey.Substring($apiKey.Length-4))" -ForegroundColor Yellow
Write-Host "Test Query: $testQuery" -ForegroundColor Yellow
Write-Host "------------------------------------------------------------" -ForegroundColor Gray
Write-Host ""

# 使用 .NET 方法确保 UTF-8 编码
$queryBytes = [System.Text.Encoding]::UTF8.GetBytes($testQuery)
$queryBase64 = [Convert]::ToBase64String($queryBytes)
$queryDecoded = [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($queryBase64))

# 构建 JSON（使用 UTF-8 编码）
$jsonDict = @{
    query = $queryDecoded
    count = 5
    answer = $true
}

# 转换为 JSON 并确保 UTF-8 编码
$jsonString = $jsonDict | ConvertTo-Json -Compress
$jsonBytes = [System.Text.Encoding]::UTF8.GetBytes($jsonString)

Write-Host "Request Body (UTF-8):" -ForegroundColor Cyan
Write-Host $jsonString
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json; charset=utf-8"
    "Accept" = "*/*"
}

try {
    Write-Host "Sending request..." -ForegroundColor Green
    $startTime = Get-Date
    
    # 使用 WebRequest 确保 UTF-8 编码
    $request = [System.Net.HttpWebRequest]::Create($apiUrl)
    $request.Method = "POST"
    $request.ContentType = "application/json; charset=utf-8"
    $request.Accept = "*/*"
    $request.Headers.Add("Authorization", "Bearer $apiKey")
    $request.ContentLength = $jsonBytes.Length
    
    # 写入请求体
    $requestStream = $request.GetRequestStream()
    $requestStream.Write($jsonBytes, 0, $jsonBytes.Length)
    $requestStream.Close()
    
    # 获取响应
    try {
        $httpResponse = $request.GetResponse()
        $responseStream = $httpResponse.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($responseStream, [System.Text.Encoding]::UTF8)
        $responseJson = $reader.ReadToEnd()
        $reader.Close()
        $responseStream.Close()
        $httpResponse.Close()
        
        # 解析 JSON
        $response = $responseJson | ConvertFrom-Json
        
    } catch [System.Net.WebException] {
        $errorResponse = $_.Exception.Response
        $errorStream = $errorResponse.GetResponseStream()
        $errorReader = New-Object System.IO.StreamReader($errorStream, [System.Text.Encoding]::UTF8)
        $errorBody = $errorReader.ReadToEnd()
        $errorReader.Close()
        $errorStream.Close()
        throw "HTTP Error: $($errorResponse.StatusCode) - $errorBody"
    }
    
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
                    if ($webpageData.value.Count -gt 0) {
                        Write-Host "  First: $($webpageData.value[0].name)" -ForegroundColor White
                    }
                }
            } catch {
                Write-Host "  Could not parse webpage data"
            }
        }
    }
    
} catch {
    Write-Host "[ERROR] Request failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "HTTP Status Code: $statusCode" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Test completed!" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

