# 使用虚拟环境检查配置

## 🔍 问题

步骤2报错：`ModuleNotFoundError: No module named 'pydantic_settings'`

**原因：** 系统Python环境没有安装 `pydantic_settings`，但服务使用的是虚拟环境 `venv`

## ✅ 正确的检查方法

### 方法 1: 激活虚拟环境后检查

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main

# 激活虚拟环境
source venv/bin/activate

# 检查配置
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

# 退出虚拟环境
deactivate
```

### 方法 2: 直接使用虚拟环境的 Python

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main

# 使用虚拟环境的 Python
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

### 方法 3: 检查服务日志中的配置信息

```bash
# 查看服务启动日志，查找配置加载信息
sudo journalctl -u bettafish -n 100 --no-pager | grep -E "API_KEY|使用LLM|LLM 模型|Base URL"

# 或者查看完整的启动日志
sudo journalctl -u bettafish --since "5 minutes ago" --no-pager
```

## 🔍 检查服务实际使用的配置

### 查看服务进程的环境变量

```bash
# 获取服务进程ID
PID=$(sudo systemctl show bettafish --property MainPID --value)

# 查看进程的环境变量
sudo cat /proc/$PID/environ | tr '\0' '\n' | grep -E "QUERY_ENGINE|MEDIA_ENGINE"
```

### 检查服务的工作目录

```bash
# 查看服务的工作目录（从 systemd service 文件）
sudo systemctl cat bettafish | grep -E "WorkingDirectory|ExecStart"
```

## 📋 完整诊断脚本（使用虚拟环境）

创建 `check_config_venv.sh`：

```bash
#!/bin/bash

cd /home/bettafish/Public_Opinion/BettaFish-main

echo "=== 使用虚拟环境检查配置 ==="
echo ""

# 使用虚拟环境的 Python
./venv/bin/python3 << 'EOF'
import sys
from pathlib import Path
sys.path.insert(0, str(Path.cwd()))

try:
    from config import settings
    
    print("✅ 配置加载成功")
    print("")
    print("QUERY_ENGINE_API_KEY:", settings.QUERY_ENGINE_API_KEY[:30] + "..." if settings.QUERY_ENGINE_API_KEY else "None")
    print("MEDIA_ENGINE_API_KEY:", settings.MEDIA_ENGINE_API_KEY[:30] + "..." if settings.MEDIA_ENGINE_API_KEY else "None")
    print("QUERY_ENGINE_BASE_URL:", settings.QUERY_ENGINE_BASE_URL)
    print("MEDIA_ENGINE_BASE_URL:", settings.MEDIA_ENGINE_BASE_URL)
    print("QUERY_ENGINE_MODEL_NAME:", settings.QUERY_ENGINE_MODEL_NAME)
    print("MEDIA_ENGINE_MODEL_NAME:", settings.MEDIA_ENGINE_MODEL_NAME)
    
    # 验证 API Key 是否匹配
    expected_key = "d21f186794bc4232ac09f1cfdb7b92e6.2fLNtg6XZNm2JMDw"
    q_match = settings.QUERY_ENGINE_API_KEY == expected_key if settings.QUERY_ENGINE_API_KEY else False
    m_match = settings.MEDIA_ENGINE_API_KEY == expected_key if settings.MEDIA_ENGINE_API_KEY else False
    
    print("")
    if q_match:
        print("✅ QUERY_ENGINE_API_KEY 匹配")
    else:
        print("❌ QUERY_ENGINE_API_KEY 不匹配")
    
    if m_match:
        print("✅ MEDIA_ENGINE_API_KEY 匹配")
    else:
        print("❌ MEDIA_ENGINE_API_KEY 不匹配")
        
except Exception as e:
    print(f"❌ 配置加载失败: {e}")
    import traceback
    traceback.print_exc()
EOF

echo ""
echo "=== 检查完成 ==="
```

运行：

```bash
chmod +x check_config_venv.sh
./check_config_venv.sh
```

