# 修复配置加载问题 - 使用虚拟环境

## 🔍 问题分析

从终端日志看到：
1. ✅ 步骤1：.env 文件验证成功
2. ❌ 步骤2：`ModuleNotFoundError: No module named 'pydantic_settings'`
3. ✅ 步骤3：服务已重启（17:55:02）

**原因：** 步骤2使用了系统Python，但服务使用的是虚拟环境 `venv`

## ✅ 正确的检查命令

### 使用虚拟环境检查配置

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main

# 方法1: 激活虚拟环境
source venv/bin/activate
python3 << 'EOF'
import sys
from pathlib import Path
sys.path.insert(0, str(Path.cwd()))
from config import settings
print("QUERY_ENGINE_API_KEY:", settings.QUERY_ENGINE_API_KEY[:30] if settings.QUERY_ENGINE_API_KEY else "None")
print("MEDIA_ENGINE_API_KEY:", settings.MEDIA_ENGINE_API_KEY[:30] if settings.MEDIA_ENGINE_API_KEY else "None")
print("QUERY_ENGINE_BASE_URL:", settings.QUERY_ENGINE_BASE_URL)
print("MEDIA_ENGINE_BASE_URL:", settings.MEDIA_ENGINE_BASE_URL)
EOF
deactivate

# 方法2: 直接使用虚拟环境的Python（推荐）
./venv/bin/python3 << 'EOF'
import sys
from pathlib import Path
sys.path.insert(0, str(Path.cwd()))
from config import settings
print("QUERY_ENGINE_API_KEY:", settings.QUERY_ENGINE_API_KEY[:30] if settings.QUERY_ENGINE_API_KEY else "None")
print("MEDIA_ENGINE_API_KEY:", settings.MEDIA_ENGINE_API_KEY[:30] if settings.MEDIA_ENGINE_API_KEY else "None")
print("QUERY_ENGINE_BASE_URL:", settings.QUERY_ENGINE_BASE_URL)
print("MEDIA_ENGINE_BASE_URL:", settings.MEDIA_ENGINE_BASE_URL)
EOF
```

## 🔍 检查服务日志

服务已重启，现在需要检查日志确认配置是否正确加载：

```bash
# 查看服务启动日志
sudo journalctl -u bettafish --since "5 minutes ago" --no-pager

# 查找配置相关信息
sudo journalctl -u bettafish -n 200 --no-pager | grep -E "API_KEY|使用LLM|LLM 模型|Base URL|配置"

# 查看最近的错误
sudo journalctl -u bettafish --since "5 minutes ago" --no-pager | grep -i error
```

## 🎯 如果配置正确但仍报401

如果配置检查显示API Key正确，但服务仍报401，可能的原因：

### 1. 配置传递问题

检查 `app.py` 中如何传递配置给引擎：

```python
# app.py line 1915-1921
engine_config = EngineSettings(
    QUERY_ENGINE_API_KEY=settings.QUERY_ENGINE_API_KEY,  # 这里的 settings 来自主 config.py
    ...
)
```

### 2. 检查主 config.py 的 settings

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main
./venv/bin/python3 << 'EOF'
from config import settings
print("主 config.py 的配置：")
print("QUERY_ENGINE_API_KEY:", settings.QUERY_ENGINE_API_KEY[:30] if settings.QUERY_ENGINE_API_KEY else "None")
print("MEDIA_ENGINE_API_KEY:", settings.MEDIA_ENGINE_API_KEY[:30] if settings.MEDIA_ENGINE_API_KEY else "None")
EOF
```

### 3. 检查引擎实际使用的配置

在服务运行时，可以通过日志查看引擎初始化时使用的配置。

## 📋 完整诊断流程

```bash
#!/bin/bash
cd /home/bettafish/Public_Opinion/BettaFish-main

echo "=== 完整配置诊断 ==="
echo ""

# 1. 检查 .env 文件
echo "1. .env 文件内容："
grep -E "QUERY_ENGINE_API_KEY|MEDIA_ENGINE_API_KEY" .env | head -c 80
echo ""
echo ""

# 2. 检查主 config.py 加载的配置
echo "2. 主 config.py 加载的配置："
./venv/bin/python3 << 'EOF'
from config import settings
q_key = settings.QUERY_ENGINE_API_KEY
m_key = settings.MEDIA_ENGINE_API_KEY
print(f"  QUERY_ENGINE_API_KEY: {q_key[:30] if q_key else 'None'}...")
print(f"  MEDIA_ENGINE_API_KEY: {m_key[:30] if m_key else 'None'}...")
print(f"  QUERY_ENGINE_BASE_URL: {settings.QUERY_ENGINE_BASE_URL}")
print(f"  MEDIA_ENGINE_BASE_URL: {settings.MEDIA_ENGINE_BASE_URL}")
EOF

echo ""
echo ""

# 3. 检查服务日志
echo "3. 服务日志中的配置信息："
sudo journalctl -u bettafish -n 100 --no-pager | grep -E "使用LLM|LLM 模型|Base URL" | tail -5

echo ""
echo "=== 诊断完成 ==="
```

## 🚀 下一步

1. **运行正确的配置检查命令**（使用虚拟环境）
2. **查看服务日志**，确认配置是否正确加载
3. **如果配置正确但仍报401**，检查配置传递逻辑

