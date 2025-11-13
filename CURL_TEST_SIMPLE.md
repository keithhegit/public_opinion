# Bocha API curl 测试命令（简单版本）

## ✅ 推荐方法：使用 Git Bash 或 Linux/Mac 终端

### 方法 1: 直接 curl 命令（推荐）

```bash
curl -X POST https://api.bochaai.com/v1/ai-search \
  -H "Authorization: Bearer sk-f2d544f236214b4fb8d090861176e3dd" \
  -H "Content-Type: application/json; charset=utf-8" \
  -H "Accept: */*" \
  -d '{"query": "人工智能对未来教育的影响", "count": 5, "answer": true}'
```

### 方法 2: 使用测试脚本

```bash
# Linux/Mac/Git Bash
chmod +x test_bocha_curl.sh
./test_bocha_curl.sh
```

---

## ⚠️ PowerShell 编码问题说明

PowerShell 控制台在显示中文字符时可能出现乱码，这是**控制台编码问题**，不是 API 调用问题。

### 解决方案

1. **使用 Git Bash**（推荐）
   - 在 Git Bash 中运行 curl 命令，中文显示正常

2. **使用英文查询测试**
   ```powershell
   # 使用英文查询避免编码问题
   $body = '{"query": "AI impact on future education", "count": 5, "answer": true}'
   ```

3. **检查实际发送的请求**
   - 虽然控制台显示乱码，但实际发送的请求可能是正确的
   - 可以通过 API 返回的结果判断（如果返回了相关结果，说明查询是正确的）

---

## 📝 .env 文件更新

在 `BettaFish-main/.env` 文件中更新：

```env
BOCHA_WEB_SEARCH_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd
```

或者：

```env
BOCHA_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd
```

---

## 🔍 验证 API Key 是否正确

从测试结果看，API 调用成功（code: 200），说明：
- ✅ API Key 有效
- ✅ API Endpoint 正确
- ✅ 请求格式正确

虽然控制台显示乱码，但 API 已经成功返回了结果。

