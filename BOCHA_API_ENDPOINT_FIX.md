# Bocha API Endpoint 修复方案

## 🔍 问题诊断

### 发现的问题

**代码使用的 API**: AI Search API (`/v1/ai-search`)  
**文档提供的 API**: Web Search API (`/v1/web-search`)

这是**两个完全不同的 API**！

### 错误详情

1. **错误的 Endpoint**
   - 代码: `https://api.bochaai.com/v1/ai-search`
   - 正确: `https://api.bochaai.com/v1/web-search`

2. **错误的请求参数格式**
   - 代码使用: `stream`, `answer` (AI Search API 格式)
   - 应该使用: `query`, `summary`, `count`, `freshness` (Web Search API 格式)

3. **错误的响应解析**
   - 代码解析: `messages`, `conversation_id` (AI Search API 格式)
   - 应该解析: `webPages.value`, `images.value`, `videos.value` (Web Search API 格式)

### 证据

从日志中可以看到：
```
401 Client Error: for url: https://api.bochaai.com/v1/ai-search
```

这说明：
- API Key 可能是正确的
- 但访问的是错误的 endpoint
- 或者 API Key 没有访问 AI Search API 的权限，只有 Web Search API 的权限

---

## 🔧 修复方案

### 需要修改的文件

1. `BettaFish-main/MediaEngine/tools/search.py`
2. `BettaFish-main/MediaEngine/utils/config.py` (可选，更新默认值)
3. `BettaFish-main/config.py` (可选，更新默认值)

### 修改内容

#### 1. 修改 Endpoint

```python
# 旧代码
BOCHA_BASE_URL = settings.BOCHA_BASE_URL or "https://api.bochaai.com/v1/ai-search"

# 新代码
BOCHA_BASE_URL = settings.BOCHA_BASE_URL or "https://api.bochaai.com/v1/web-search"
```

#### 2. 修改请求参数格式

**旧代码** (AI Search API):
```python
payload = {
    "stream": False,
    "query": query,
    "count": max_results,
    "answer": True  # 开启AI总结
}
```

**新代码** (Web Search API):
```python
payload = {
    "query": query,
    "count": max_results,
    "summary": True,  # 开启文本摘要
    "freshness": "noLimit"  # 默认不限时间范围
}
```

#### 3. 修改响应解析逻辑

**旧代码** (AI Search API 格式):
```python
def _parse_search_response(self, response_dict: Dict[str, Any], query: str) -> BochaResponse:
    final_response = BochaResponse(query=query)
    final_response.conversation_id = response_dict.get('conversation_id')
    
    messages = response_dict.get('messages', [])
    for msg in messages:
        # 解析 messages 数组...
```

**新代码** (Web Search API 格式):
```python
def _parse_search_response(self, response_dict: Dict[str, Any], query: str) -> BochaResponse:
    final_response = BochaResponse(query=query)
    
    # Web Search API 响应格式
    data = response_dict.get('data', {})
    
    # 解析网页结果
    web_pages = data.get('webPages', {})
    web_results = web_pages.get('value', [])
    for item in web_results:
        final_response.webpages.append(WebpageResult(
            name=item.get('name', ''),
            url=item.get('url', ''),
            snippet=item.get('snippet', ''),
            display_url=item.get('displayUrl'),
            date_last_crawled=item.get('datePublished') or item.get('dateLastCrawled')
        ))
    
    # 解析图片结果
    images = data.get('images', {})
    image_results = images.get('value', [])
    for item in image_results:
        final_response.images.append(ImageResult(
            name=item.get('name', ''),
            content_url=item.get('contentUrl', ''),
            host_page_url=item.get('hostPageUrl'),
            thumbnail_url=item.get('thumbnailUrl'),
            width=item.get('width'),
            height=item.get('height')
        ))
    
    # Web Search API 不返回 AI 总结，所以 answer 和 follow_ups 为空
    # 如果需要 AI 总结，可能需要使用 AI Search API 或单独调用
    
    return final_response
```

#### 4. 修改工具方法参数映射

