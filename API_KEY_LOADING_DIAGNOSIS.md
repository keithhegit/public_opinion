# API Key 加载问题诊断

## 🔍 问题分析

从日志和代码分析，发现以下情况：

1. ✅ **API Key 本身有效** - curl 测试成功返回 200
2. ✅ **.env 文件中的 Key 正确** - 用户确认
3. ❌ **代码中读取到的是错误的 Key** - 401 错误

## 📋 可能的原因

### 原因 1: 配置未重新加载

**问题：**
- `config.py` 中的 `settings` 在模块导入时就已经初始化
- 如果 .env 文件在服务启动后更新，`settings` 不会自动重新加载
- 需要重启服务才能加载新的配置

**检查方法：**
```bash
# 在服务器上检查当前进程读取的配置
python3 -c "
from config import settings
print('QUERY_ENGINE_API_KEY:', settings.QUERY_ENGINE_API_KEY[:20] if settings.QUERY_ENGINE_API_KEY else 'None')
print('MEDIA_ENGINE_API_KEY:', settings.MEDIA_ENGINE_API_KEY[:20] if settings.MEDIA_ENGINE_API_KEY else 'None')
"
```

### 原因 2: 环境变量优先级问题

**问题：**
- pydantic-settings 的加载顺序：环境变量 > .env 文件
- 如果系统环境变量中设置了旧的 API Key，会覆盖 .env 文件中的值

**检查方法：**
```bash
# 检查环境变量
env | grep -E "QUERY_ENGINE_API_KEY|MEDIA_ENGINE_API_KEY"

# 检查 .env 文件
grep -E "QUERY_ENGINE_API_KEY|MEDIA_ENGINE_API_KEY" .env
```

### 原因 3: .env 文件路径问题

**问题：**
- 代码中查找 .env 文件的逻辑：
  ```python
  CWD_ENV: Path = Path.cwd() / ".env"
  ENV_FILE: str = str(CWD_ENV if CWD_ENV.exists() else (PROJECT_ROOT / ".env"))
  ```
- 如果当前工作目录不是项目根目录，可能找不到 .env 文件

**检查方法：**
```bash
# 检查当前工作目录
pwd

# 检查 .env 文件位置
find ~ -name ".env" -type f 2>/dev/null
ls -la .env
ls -la BettaFish-main/.env
```

### 原因 4: 配置传递问题

**问题：**
- `app.py` 中手动创建 `EngineSettings` 实例
- 如果主 `config.py` 的 `settings` 没有正确加载，传递的值就是错误的

**代码位置：**
```python
# app.py line 1915-1921
engine_config = EngineSettings(
    QUERY_ENGINE_API_KEY=settings.QUERY_ENGINE_API_KEY,  # 这里的 settings 来自主 config.py
    QUERY_ENGINE_BASE_URL=settings.QUERY_ENGINE_BASE_URL,
    QUERY_ENGINE_MODEL_NAME=settings.QUERY_ENGINE_MODEL_NAME,
    TAVILY_API_KEY=settings.TAVILY_API_KEY,
    OUTPUT_DIR="query_engine_streamlit_reports"
)
```

## 🔧 解决方案

### 方案 1: 重启服务（最简单）

```bash
# 重启服务以重新加载配置
sudo systemctl restart bettafish

# 或如果使用 Docker
docker restart bettafish-container
```

### 方案 2: 检查并清理环境变量

```bash
# 1. 检查是否有环境变量覆盖
env | grep -E "QUERY_ENGINE|MEDIA_ENGINE"

# 2. 如果有，取消设置（在 systemd service 文件中）
sudo systemctl edit bettafish
# 删除或注释掉 Environment= 行中的相关变量

# 3. 重启服务
sudo systemctl restart bettafish
```

### 方案 3: 验证配置加载

创建一个测试脚本 `test_config_loading.py`：

