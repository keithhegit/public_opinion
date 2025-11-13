# 修复 Insight Engine 配置问题

## 🔍 问题诊断

从服务器检查结果看：
1. `.env` 文件中**没有** `INSIGHT_ENGINE_BASE_URL` 和 `INSIGHT_ENGINE_MODEL_NAME` 配置
2. 这导致 Insight Engine 使用了默认值或从其他地方读取的 Gemini 配置

## ✅ 解决方案

### 方法 1: 直接在服务器上编辑 .env 文件

在服务器上执行以下命令：

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main
nano .env
```

在 `.env` 文件中添加或修改以下配置：

```env
# Insight Engine 配置（GLM API）
INSIGHT_ENGINE_API_KEY=d21f186794bc4232ac09f1cfdb7b92e6.2fLNtg6XZNm2JMDw
INSIGHT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
INSIGHT_ENGINE_MODEL_NAME=glm-4.6
```

**重要**：
- 如果文件中已经有 `INSIGHT_ENGINE_BASE_URL` 或 `INSIGHT_ENGINE_MODEL_NAME`，但值是 Gemini 的，需要修改它们
- 如果文件中没有这些配置，需要添加它们

### 方法 2: 使用 sed 命令快速添加（如果配置不存在）

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main

# 检查是否已有配置
if ! grep -q "INSIGHT_ENGINE_BASE_URL" .env; then
    echo "" >> .env
    echo "# Insight Engine 配置（GLM API）" >> .env
    echo "INSIGHT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/" >> .env
fi

if ! grep -q "INSIGHT_ENGINE_MODEL_NAME" .env; then
    echo "INSIGHT_ENGINE_MODEL_NAME=glm-4.6" >> .env
fi

# 如果已有配置但值是 Gemini 的，需要替换
sed -i 's|INSIGHT_ENGINE_BASE_URL=.*|INSIGHT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/|g' .env
sed -i 's|INSIGHT_ENGINE_MODEL_NAME=.*|INSIGHT_ENGINE_MODEL_NAME=glm-4.6|g' .env
```

### 方法 3: 使用 echo 命令追加（最简单）

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main

# 先删除可能存在的 Gemini 配置
sed -i '/INSIGHT_ENGINE_BASE_URL/d' .env
sed -i '/INSIGHT_ENGINE_MODEL_NAME/d' .env

# 添加正确的 GLM 配置
echo "" >> .env
echo "# Insight Engine 配置（GLM API）" >> .env
echo "INSIGHT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/" >> .env
echo "INSIGHT_ENGINE_MODEL_NAME=glm-4.6" >> .env
```

## 🔍 验证配置

更新配置后，验证是否正确：

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main
cat .env | grep -E "INSIGHT_ENGINE_(BASE_URL|MODEL_NAME|API_KEY)"
```

**应该看到**：
```
INSIGHT_ENGINE_API_KEY=d21f186794bc4232ac09f1cfdb7b92e6.2fLNtg6XZNm2JMDw
INSIGHT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
INSIGHT_ENGINE_MODEL_NAME=glm-4.6
```

**不应该看到**：
- `INSIGHT_ENGINE_BASE_URL=https://generativelanguage.googleapis.com/...` (Gemini URL)
- `INSIGHT_ENGINE_MODEL_NAME=gemini-2.5-pro` (Gemini 模型)

## 🔄 重启服务

配置更新后，重启服务使配置生效：

```bash
sudo systemctl restart bettafish
```

## 🧪 验证修复

重启服务后，检查日志：

```bash
sudo journalctl -u bettafish -n 50 | grep -i insight
```

应该看到：
```
使用LLM: {'provider': 'openai-compatible', 'model': 'glm-4.6', 'api_base': 'https://api.z.ai/api/paas/v4/'}
```

而不是：
```
使用LLM: {'provider': 'gemini', 'model': 'gemini-2.5-pro', 'api_base': 'https://generativelanguage.googleapis.com/v1beta/openai/'}
```

## 📝 完整操作步骤

```bash
# 1. 进入项目目录
cd /home/bettafish/Public_Opinion/BettaFish-main

# 2. 备份 .env 文件（可选但推荐）
cp .env .env.backup

# 3. 删除可能存在的 Gemini 配置
sed -i '/INSIGHT_ENGINE_BASE_URL/d' .env
sed -i '/INSIGHT_ENGINE_MODEL_NAME/d' .env

# 4. 添加正确的 GLM 配置
echo "" >> .env
echo "# Insight Engine 配置（GLM API）" >> .env
echo "INSIGHT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/" >> .env
echo "INSIGHT_ENGINE_MODEL_NAME=glm-4.6" >> .env

# 5. 验证配置
cat .env | grep -E "INSIGHT_ENGINE_(BASE_URL|MODEL_NAME|API_KEY)"

# 6. 重启服务
sudo systemctl restart bettafish

# 7. 检查服务状态
sudo systemctl status bettafish

# 8. 查看日志验证
sudo journalctl -u bettafish -n 100 | grep -i "使用LLM"
```

