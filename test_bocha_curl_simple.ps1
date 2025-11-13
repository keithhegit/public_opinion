# PowerShell 版本的 curl 测试脚本（简化版，确保 UTF-8 编码）
# 注意：请确保此文件以 UTF-8 编码保存

# 设置 UTF-8 编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'
chcp 65001 | Out-Null

$apiKey = "sk-f2d544f236214b4fb8d090861176e3dd"
$apiUrl = "https://api.bochaai.com/v1/ai-search"
# 使用 Unicode 转义序列确保中文字符正确编码
$testQuery = [System.Text.Encoding]::UTF8.GetString([System.Text.Encoding]::UTF8.GetBytes("人工智能对未来教育的影响"))

Write-Host "============================================================"
Write-Host "Bocha AI Search API Test (PowerShell)"
Write-Host "============================================================"
Write-Host "API Endpoint: $apiUrl"
Write-Host "API Key: $($apiKey.Substring(0,10))...$($apiKey.Substring($apiKey.Length-4))"
Write-Host "Test Query: $testQuery"
Write-Host "------------------------------------------------------------"
Write-Host ""

# 使用 UTF-8 编码构建 JSON
$queryBytes = [System.Text.Encoding]::UTF8.GetBytes("人工智能对未来教育的影响")
$queryUtf8 = [System.Text.Encoding]::UTF8.GetString($queryBytes)

# 手动构建 JSON 字符串，使用 UTF-8 编码的查询
$jsonBody = "{`"query`":`"$queryUtf8`",`"count`":5,`"answer`":true}"

$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json; charset=utf-8"
    "Accept" = "*/*"
}

try {
    Write-Host "Sending request..."
    Write-Host "Request Body:"
    Write-Host $jsonBody
    Write-Host ""
    
    $startTime = Get-Date
    
    # 使用 UTF-8 编码发送请求体
    $utf8Bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonBody)
    
    # 创建请求
    $request = [System.Net.HttpWebRequest]::Create($apiUrl)
    $request.Method = "POST"
    $request.ContentType = "application/json; charset=utf-8"
    $request.Headers.Add("Authorization", "Bearer $apiKey")
    $request.Headers.Add("Accept", "*/*")
    
    # 写入 UTF-8 编码的请求体
    $requestStream = $request.GetRequestStream()
    $requestStream.Write($utf8Bytes, 0, $utf8Bytes.Length)
    $requestStream.Close()
    
    # 获取响应
    $responseStream = $request.GetResponse().GetResponseStream()
    $reader = New-Object System.IO.StreamReader($responseStream, [System.Text.Encoding]::UTF8)
    $responseJson = $reader.ReadToEnd()
    $reader.Close()
    $responseStream.Close()
    
    # 解析 JSON 响应
    $response = $responseJson | ConvertFrom-Json
    
    $elapsed = ((Get-Date) - $startTime).TotalSeconds
    Write-Host "Request completed in $([math]::Round($elapsed, 2)) seconds"
    Write-Host ""
    
    Write-Host "Response:"
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
Write-Host "============================================================"
Write-Host "Test completed!"
Write-Host "============================================================"

