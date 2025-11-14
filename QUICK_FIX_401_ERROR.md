# 快速修复 401 错误 - API Key 加载问题

## 🎯 问题确认

- ✅ API Key 在 .env 文件中是正确的
- ✅ curl 测试成功（200 OK）
- ❌ 代码中仍然报 401 错误

**原因：** 服务没有重新加载配置，仍在使用旧的 API Key

## 🚀 快速修复（3步）

### 步骤 1: 验证 .env 文件中的 API Key

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main
grep -E "QUERY_ENGINE_API_KEY|MEDIA_ENGINE_API_KEY" .env
```

**应该看到：**
```
QUERY_ENGINE_API_KEY=d21f186794bc4232ac09f1cfdb7b92e6.2fLNtg6XZNm2JMDw
MEDIA_ENGINE_API_KEY=d21f186794bc4232ac09f1cfdb7b92e6.2fLNtg6XZNm2JMDw
```

### 步骤 2: 检查当前进程读取的配置

```bash
# 检查 Python 进程读取到的配置
python3 << 'EOF'
import sys
from pathlib import Path
sys.path.insert(0, str(Path.cwd()))
from config import settings
print("QUERY_ENGINE_API_KEY:", settings.QUERY_ENGINE_API_KEY[:30] if settings.QUERY_ENGINE_API_KEY else "None")
print("MEDIA_ENGINE_API_KEY:", settings.MEDIA_ENGINE_API_KEY[:30] if settings.MEDIA_ENGINE_API_KEY else "None")
EOF
```

**如果显示 `None` 或不同的 Key，说明配置没有正确加载**

### 步骤 3: 重启服务

```bash
# 重启服务以重新加载配置
sudo systemctl restart bettafish

# 检查服务状态
sudo systemctl status bettafish

# 查看启动日志，确认配置已加载
sudo journalctl -u bettafish -n 50 --no-pager | grep -E "API_KEY|使用LLM"
```

## 🔍 如果重启后仍然报错

### 检查环境变量覆盖

```bash
# 检查是否有环境变量覆盖了 .env 文件
printenv | grep -E "QUERY_ENGINE_API_KEY|MEDIA_ENGINE_API_KEY"

# 如果有输出，说明环境变量会覆盖 .env 文件
# 需要检查 systemd service 文件
sudo systemctl cat bettafish | grep -E "Environment|QUERY_ENGINE|MEDIA_ENGINE"
```

### 检查 .env 文件格式

```bash
# 确保格式正确（等号前后没有空格，没有引号）
cat .env | grep -E "QUERY_ENGINE_API_KEY|MEDIA_ENGINE_API_KEY"

# 正确格式示例：
# QUERY_ENGINE_API_KEY=d21f186794bc4232ac09f1cfdb7b92e6.2fLNtg6XZNm2JMDw
# MEDIA_ENGINE_API_KEY=d21f186794bc4232ac09f1cfdb7b92e6.2fLNtg6XZNm2JMDw

# 错误格式（不要这样）：
# QUERY_ENGINE_API_KEY="d21f186794bc4232ac09f1cfdb7b92e6.2fLNtg6XZNm2JMDw"  # 有引号
# QUERY_ENGINE_API_KEY = d21f186794bc4232ac09f1cfdb7b92e6.2fLNtg6XZNm2JMDw  # 有空格
```

### 检查 .env 文件位置

```bash
# 确认 .env 文件在正确的位置
pwd
ls -la .env

# 代码查找 .env 的逻辑：
# 1. 先查找当前工作目录的 .env
# 2. 如果不存在，查找项目根目录的 .env
```

## 📋 完整诊断脚本

创建 `diagnose_config.sh`：

```bash
#!/bin/bash

echo "=== 配置诊断 ==="
echo ""

# 1. 检查 .env 文件
echo "1. 检查 .env 文件："
if [ -f .env ]; then
    echo "   ✅ .env 文件存在"
    echo "   QUERY_ENGINE_API_KEY: $(grep '^QUERY_ENGINE_API_KEY=' .env | cut -d'=' -f2 | head -c 30)..."
    echo "   MEDIA_ENGINE_API_KEY: $(grep '^MEDIA_ENGINE_API_KEY=' .env | cut -d'=' -f2 | head -c 30)..."
else
    echo "   ❌ .env 文件不存在"
fi

echo ""

# 2. 检查环境变量
echo "2. 检查环境变量："
if printenv | grep -q "QUERY_ENGINE_API_KEY"; then
    echo "   ⚠️  发现环境变量 QUERY_ENGINE_API_KEY（会覆盖 .env）"
    printenv | grep "QUERY_ENGINE_API_KEY" | head -c 50
    echo "..."
else
    echo "   ✅ 未设置环境变量"
fi

echo ""

# 3. 检查 Python 读取的配置
echo "3. 检查 Python 读取的配置："
python3 << 'EOF'
import sys
from pathlib import Path
sys.path.insert(0, str(Path.cwd()))
try:
    from config import settings
    q_key = settings.QUERY_ENGINE_API_KEY
    m_key = settings.MEDIA_ENGINE_API_KEY
    print(f"   QUERY_ENGINE_API_KEY: {q_key[:30] if q_key else 'None'}...")
    print(f"   MEDIA_ENGINE_API_KEY: {m_key[:30] if m_key else 'None'}...")
except Exception as e:
    print(f"   ❌ 配置加载失败: {e}")
EOF

echo ""
echo "=== 诊断完成 ==="
```

运行：

```bash
chmod +x diagnose_config.sh
./diagnose_config.sh
```

## ✅ 预期结果

修复后，服务日志应该显示：

```
使用LLM: {'provider': 'openai-compatible', 'model': 'glm-4.6', 'api_base': 'https://api.z.ai/api/paas/v4/'}
```

而不是 401 错误。

## 🎯 最可能的原因和解决方案

**原因：** 服务启动时加载了旧的配置，修改 .env 后没有重启

**解决方案：**
```bash
sudo systemctl restart bettafish
```

**验证：**
```bash
# 等待几秒后检查日志
sudo journalctl -u bettafish -n 20 --no-pager
```

