# Bocha API curl 测试命令

## 方法 1: 直接使用 curl（Linux/Mac/Git Bash）

```bash
curl -X POST https://api.bochaai.com/v1/ai-search \
  -H "Authorization: Bearer sk-f2d544f236214b4fb8d090861176e3dd" \
  -H "Content-Type: application/json" \
  -H "Accept: */*" \
  -d '{
    "query": "人工智能对未来教育的影响",
    "count": 5,
    "answer": true
  }'
```

## 方法 2: 使用测试脚本（推荐）

### Linux/Mac/Git Bash:
```bash
chmod +x test_bocha_curl.sh
./test_bocha_curl.sh
```

### Windows PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File test_bocha_curl.ps1
```

## 方法 3: 一行命令（Windows PowerShell）

```powershell
$headers = @{"Authorization"="Bearer sk-f2d544f236214b4fb8d090861176e3dd"; "Content-Type"="application/json"}; $body = '{"query": "人工智能对未来教育的影响", "count": 5, "answer": true}' | ConvertTo-Json; Invoke-RestMethod -Uri "https://api.bochaai.com/v1/ai-search" -Method Post -Headers $headers -Body $body | ConvertTo-Json -Depth 10
```

## 预期响应

如果成功，应该返回：
- `code: 200`
- `conversation_id`: 会话ID
- `messages`: 包含 answer、follow_ups、webpages、images 等

