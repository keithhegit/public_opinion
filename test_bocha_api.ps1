# PowerShell script to test Bocha AI Search API

$apiKey = "sk-f2d544f236214b4fb8d090861176e3dd"
$apiUrl = "https://api.bochaai.com/v1/ai-search"

$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
    "Accept" = "*/*"
}

Write-Host "Headers:" -ForegroundColor Cyan
$headers.GetEnumerator() | ForEach-Object {
    if ($_.Key -eq "Authorization") {
        Write-Host "  $($_.Key): Bearer $($apiKey.Substring(0,10))...$($apiKey.Substring($apiKey.Length-4))"
    } else {
        Write-Host "  $($_.Key): $($_.Value)"
    }
}
Write-Host ""

$body = @{
    query = "AI impact on future education"
    count = 5
    answer = $true
} | ConvertTo-Json

Write-Host "============================================================"
Write-Host "Bocha AI Search API Test"
Write-Host "============================================================"
Write-Host "API Endpoint: $apiUrl"
Write-Host "API Key: $($apiKey.Substring(0,10))...$($apiKey.Substring($apiKey.Length-4))"
Write-Host "Test Query: AI impact on future education"
Write-Host "------------------------------------------------------------"
Write-Host ""

try {
    Write-Host "Sending request..."
    $startTime = Get-Date
    
    Write-Host "Request Body:" -ForegroundColor Cyan
    Write-Host $body
    Write-Host ""
    
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $body -ContentType "application/json" -ErrorAction Stop
    
    $elapsed = ((Get-Date) - $startTime).TotalSeconds
    Write-Host "Request time: $([math]::Round($elapsed, 2)) seconds"
    Write-Host ""
    
    # Check response
    if ($response.code -eq 200) {
        Write-Host "[SUCCESS] API call successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "============================================================"
        Write-Host "Response Analysis:"
        Write-Host "============================================================"
        
        $data = $response.data
        
        # conversation_id
        if ($data.conversation_id) {
            Write-Host "[OK] conversation_id: $($data.conversation_id)" -ForegroundColor Green
        } else {
            Write-Host "[WARN] conversation_id: not found" -ForegroundColor Yellow
        }
        
        # answer
        $answer = $data.answer
        if (-not $answer -and $data.messages) {
            foreach ($msg in $data.messages) {
                if ($msg.answer) {
                    $answer = $msg.answer
                    break
                }
            }
        }
        
        if ($answer) {
            Write-Host "[OK] answer (AI Summary):" -ForegroundColor Green
            $answerPreview = if ($answer.Length -gt 200) { $answer.Substring(0, 200) + "..." } else { $answer }
            Write-Host $answerPreview
        } else {
            Write-Host "[WARN] answer: not found" -ForegroundColor Yellow
        }
        
        # follow_ups
        $followUps = $data.follow_ups
        if (-not $followUps -and $data.messages) {
            foreach ($msg in $data.messages) {
                if ($msg.follow_ups) {
                    $followUps = $msg.follow_ups
                    break
                }
            }
        }
        
        if ($followUps) {
            Write-Host "[OK] follow_ups (Suggested Questions):" -ForegroundColor Green
            $count = 0
            foreach ($fu in $followUps) {
                $count++
                if ($count -le 3) {
                    Write-Host "  $count. $fu"
                }
            }
        } else {
            Write-Host "[WARN] follow_ups: not found" -ForegroundColor Yellow
        }
        
        # webPages
        $webPages = $data.webPages
        if ($webPages.value) {
            $webResults = $webPages.value
        } elseif ($webPages -is [Array]) {
            $webResults = $webPages
        } else {
            $webResults = @()
        }
        
        Write-Host "[OK] webPages: $($webResults.Count) results" -ForegroundColor Green
        if ($webResults.Count -gt 0) {
            $firstResult = $webResults[0]
            $namePreview = if ($firstResult.name.Length -gt 50) { $firstResult.name.Substring(0, 50) + "..." } else { $firstResult.name }
            Write-Host "  First: $namePreview"
        }
        
        # images
        $images = $data.images
        if ($images.value) {
            $imageResults = $images.value
        } elseif ($images -is [Array]) {
            $imageResults = $images
        } else {
            $imageResults = @()
        }
        
        Write-Host "[OK] images: $($imageResults.Count) results" -ForegroundColor Green
        
        # modal_cards
        $modalCards = $data.modalCards
        if (-not $modalCards) {
            $modalCards = $data.modal_cards
        }
        if (-not $modalCards) {
            $modalCards = @()
        }
        
        if ($modalCards.Count -gt 0) {
            Write-Host "[OK] modal_cards: $($modalCards.Count) results" -ForegroundColor Green
        } else {
            Write-Host "[WARN] modal_cards: not found" -ForegroundColor Yellow
        }
        
        # videos
        $videos = $data.videos
        if ($videos.value) {
            $videoResults = $videos.value
        } elseif ($videos -is [Array]) {
            $videoResults = $videos
        } else {
            $videoResults = @()
        }
        
        if ($videoResults.Count -gt 0) {
            Write-Host "[OK] videos: $($videoResults.Count) results" -ForegroundColor Green
        } else {
            Write-Host "[WARN] videos: not found" -ForegroundColor Yellow
        }
        
        Write-Host ""
        Write-Host "============================================================"
        Write-Host "[SUCCESS] Test passed! Bocha AI Search API is working" -ForegroundColor Green
        Write-Host "============================================================"
        
        # Show full response
        Write-Host ""
        Write-Host "Full Response (JSON):"
        $response | ConvertTo-Json -Depth 10
        
    } else {
        Write-Host "[ERROR] API returned error:" -ForegroundColor Red
        Write-Host "code: $($response.code)" -ForegroundColor Red
        Write-Host "msg: $($response.msg)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "[ERROR] Request failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "HTTP Status Code: $statusCode" -ForegroundColor Red
        
        if ($statusCode -eq 401) {
            Write-Host ""
            Write-Host "401 Unauthorized - Possible causes:" -ForegroundColor Yellow
            Write-Host "1. API Key is incorrect or expired" -ForegroundColor Yellow
            Write-Host "2. API Key format is wrong (should be: Bearer <key>)" -ForegroundColor Yellow
            Write-Host "3. API Key doesn't have access to AI Search API" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Please check:" -ForegroundColor Yellow
            Write-Host "- API Key: $($apiKey.Substring(0,10))...$($apiKey.Substring($apiKey.Length-4))" -ForegroundColor Yellow
            Write-Host "- Make sure the key is for AI Search API, not Web Search API" -ForegroundColor Yellow
        }
        
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            if ($responseBody) {
                Write-Host "Response body: $responseBody" -ForegroundColor Red
            }
        } catch {
            Write-Host "Could not read response body" -ForegroundColor Red
        }
    }
}
