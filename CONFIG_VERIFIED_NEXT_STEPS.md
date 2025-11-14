# 配置已验证 - 下一步操作

## ✅ 配置检查结果

从终端日志确认：

```
QUERY_ENGINE_API_KEY: d21f186794bc4232ac09f1cfdb7b92... ✅ 正确
MEDIA_ENGINE_API_KEY: d21f186794bc4232ac09f1cfdb7b92... ✅ 正确
QUERY_ENGINE_BASE_URL: https://api.z.ai/api/paas/v4/ ✅ 正确
MEDIA_ENGINE_BASE_URL: https://api.z.ai/api/paas/v4/ ✅ 正确
```

**结论：** 配置已正确加载！

## 📋 服务日志分析

服务日志显示：
- `-- No entries --`：最近5分钟没有新日志
- 没有找到引擎初始化日志：说明服务重启后还没有执行新的搜索任务

**这意味着：**
- ✅ 服务已成功重启
- ✅ 配置已正确加载
- ⏳ 需要重新执行一次搜索来测试是否还有401错误

## 🚀 下一步操作

### 步骤 1: 重新测试搜索

在前端执行一次搜索，触发引擎运行，然后检查日志：

```bash
# 实时监控服务日志
sudo journalctl -u bettafish -f

# 或者查看最近的日志
sudo journalctl -u bettafish --since "1 minute ago" --no-pager
```

### 步骤 2: 检查引擎日志

搜索执行后，检查引擎日志文件：

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main

# 查看最新的 Query Engine 日志
tail -50 logs/query.log

# 查看最新的 Media Engine 日志
tail -50 logs/media.log

# 查找401错误
grep -i "401\|error" logs/query.log | tail -10
grep -i "401\|error" logs/media.log | tail -10
```

### 步骤 3: 验证配置传递

如果仍然报401，检查配置是否正确传递到引擎：

```bash
# 查看引擎初始化时的日志
sudo journalctl -u bettafish --since "10 minutes ago" --no-pager | grep -E "Query Agent|Media Agent|使用LLM|LLM 模型"
```

## 🔍 如果仍然报401错误

### 可能的原因 1: API Key 不完整

检查完整的 API Key：

```bash
./venv/bin/python3 << 'EOF'
from config import settings
print("完整 QUERY_ENGINE_API_KEY:", settings.QUERY_ENGINE_API_KEY)
print("完整 MEDIA_ENGINE_API_KEY:", settings.MEDIA_ENGINE_API_KEY)
EOF
```

### 可能的原因 2: 配置传递问题

检查 `app.py` 中如何传递配置。代码显示：

```python
# app.py line 1915-1921
engine_config = EngineSettings(
    QUERY_ENGINE_API_KEY=settings.QUERY_ENGINE_API_KEY,  # 从主 config.py 读取
    ...
)
```

如果主 `config.py` 的 `settings` 在服务启动时已经初始化，应该已经加载了正确的值。

### 可能的原因 3: QueryEngine/MediaEngine 的 Settings 类问题

检查引擎的 Settings 类是否正确处理 API Key：

```bash
# 检查 QueryEngine Settings
./venv/bin/python3 << 'EOF'
from QueryEngine.utils.config import Settings
try:
    # 尝试创建 Settings 实例（使用主 config 的值）
    from config import settings as main_settings
    test_config = Settings(
        QUERY_ENGINE_API_KEY=main_settings.QUERY_ENGINE_API_KEY,
        QUERY_ENGINE_BASE_URL=main_settings.QUERY_ENGINE_BASE_URL,
        QUERY_ENGINE_MODEL_NAME=main_settings.QUERY_ENGINE_MODEL_NAME,
        TAVILY_API_KEY=main_settings.TAVILY_API_KEY or "test",
        OUTPUT_DIR="test"
    )
    print("✅ QueryEngine Settings 创建成功")
    print(f"API Key: {test_config.QUERY_ENGINE_API_KEY[:30]}...")
except Exception as e:
    print(f"❌ QueryEngine Settings 创建失败: {e}")
EOF
```

## 📊 完整测试流程

```bash
#!/bin/bash

echo "=== 完整测试流程 ==="
echo ""

# 1. 验证配置
echo "1. 验证配置加载："
cd /home/bettafish/Public_Opinion/BettaFish-main
./venv/bin/python3 << 'EOF'
from config import settings
print(f"  QUERY_ENGINE_API_KEY: {settings.QUERY_ENGINE_API_KEY[:30]}...")
print(f"  MEDIA_ENGINE_API_KEY: {settings.MEDIA_ENGINE_API_KEY[:30]}...")
EOF

echo ""
echo "2. 请在前端执行一次搜索"
echo "3. 然后运行以下命令查看日志："
echo ""
echo "   sudo journalctl -u bettafish --since '1 minute ago' --no-pager | grep -E 'Query Agent|Media Agent|401|error'"
echo ""
echo "=== 测试完成 ==="
```

## ✅ 当前状态

- ✅ 配置已正确加载
- ✅ 服务已重启
- ✅ API Key 格式正确
- ⏳ 等待新的搜索任务来验证是否还有401错误

**建议：** 在前端执行一次搜索，然后检查日志确认是否还有401错误。