```python
#!/usr/bin/env python3
"""测试配置加载"""

import sys
from pathlib import Path

# 添加项目路径
project_root = Path(__file__).resolve().parent / "BettaFish-main"
sys.path.insert(0, str(project_root))

from config import settings

print("=" * 60)
print("配置检查")
print("=" * 60)
print(f"QUERY_ENGINE_API_KEY: {settings.QUERY_ENGINE_API_KEY[:20] if settings.QUERY_ENGINE_API_KEY else 'None'}...")
print(f"MEDIA_ENGINE_API_KEY: {settings.MEDIA_ENGINE_API_KEY[:20] if settings.MEDIA_ENGINE_API_KEY else 'None'}...")
print(f"QUERY_ENGINE_BASE_URL: {settings.QUERY_ENGINE_BASE_URL}")
print(f"MEDIA_ENGINE_BASE_URL: {settings.MEDIA_ENGINE_BASE_URL}")
print(f"QUERY_ENGINE_MODEL_NAME: {settings.QUERY_ENGINE_MODEL_NAME}")
print(f"MEDIA_ENGINE_MODEL_NAME: {settings.MEDIA_ENGINE_MODEL_NAME}")
print("=" * 60)

# 检查 .env 文件
env_file = Path(".env")
if env_file.exists():
    print(f"\n.env 文件存在: {env_file.absolute()}")
    with open(env_file) as f:
        lines = f.readlines()
        for line in lines:
            if "QUERY_ENGINE_API_KEY" in line or "MEDIA_ENGINE_API_KEY" in line:
                print(f"  {line.strip()}")
else:
    print(f"\n.env 文件不存在于: {env_file.absolute()}")
```

运行：

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main
python3 test_config_loading.py
```

### 方案 4: 强制重新加载配置

如果服务正在运行，可以添加一个重新加载配置的 API 端点，或者直接重启服务。

## 🚀 快速修复步骤

### 步骤 1: 确认 .env 文件内容

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main
grep -E "QUERY_ENGINE_API_KEY|MEDIA_ENGINE_API_KEY" .env
```

### 步骤 2: 确认 API Key 格式

确保 .env 文件中没有多余的空格或引号：

```env
# 正确格式
QUERY_ENGINE_API_KEY=d21f186794bc4232ac09f1cfdb7b92e6.2fLNtg6XZNm2JMDw
MEDIA_ENGINE_API_KEY=d21f186794bc4232ac09f1cfdb7b92e6.2fLNtg6XZNm2JMDw

# 错误格式（不要这样）
QUERY_ENGINE_API_KEY="d21f186794bc4232ac09f1cfdb7b92e6.2fLNtg6XZNm2JMDw"  # 有引号
QUERY_ENGINE_API_KEY = d21f186794bc4232ac09f1cfdb7b92e6.2fLNtg6XZNm2JMDw  # 等号前后有空格
```

### 步骤 3: 重启服务

```bash
sudo systemctl restart bettafish
```

### 步骤 4: 验证配置已加载

```bash
# 检查服务日志
sudo journalctl -u bettafish -n 50 --no-pager | grep -E "API_KEY|使用LLM"
```

## 📝 调试命令

### 检查配置加载

```bash
# 方法 1: 使用 Python 直接检查
cd /home/bettafish/Public_Opinion/BettaFish-main
python3 << 'EOF'
from config import settings
print("QUERY_ENGINE_API_KEY:", settings.QUERY_ENGINE_API_KEY[:30] if settings.QUERY_ENGINE_API_KEY else "None")
print("MEDIA_ENGINE_API_KEY:", settings.MEDIA_ENGINE_API_KEY[:30] if settings.MEDIA_ENGINE_API_KEY else "None")
EOF

# 方法 2: 检查环境变量
printenv | grep -E "QUERY_ENGINE|MEDIA_ENGINE"

# 方法 3: 检查 .env 文件
cat .env | grep -E "QUERY_ENGINE_API_KEY|MEDIA_ENGINE_API_KEY"
```

### 检查服务状态

```bash
# 检查服务是否运行
sudo systemctl status bettafish

# 查看服务日志
sudo journalctl -u bettafish -f

# 查看最近的错误
sudo journalctl -u bettafish -n 100 --no-pager | grep -i error
```

## ⚠️ 重要提示

1. **配置更改后必须重启服务**
   - pydantic-settings 在模块导入时加载配置
   - 修改 .env 文件后，需要重启 Python 进程才能生效

2. **检查环境变量优先级**
   - 系统环境变量会覆盖 .env 文件
   - 确保没有设置冲突的环境变量

3. **验证 API Key 格式**
   - 确保没有多余的空格、引号或特殊字符
   - 确保等号前后没有空格

4. **检查文件路径**
   - 确保 .env 文件在正确的位置
   - 确保服务的工作目录正确

