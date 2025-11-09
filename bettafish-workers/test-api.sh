#!/bin/bash
# BettaFish Workers API 测试脚本

echo "🧪 Testing BettaFish Workers API"
echo ""

BASE_URL="http://localhost:8787"

# 健康检查
echo "1. Health Check..."
curl -s "$BASE_URL/api/health" | jq '.' || echo "Failed"
echo ""

# 系统状态
echo "2. System Status..."
curl -s "$BASE_URL/api/status" | jq '.' || echo "Failed"
echo ""

# 获取配置
echo "3. Get Config..."
curl -s "$BASE_URL/api/config" | jq '.' || echo "Failed"
echo ""

echo "✅ Tests completed"

