# Engine 日志全面诊断报告

## 📊 问题总结

### 1. Insight Engine ❌
**错误**: `IndentationError: expected an indented block after 'try' statement on line 66`

**状态**: ✅ 代码已修复，但服务器未更新

**原因**: 服务器上的代码还是旧版本，缺少缩进修复

---

### 2. Query Engine ❌
**错误**: `ValidationError: QUERY_ENGINE_MODEL_NAME Field required`

**状态**: ✅ 代码已修复（添加了默认值），但服务器未更新

**原因**: 
- 服务器上的代码还是旧版本
- 环境变量中可能也没有设置 `QUERY_ENGINE_MODEL_NAME`

---

### 3. Media Engine ⚠️
**错误 1**: `User location is not supported for the API use.` (Gemini API 区域限制)

**错误 2**: `401 Client Error` (Bocha API 认证失败)

**状态**: ⚠️ 部分问题

**原因**:
- **还在使用 Gemini API**: 日志显示 `'model': 'gemini-2.5-pro', 'api_base': 'https://generativelanguage.googleapis.com/v1beta/openai/'`
- **Bocha API Key 无效**: 401 错误表示认证失败

**影响**:
- Gemini API 区域限制导致无法使用
- Bocha API 失败后，系统返回默认值继续运行（这是设计的行为）

---

### 4. Report Engine ⚠️
**状态**: ⚠️ 部分问题

**问题**: 还在使用 Gemini API
- 日志显示: `'model': 'gemini-2.5-pro', 'api_base': 'https://generativelanguage.googleapis.com/v1beta/openai/'`

**原因**: 环境变量中还在使用 Gemini API Key

---

## 🔧 完整修复方案

### 步骤 1: 更新代码（修复代码错误）

在服务器上执行：

```bash
# 1. 停止服务
sudo systemctl stop bettafish

# 2. 拉取最新代码
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && git pull"

# 3. 验证修复
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && head -n 80 InsightEngine/utils/db.py | tail -n 20"
# 应该看到正确的缩进

sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && grep 'QUERY_ENGINE_MODEL_NAME.*Field' QueryEngine/utils/config.py"
# 应该看到: QUERY_ENGINE_MODEL_NAME: str = Field("glm-4.6", ...)
```

---

### 步骤 2: 更新环境变量（迁移到 GLM）

编辑 `.env` 文件：

```bash
sudo nano /home/bettafish/Public_Opinion/BettaFish-main/.env
```

**更新所有 Gemini API Keys 为 GLM API Keys**：

```env
# ============================================
# 旧配置（Gemini - 需要替换）
# ============================================
# INSIGHT_ENGINE_API_KEY=AIzaSy... (Gemini Key)
# MEDIA_ENGINE_API_KEY=AIzaSy... (Gemini Key)
# QUERY_ENGINE_API_KEY=AIzaSy... (Gemini Key)
# REPORT_ENGINE_API_KEY=AIzaSy... (Gemini Key)

# ============================================
# 新配置（GLM - 替换为你的 GLM API Keys）
# ============================================
INSIGHT_ENGINE_API_KEY=你的GLM_API_Key
INSIGHT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
INSIGHT_ENGINE_MODEL_NAME=glm-4.6

MEDIA_ENGINE_API_KEY=你的GLM_API_Key
MEDIA_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
MEDIA_ENGINE_MODEL_NAME=glm-4.6

QUERY_ENGINE_API_KEY=你的GLM_API_Key
QUERY_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
QUERY_ENGINE_MODEL_NAME=glm-4.6

REPORT_ENGINE_API_KEY=你的GLM_API_Key
REPORT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
REPORT_ENGINE_MODEL_NAME=glm-4.6

# ============================================
# Bocha API（如果无效，可以暂时注释掉）
# ============================================
BOCHA_WEB_SEARCH_API_KEY=你的Bocha_API_Key（如果无效，Media Engine 会禁用多模态搜索，但不影响其他功能）
```

**注意**:
- 如果所有 Engine 使用同一个 GLM API Key，可以只设置一次
- `BASE_URL` 和 `MODEL_NAME` 有默认值，可以省略
- 如果 Bocha API Key 无效，Media Engine 的多模态搜索会被禁用，但其他功能正常

---

### 步骤 3: 重启服务

```bash
# 重启服务
sudo systemctl start bettafish

# 检查状态
sudo systemctl status bettafish

# 查看日志
sudo journalctl -u bettafish -f
```

---

## 📋 问题优先级

### 🔴 高优先级（阻塞功能）

1. **Insight Engine 缩进错误** - 导致无法启动
   - ✅ 已修复，需要更新代码

2. **Query Engine 配置缺失** - 导致无法启动
   - ✅ 已修复，需要更新代码

3. **Gemini API 区域限制** - 导致 Media/Report Engine 无法使用
   - ✅ 需要更新环境变量为 GLM

### 🟡 中优先级（功能降级）

4. **Bocha API 401 错误** - Media Engine 多模态搜索被禁用
   - ⚠️ 不影响核心功能，但搜索能力受限
   - 可以暂时忽略，或更新有效的 Bocha API Key

---

## 🧪 验证修复

### 检查代码更新

```bash
# 检查 Insight Engine 修复
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && python3 -c 'import ast; ast.parse(open(\"InsightEngine/utils/db.py\").read())' && echo '语法检查通过'"

# 检查 Query Engine 配置
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && python3 -c 'from QueryEngine.utils.config import settings; print(f\"Model: {settings.QUERY_ENGINE_MODEL_NAME}\")'"
```

### 检查环境变量

```bash
# 检查 GLM 配置
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && grep -E 'GLM|glm-4.6' .env"

# 检查是否还有 Gemini
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && grep -i gemini .env"
```

### 测试 Engine 启动

在前端测试：
1. 停止所有 Engine
2. 重新启动所有 Engine
3. 检查日志是否还有错误

---

## 📝 预期结果

修复后应该看到：

### Insight Engine
- ✅ 没有缩进错误
- ✅ 可以正常启动
- ✅ 使用 GLM API

### Query Engine
- ✅ 没有配置验证错误
- ✅ 可以正常启动
- ✅ 使用 GLM API

### Media Engine
- ✅ 使用 GLM API（不再有区域限制错误）
- ⚠️ Bocha API 可能仍然 401（如果 Key 无效，但不影响其他功能）

### Report Engine
- ✅ 使用 GLM API
- ✅ 可以正常生成报告

---

## 🚀 立即执行

在服务器上按顺序执行：

```bash
# 1. 停止服务
sudo systemctl stop bettafish

# 2. 更新代码
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && git pull"

# 3. 编辑环境变量（替换 Gemini Keys 为 GLM Keys）
sudo nano /home/bettafish/Public_Opinion/BettaFish-main/.env

# 4. 重启服务
sudo systemctl start bettafish

# 5. 检查状态
sudo systemctl status bettafish
```

---

**执行完成后，告诉我结果！** 🎯

