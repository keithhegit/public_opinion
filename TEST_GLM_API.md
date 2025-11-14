# GLM API 测试命令

## 🔧 快速测试命令

### 基本测试（使用 curl）

```bash
curl -X POST https://api.z.ai/api/paas/v4/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -d '{
    "model": "glm-4.6",
    "messages": [
      {
        "role": "user",
        "content": "你好，请回复'API测试成功'"
      }
    ],
    "max_tokens": 100
  }'
```

### 替换 YOUR_API_KEY_HERE

将 `YOUR_API_KEY_HERE` 替换为你的实际 API Key：

```bash
curl -X POST https://api.z.ai/api/paas/v4/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-your-actual-api-key-here" \
  -d '{
    "model": "glm-4.6",
    "messages": [
      {
        "role": "user",
        "content": "你好，请回复'\''API测试成功'\''"
      }
    ],
    "max_tokens": 100
  }'
```

---

## 📋 详细测试命令

### 1. 简单测试（单行命令）

```bash
curl -X POST https://api.z.ai/api/paas/v4/chat/completions -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_API_KEY" -d '{"model":"glm-4.6","messages":[{"role":"user","content":"测试"}],"max_tokens":50}'
```

### 2. 格式化输出（使用 jq，如果已安装）

```bash
curl -X POST https://api.z.ai/api/paas/v4/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "glm-4.6",
    "messages": [
      {
        "role": "user",
        "content": "你好"
      }
    ],
    "max_tokens": 100
  }' | jq .
```

### 3. 保存响应到文件

```bash
curl -X POST https://api.z.ai/api/paas/v4/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "glm-4.6",
    "messages": [
      {
        "role": "user",
        "content": "测试"
      }
    ],
    "max_tokens": 100
  }' -o glm_api_response.json
```

---

## 🔍 测试不同场景

### 测试 1: 验证 API Key 是否有效

```bash
curl -X POST https://api.z.ai/api/paas/v4/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "glm-4.6",
    "messages": [
      {
        "role": "user",
        "content": "Hello"
      }
    ],
    "max_tokens": 10
  }' -v
```

**预期结果：**
- ✅ **200 OK**: API Key 有效
- ❌ **401 Unauthorized**: API Key 无效或过期
- ❌ **403 Forbidden**: API Key 无权限
- ❌ **429 Too Many Requests**: 请求频率过高

### 测试 2: 测试流式响应（如果支持）

```bash
curl -X POST https://api.z.ai/api/paas/v4/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "glm-4.6",
    "messages": [
      {
        "role": "user",
        "content": "请用一句话介绍你自己"
      }
    ],
    "max_tokens": 100,
    "stream": true
  }'
```

### 测试 3: 测试完整对话

```bash
curl -X POST https://api.z.ai/api/paas/v4/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "glm-4.6",
    "messages": [
      {
        "role": "system",
        "content": "你是一个有用的助手"
      },
      {
        "role": "user",
        "content": "1+1等于多少？"
      }
    ],
    "max_tokens": 100
  }'
```

---

## 🐍 Python 测试脚本

如果 curl 不方便，可以使用 Python：

```python
import requests
import json

api_key = "YOUR_API_KEY_HERE"
url = "https://api.z.ai/api/paas/v4/chat/completions"

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
}

data = {
    "model": "glm-4.6",
    "messages": [
        {
            "role": "user",
            "content": "你好，请回复'API测试成功'"
        }
    ],
    "max_tokens": 100
}

response = requests.post(url, headers=headers, json=data)

print(f"Status Code: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
```

保存为 `test_glm_api.py` 并运行：

```bash
python3 test_glm_api.py
```

---

## 🔧 在服务器上测试

### 方法 1: 直接从 .env 读取 API Key

```bash
# 在服务器上，从 .env 读取 API Key 并测试
API_KEY=$(grep "QUERY_ENGINE_API_KEY" .env | cut -d '=' -f2 | tr -d '"' | tr -d "'" | tr -d ' ')

curl -X POST https://api.z.ai/api/paas/v4/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "model": "glm-4.6",
    "messages": [
      {
        "role": "user",
        "content": "测试"
      }
    ],
    "max_tokens": 50
  }'
```

### 方法 2: 使用环境变量

```bash
# 设置环境变量
export GLM_API_KEY="your-api-key-here"

# 测试
curl -X POST https://api.z.ai/api/paas/v4/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $GLM_API_KEY" \
  -d '{
    "model": "glm-4.6",
    "messages": [
      {
        "role": "user",
        "content": "测试"
      }
    ],
    "max_tokens": 50
  }'
```

---

## 📊 响应示例

### 成功响应（200 OK）

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "glm-4.6",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "API测试成功"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 5,
    "total_tokens": 15
  }
}
```

### 错误响应（401 Unauthorized）

```json
{
  "error": {
    "code": "401",
    "message": "token expired or incorrect",
    "type": "authentication_error"
  }
}
```

---

## ⚠️ 常见问题排查

### 1. 401 错误

**可能原因：**
- API Key 过期
- API Key 格式错误（缺少 `Bearer` 前缀）
- API Key 被撤销

**解决方法：**
```bash
# 检查 API Key 格式
echo "Bearer YOUR_API_KEY" | grep -E "^Bearer sk-"

# 测试不同的 API Key
# 在 Z.AI 平台生成新的 API Key
```

### 2. 403 错误

**可能原因：**
- API Key 没有访问该模型的权限
- 账户余额不足

**解决方法：**
- 检查 Z.AI 账户状态
- 确认账户有足够余额

### 3. 429 错误

**可能原因：**
- 请求频率过高
- 达到速率限制

**解决方法：**
- 降低请求频率
- 等待一段时间后重试

---

## 🚀 快速诊断脚本

创建 `test_glm_api.sh`：

```bash
#!/bin/bash

# 从 .env 读取 API Key
if [ -f .env ]; then
    API_KEY=$(grep "QUERY_ENGINE_API_KEY" .env | cut -d '=' -f2 | tr -d '"' | tr -d "'" | tr -d ' ')
else
    echo "错误: .env 文件不存在"
    exit 1
fi

if [ -z "$API_KEY" ]; then
    echo "错误: 未找到 QUERY_ENGINE_API_KEY"
    exit 1
fi

echo "测试 GLM API..."
echo "API Key: ${API_KEY:0:10}..." # 只显示前10个字符

response=$(curl -s -w "\n%{http_code}" -X POST https://api.z.ai/api/paas/v4/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "model": "glm-4.6",
    "messages": [
      {
        "role": "user",
        "content": "测试"
      }
    ],
    "max_tokens": 50
  }')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

echo "HTTP Status: $http_code"
echo "Response:"
echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"

if [ "$http_code" = "200" ]; then
    echo "✅ API 测试成功！"
else
    echo "❌ API 测试失败！"
fi
```

运行：

```bash
chmod +x test_glm_api.sh
./test_glm_api.sh
```

---

## 📝 注意事项

1. **API Key 安全：**
   - 不要在公共场合暴露完整的 API Key
   - 不要在代码中硬编码 API Key
   - 使用环境变量或配置文件

2. **请求格式：**
   - 确保使用正确的 Content-Type: `application/json`
   - 确保 Authorization header 格式正确: `Bearer YOUR_API_KEY`

3. **模型名称：**
   - 确认模型名称正确：`glm-4.6`
   - 不同模型可能有不同的端点

4. **网络连接：**
   - 确保服务器可以访问 `https://api.z.ai`
   - 检查防火墙设置

