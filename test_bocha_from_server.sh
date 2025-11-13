#!/bin/bash
# 从服务器内部测试 Bocha API 配置

echo "============================================================"
echo "Bocha API 配置诊断"
echo "============================================================"
echo ""

echo "1. 检查 .env 文件..."
if [ -f "/home/bettafish/Public_Opinion/BettaFish-main/.env" ]; then
    echo "   ✅ .env 文件存在"
    API_KEY=$(sudo grep "BOCHA_WEB_SEARCH_API_KEY" /home/bettafish/Public_Opinion/BettaFish-main/.env | cut -d'=' -f2)
    if [ -n "$API_KEY" ]; then
        echo "   ✅ API Key 已设置: ${API_KEY:0:10}...${API_KEY: -4}"
    else
        echo "   ❌ API Key 未找到"
    fi
else
    echo "   ❌ .env 文件不存在"
fi

echo ""
echo "2. 检查 systemd 服务配置..."
ENV_FILE=$(sudo systemctl show bettafish | grep EnvironmentFile | cut -d'=' -f2)
if [ -n "$ENV_FILE" ]; then
    echo "   ✅ EnvironmentFile: $ENV_FILE"
else
    echo "   ❌ EnvironmentFile 未配置"
fi

echo ""
echo "3. 检查服务状态..."
sudo systemctl is-active bettafish > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ 服务运行中"
    echo "   服务启动时间: $(sudo systemctl show bettafish -p ActiveEnterTimestamp --value)"
else
    echo "   ❌ 服务未运行"
fi

echo ""
echo "4. 检查重启后的日志（最后20行）..."
echo "   查找 Bocha API 相关日志..."
sudo journalctl -u bettafish --since "2025-11-13 15:23:00" 2>/dev/null | grep -i "bocha\|api.*key" | tail -5 || echo "   未找到相关日志"

echo ""
echo "5. 测试 Bocha API 连接..."
RESPONSE=$(curl -s -X POST https://api.bochaai.com/v1/ai-search \
  -H "Authorization: Bearer sk-f2d544f236214b4fb8d090861176e3dd" \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "count": 1, "answer": true}')

CODE=$(echo "$RESPONSE" | grep -o '"code":[0-9]*' | cut -d':' -f2)
if [ "$CODE" = "200" ]; then
    echo "   ✅ API 调用成功 (code: $CODE)"
else
    echo "   ❌ API 调用失败 (code: $CODE)"
    echo "   响应: $RESPONSE" | head -3
fi

echo ""
echo "============================================================"
echo "诊断完成"
echo "============================================================"

