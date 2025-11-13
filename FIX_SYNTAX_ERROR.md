# 修复语法错误

## 🔍 问题

**错误信息**：
```
SyntaxError: 'await' outside async function
File "/home/bettafish/Public_Opinion/BettaFish-main/app.py", line 1373
    await engine.dispose()
    ^^^^^^^^^^^^^^^^^^^^^^
```

## 🔧 修复

### 问题原因
在 `get_mindspider_topics()` 和 `get_mindspider_news()` 函数中，使用了 `await engine.dispose()`，但这些函数不是 `async` 函数。

### 修复方案
将 `await engine.dispose()` 改为 `asyncio.run(engine.dispose())`，因为：
- 这些是 Flask 路由函数（同步函数）
- 不能直接使用 `await`
- 需要使用 `asyncio.run()` 来运行异步操作

### 修复位置
1. **第 1373 行**：`get_mindspider_topics()` 函数
2. **第 1414 行**：`get_mindspider_news()` 函数

### 修复后的代码
```python
# 修复前
topics = asyncio.run(fetch_topics())
await engine.dispose()  # ❌ 错误：不在 async 函数中

# 修复后
topics = asyncio.run(fetch_topics())
asyncio.run(engine.dispose())  # ✅ 正确
```

---

## 🚀 部署步骤

### 在服务器上执行：

```bash
# 1. 拉取最新代码
cd /home/bettafish/Public_Opinion/BettaFish-main
sudo -u bettafish git pull

# 2. 验证语法
python3 -m py_compile app.py

# 3. 重启服务
sudo systemctl restart bettafish

# 4. 检查服务状态
sleep 5
sudo systemctl status bettafish

# 5. 测试 API
curl http://localhost:5000/api/system/status
```

---

## ✅ 验证

修复后，服务应该能够正常启动，不再出现语法错误。

