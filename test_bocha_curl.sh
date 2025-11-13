#!/bin/bash
# Bocha AI Search API 测试脚本 (curl)

API_KEY="sk-f2d544f236214b4fb8d090861176e3dd"
API_URL="https://api.bochaai.com/v1/ai-search"

echo "============================================================"
echo "Bocha AI Search API Test (curl)"
echo "============================================================"
echo "API Endpoint: $API_URL"
echo "API Key: ${API_KEY:0:10}...${API_KEY: -4}"
echo "Test Query: 人工智能对未来教育的影响"
echo "------------------------------------------------------------"
echo ""

# 执行 curl 请求
curl -X POST "$API_URL" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: */*" \
  -d '{
    "query": "人工智能对未来教育的影响",
    "count": 5,
    "answer": true
  }' \
  -w "\n\nHTTP Status: %{http_code}\nTotal Time: %{time_total}s\n" \
  -s | jq '.' 2>/dev/null || cat

echo ""
echo "============================================================"
echo "Test completed!"
echo "============================================================"