**comprehensive_search**:
```python
def comprehensive_search(self, query: str, max_results: int = 10) -> BochaResponse:
    return self._search_internal(
        query=query,
        count=max_results,
        summary=True  # 改为 summary 而不是 answer
    )
```

**search_last_24_hours**:
```python
def search_last_24_hours(self, query: str) -> BochaResponse:
    return self._search_internal(
        query=query,
        freshness='oneDay',  # Web Search API 使用 'oneDay'
        summary=True
    )
```

**search_last_week**:
```python
def search_last_week(self, query: str) -> BochaResponse:
    return self._search_internal(
        query=query,
        freshness='oneWeek',  # Web Search API 使用 'oneWeek'
        summary=True
    )
```

---

## 📋 API 对比

| 特性 | AI Search API | Web Search API |
|------|---------------|----------------|
| Endpoint | `/v1/ai-search` | `/v1/web-search` |
| 请求参数 | `stream`, `answer` | `summary`, `freshness` |
| 响应格式 | `messages`, `conversation_id` | `webPages`, `images`, `videos` |
| AI 总结 | ✅ 支持（`answer` 字段） | ❌ 不支持（只有 `summary` 文本摘要） |
| 多模态 | ✅ 支持 | ✅ 支持 |
| 结构化数据 | ✅ 支持（模态卡） | ❌ 不支持 |

---

## ⚠️ 注意事项

### 功能差异

1. **AI 总结功能**
   - AI Search API: 返回 AI 生成的总结（`answer` 字段）
   - Web Search API: 只返回文本摘要（`summary` 字段），不是 AI 生成的

2. **结构化数据（模态卡）**
   - AI Search API: 支持模态卡（天气、股票等）
   - Web Search API: 不支持模态卡

3. **视频搜索**
   - AI Search API: 支持视频搜索
   - Web Search API: 当前版本不返回视频（`videos` 为空）

### 影响评估

如果切换到 Web Search API：
- ✅ 可以解决 401 错误
- ✅ 可以获得网页和图片搜索结果
- ⚠️ 失去 AI 生成的总结功能（只有文本摘要）
- ⚠️ 失去结构化数据（模态卡）功能
- ⚠️ 失去视频搜索功能

---

## 🎯 建议

### 方案 1: 切换到 Web Search API（推荐）

**优点**:
- ✅ 解决当前的 401 错误
- ✅ API Key 可以正常使用
- ✅ 获得基本的搜索功能

**缺点**:
- ❌ 失去 AI 总结功能
- ❌ 失去模态卡功能
- ❌ 失去视频搜索功能

**适用场景**: 如果只需要基本的网页和图片搜索功能

### 方案 2: 同时支持两个 API

**实现方式**:
- 根据环境变量选择使用哪个 API
- 或者根据功能需求自动选择

**优点**:
- ✅ 保留所有功能
- ✅ 灵活性高

**缺点**:
- ❌ 需要两个 API Key（如果权限不同）
- ❌ 代码复杂度增加

### 方案 3: 申请 AI Search API 权限

**如果确实需要 AI 总结和模态卡功能**:
- 联系 Bocha 平台申请 AI Search API 的访问权限
- 确认 API Key 是否有访问 `/v1/ai-search` 的权限

---

## 📝 实施步骤

1. **备份当前代码**
   ```bash
   cp BettaFish-main/MediaEngine/tools/search.py BettaFish-main/MediaEngine/tools/search.py.backup
   ```

2. **修改代码**（按照上面的修改内容）

3. **测试**
   ```python
   # 测试基本搜索
   search_client = BochaMultimodalSearch()
   result = search_client.comprehensive_search("测试查询")
   print(result.webpages)
   ```

4. **部署**
   - 提交代码
   - 在服务器上更新
   - 重启服务

---

## 🔍 验证方法

修复后，应该看到：
- ✅ 不再有 401 错误
- ✅ 可以正常获取搜索结果
- ✅ API Key 使用量开始增加

如果还有问题，检查：
1. API Key 是否正确
2. API Key 是否有 Web Search API 的权限
3. 网络连接是否正常

