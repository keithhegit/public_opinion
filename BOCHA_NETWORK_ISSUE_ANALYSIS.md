# Bocha API 网络访问问题分析

## 🔍 问题分析

### 可能的原因

#### 1. 地理位置导致的网络问题 ✅ **已解决**

**原情况**：
- Railway 云实例位于：**荷兰**
- Bocha API 服务器位于：**中国**（`api.bochaai.com`）
- 跨洲网络访问导致：
  - 高延迟（200-500ms+）
  - 连接超时
  - 防火墙/网络限制
  - 401 错误（如果请求在传输过程中被中断或超时）

**解决方案**：
- ✅ **Railway 云实例已调整为新加坡**
- ✅ 新加坡离中国更近，网络延迟大幅降低
- ✅ 应该能解决跨洲网络访问问题

**验证方法**：
```bash
# 从 Railway 实例测试网络连通性
curl -v https://api.bochaai.com/v1/ai-search
ping api.bochaai.com
```

#### 2. API Key 认证问题

**可能原因**：
- API Key 无效或过期
- API Key 格式错误
- API Key 权限不足
- Bearer Token 格式问题

**验证方法**：
- 登录 https://open.bochaai.com/ 检查 API Key 状态
- 使用 Postman 或 curl 直接测试 API

#### 3. 请求超时设置

**当前代码**：
```python
response = requests.post(self.BOCHA_BASE_URL, headers=self._headers, json=payload, timeout=30)
```

**问题**：
- 30 秒超时可能不够（跨洲网络延迟高）
- 如果网络不稳定，请求可能在 30 秒内超时

---

## 🛠️ 解决方案

### 方案 1: 增加超时时间和重试机制（临时方案）

**优点**：
- 无需修改架构
- 快速实施

**缺点**：
- 不能根本解决网络问题
- 可能增加响应时间

**实施**：
```python
# 增加超时时间到 60 秒
response = requests.post(self.BOCHA_BASE_URL, headers=self._headers, json=payload, timeout=60)
```

### 方案 2: 使用代理服务器（推荐）

**架构**：
```
Railway (荷兰) → 中国代理服务器 → Bocha API (中国)
```

**优点**：
- 解决跨洲网络问题
- 降低延迟
- 提高稳定性

**缺点**：
- 需要额外的代理服务器成本
- 需要配置代理

**实施步骤**：
1. 在中国部署代理服务器（如阿里云、腾讯云）
2. 配置代理转发 Bocha API 请求
3. 在 Railway 环境变量中配置代理 URL

### 方案 3: 替换为国际 API（最佳方案）

**推荐替代品**：
1. **Tavily API**（已在 Query Engine 中使用）
   - 国际平台，稳定可靠
   - 支持新闻搜索、图片搜索
   - 有免费额度
   - 缺点：不支持视频搜索和结构化数据

2. **Perplexity API**
   - 强大的 AI 搜索能力
   - 对中文支持良好
   - 缺点：价格较高

3. **Serper API**
   - Google 搜索结果
   - 价格便宜
   - 缺点：不支持多模态

**详细对比**：请查看 [BOCHA_SEARCH_ALTERNATIVES.md](./BOCHA_SEARCH_ALTERNATIVES.md)

---

## 🔧 临时修复建议

### 1. 增加超时时间

修改 `BettaFish-main/MediaEngine/tools/search.py`：

```python
# 从 30 秒增加到 60 秒
response = requests.post(self.BOCHA_BASE_URL, headers=self._headers, json=payload, timeout=60)
```

### 2. 添加网络诊断日志

```python
import time
start_time = time.time()
try:
    response = requests.post(self.BOCHA_BASE_URL, headers=self._headers, json=payload, timeout=60)
    elapsed = time.time() - start_time
    logger.info(f"Bocha API 请求耗时: {elapsed:.2f} 秒")
except requests.exceptions.Timeout:
    logger.error(f"Bocha API 请求超时（60秒），可能是网络问题")
except requests.exceptions.ConnectionError:
    logger.error(f"Bocha API 连接失败，可能是网络问题或 API 服务不可用")
```

### 3. 验证 API Key

```bash
# 使用 curl 测试 API Key
curl -X POST https://api.bochaai.com/v1/ai-search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "count": 1}'
```

---

## 📊 诊断步骤

### Step 1: 检查网络连通性

在 Railway 实例中运行：
```bash
# 测试 DNS 解析
nslookup api.bochaai.com

# 测试网络延迟
ping api.bochaai.com

# 测试 HTTPS 连接
curl -v https://api.bochaai.com/v1/ai-search
```

### Step 2: 验证 API Key

1. 登录 https://open.bochaai.com/
2. 检查 API Key 状态
3. 查看 API 使用日志
4. 确认 API Key 权限

### Step 3: 测试 API 调用

使用 Postman 或 curl 直接测试：
```bash
curl -X POST https://api.bochaai.com/v1/ai-search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "count": 1, "answer": true}'
```

---

## 🎯 推荐方案

### 短期（立即实施）
1. ✅ 增加超时时间到 60 秒
2. ✅ 添加网络诊断日志
3. ✅ 验证 API Key 有效性

### 中期（1-2周）
1. 🔄 考虑使用代理服务器
2. 🔄 评估替换为国际 API（Tavily/Perplexity）

### 长期（1个月+）
1. 🎯 替换为国际 API（推荐 Tavily，已在项目中使用）
2. 🎯 统一搜索 API，减少依赖

---

## ⚠️ 注意事项

1. **401 错误通常是认证问题**，但网络问题也可能导致类似错误
2. **地理位置确实可能影响访问**，特别是中国国内 API 服务
3. **建议优先验证 API Key**，然后再考虑网络问题
4. **如果网络问题持续，建议替换为国际 API**

---

**最后更新**: 2025-11-11
**状态**: 🔍 需要进一步诊断

