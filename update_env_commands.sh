#!/bin/bash
# 更新 BettaFish-main/.env 文件中的 Bocha API Key

ENV_FILE="BettaFish-main/.env"
API_KEY="sk-f2d544f236214b4fb8d090861176e3dd"

echo "============================================================"
echo "更新 .env 文件中的 Bocha API Key"
echo "============================================================"

# 检查 .env 文件是否存在
if [ ! -f "$ENV_FILE" ]; then
    echo "[INFO] .env 文件不存在，正在创建..."
    mkdir -p BettaFish-main
    touch "$ENV_FILE"
    echo "# BettaFish 环境变量配置" >> "$ENV_FILE"
    echo "BOCHA_WEB_SEARCH_API_KEY=$API_KEY" >> "$ENV_FILE"
    echo "[SUCCESS] .env 文件已创建并添加 API Key"
else
    echo "[INFO] .env 文件已存在，正在更新..."
    
    # 检查是否已存在 BOCHA_WEB_SEARCH_API_KEY
    if grep -q "^BOCHA_WEB_SEARCH_API_KEY=" "$ENV_FILE"; then
        # 更新现有的 API Key
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|^BOCHA_WEB_SEARCH_API_KEY=.*|BOCHA_WEB_SEARCH_API_KEY=$API_KEY|" "$ENV_FILE"
        else
            # Linux
            sed -i "s|^BOCHA_WEB_SEARCH_API_KEY=.*|BOCHA_WEB_SEARCH_API_KEY=$API_KEY|" "$ENV_FILE"
        fi
        echo "[SUCCESS] 已更新 BOCHA_WEB_SEARCH_API_KEY"
    elif grep -q "^BOCHA_API_KEY=" "$ENV_FILE"; then
        # 更新 BOCHA_API_KEY（如果存在）
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|^BOCHA_API_KEY=.*|BOCHA_API_KEY=$API_KEY|" "$ENV_FILE"
        else
            sed -i "s|^BOCHA_API_KEY=.*|BOCHA_API_KEY=$API_KEY|" "$ENV_FILE"
        fi
        echo "[SUCCESS] 已更新 BOCHA_API_KEY"
    else
        # 添加新的 API Key
        echo "BOCHA_WEB_SEARCH_API_KEY=$API_KEY" >> "$ENV_FILE"
        echo "[SUCCESS] 已添加 BOCHA_WEB_SEARCH_API_KEY"
    fi
fi

echo ""
echo "============================================================"
echo "验证更新结果"
echo "============================================================"
grep -E "^(BOCHA_WEB_SEARCH_API_KEY|BOCHA_API_KEY)=" "$ENV_FILE" || echo "[WARN] 未找到 Bocha API Key 配置"

echo ""
echo "============================================================"
echo "更新完成！"
echo "============================================================"

