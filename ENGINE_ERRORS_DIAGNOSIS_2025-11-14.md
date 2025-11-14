# 引擎错误诊断报告 - 2025-11-14

## 🔴 发现的问题

### 问题 1: Insight Engine - IndentationError ✅ 已修复

**错误信息：**
```
IndentationError: expected an indented block after 'try' statement on line 96 (db.py, line 97)
```

**位置：**
- 文件：`BettaFish-main/InsightEngine/utils/db.py`
- 行号：96-97

**原因：**
- `try:` 语句后的代码缩进不正确
- `async with engine.connect() as conn:` 没有正确缩进到 `try` 块内

**修复：**
- ✅ 已修复缩进问题
- ✅ `async with` 语句现在正确缩进在 `try` 块内
- ✅ `rows = result.mappings().all()` 和 `return` 语句也正确缩进

**修复后的代码：**
```python
try:
    async with engine.connect() as conn:
        result = await asyncio.wait_for(
            conn.execute(text(query), params or {}),
            timeout=10.0
        )
        rows = result.mappings().all()
        return [dict(row) for row in rows]
except asyncio.TimeoutError:
    # ...
```

---

### 问题 2: Query Engine & Media Engine - 401 Authentication Error ⚠️ 需要配置

**错误信息：**
```
Error code: 401 - {'error': {'code': '401', 'message': 'token expired or incorrect'}}
```

**影响范围：**
- ❌ Query Engine - 无法生成报告结构
- ❌ Media Engine - 无法生成报告结构

**原因：**
- GLM API (`https://api.z.ai/api/paas/v4/`) 的 API Key 过期或无效
- 环境变量可能未正确设置

**解决方案：**

#### 方案 1: 检查 Railway 环境变量（推荐）

1. **登录 Railway Dashboard**
   - 访问：https://railway.app
   - 选择项目：`publicopinion-production`

2. **检查环境变量**
   确保以下环境变量已设置且有效：
   ```bash
   QUERY_ENGINE_API_KEY=你的GLM_API_Key
   MEDIA_ENGINE_API_KEY=你的GLM_API_Key
   ```

3. **验证 API Key**
   - 访问：https://docs.z.ai/
   - 确认 API Key 是否有效
   - 检查 API Key 是否过期

4. **更新 API Key（如果需要）**
   - 在 Railway Dashboard → Variables 中更新
   - 重启服务使新 Key 生效

#### 方案 2: 检查服务器上的 .env 文件

如果使用 `.env` 文件配置：

```bash
# SSH 到服务器
ssh your_server

# 检查 .env 文件
cd /path/to/BettaFish-main
cat .env | grep -E "QUERY_ENGINE_API_KEY|MEDIA_ENGINE_API_KEY"

# 如果 Key 过期，更新它
nano .env
# 编辑并保存

# 重启服务
sudo systemctl restart bettafish
```

#### 方案 3: 获取新的 GLM API Key

如果 API Key 已过期：

1. **访问 Z.AI 平台**
   - https://docs.z.ai/
   - 登录账户

2. **生成新的 API Key**
   - 进入 API Key 管理页面
   - 创建新的 API Key

3. **更新环境变量**
   - 在 Railway 或服务器上更新
   - 重启服务

---

## 📋 检查清单

### ✅ 已修复
- [x] Insight Engine IndentationError

### ⚠️ 需要操作
- [ ] 检查 Query Engine API Key 是否有效
- [ ] 检查 Media Engine API Key 是否有效
- [ ] 更新过期的 API Key（如果需要）
- [ ] 重启后端服务

---

## 🔧 快速修复步骤

### 1. 修复 IndentationError（已完成）
```bash
# 代码已修复，需要重新部署
git add BettaFish-main/InsightEngine/utils/db.py
git commit -m "Fix IndentationError in InsightEngine utils/db.py"
git push
```

### 2. 修复 401 错误

**在 Railway Dashboard：**
1. 进入项目 → Variables
2. 检查 `QUERY_ENGINE_API_KEY` 和 `MEDIA_ENGINE_API_KEY`
3. 如果过期，更新为新的有效 Key
4. 保存并重启服务

**或在服务器上：**
```bash
# 编辑 .env 文件
nano BettaFish-main/.env

# 更新以下行：
QUERY_ENGINE_API_KEY=新的有效Key
MEDIA_ENGINE_API_KEY=新的有效Key

# 保存并重启
sudo systemctl restart bettafish
```

---

## 📊 错误统计

| Engine | 错误类型 | 状态 | 优先级 |
|--------|---------|------|--------|
| Insight Engine | IndentationError | ✅ 已修复 | 高 |
| Query Engine | 401 Auth Error | ⚠️ 需配置 | 高 |
| Media Engine | 401 Auth Error | ⚠️ 需配置 | 高 |
| Report Engine | 无错误 | ✅ 正常 | - |

---

## 🎯 下一步行动

1. **立即操作：**
   - ✅ 提交 IndentationError 修复
   - ⚠️ 检查并更新 GLM API Keys

2. **验证修复：**
   - 重新运行前端测试
   - 检查 Insight Engine 是否正常启动
   - 检查 Query/Media Engine 是否不再报 401 错误

3. **预防措施：**
   - 设置 API Key 过期提醒
   - 定期检查环境变量配置
   - 添加 API Key 有效性检查

---

## 📝 相关文件

- `BettaFish-main/InsightEngine/utils/db.py` - 已修复
- `BettaFish-main/config.py` - API Key 配置
- `BettaFish-main/QueryEngine/utils/config.py` - Query Engine 配置
- `BettaFish-main/MediaEngine/utils/config.py` - Media Engine 配置

---

**诊断时间：** 2025-11-14  
**诊断人：** AI Assistant  
**状态：** 部分修复，需要用户操作

