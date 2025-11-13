#!/bin/bash
# 修复 Insight Engine 配置脚本
# 在服务器上运行此脚本来添加或更新 Insight Engine 的 GLM 配置

cd /home/bettafish/Public_Opinion/BettaFish-main || exit 1

echo "=========================================="
echo "修复 Insight Engine 配置"
echo "=========================================="
echo ""

# 备份 .env 文件
if [ -f .env ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ 已备份 .env 文件"
fi

# 检查当前配置
echo "当前配置："
grep -E "INSIGHT_ENGINE_(BASE_URL|MODEL_NAME|API_KEY)" .env 2>/dev/null || echo "  未找到 Insight Engine 配置"
echo ""

# 删除可能存在的 Gemini 配置
sed -i '/^INSIGHT_ENGINE_BASE_URL=/d' .env
sed -i '/^INSIGHT_ENGINE_MODEL_NAME=/d' .env

# 添加正确的 GLM 配置
if ! grep -q "^INSIGHT_ENGINE_BASE_URL=" .env; then
    echo "" >> .env
    echo "# Insight Engine 配置（GLM API）" >> .env
    echo "INSIGHT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/" >> .env
    echo "INSIGHT_ENGINE_MODEL_NAME=glm-4.6" >> .env
    echo "✅ 已添加 Insight Engine GLM 配置"
else
    echo "INSIGHT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/" >> .env
    echo "INSIGHT_ENGINE_MODEL_NAME=glm-4.6" >> .env
    echo "✅ 已更新 Insight Engine GLM 配置"
fi

echo ""
echo "更新后的配置："
grep -E "INSIGHT_ENGINE_(BASE_URL|MODEL_NAME|API_KEY)" .env
echo ""

# 验证配置
BASE_URL=$(grep "^INSIGHT_ENGINE_BASE_URL=" .env | cut -d'=' -f2)
MODEL_NAME=$(grep "^INSIGHT_ENGINE_MODEL_NAME=" .env | cut -d'=' -f2)

if [[ "$BASE_URL" == *"api.z.ai"* ]] && [[ "$MODEL_NAME" == *"glm"* ]]; then
    echo "✅ 配置验证通过：使用 GLM API"
else
    echo "⚠️  配置可能不正确，请检查："
    echo "   BASE_URL: $BASE_URL"
    echo "   MODEL_NAME: $MODEL_NAME"
fi

echo ""
echo "=========================================="
echo "下一步：重启服务使配置生效"
echo "sudo systemctl restart bettafish"
echo "=========================================="

