# 环境变量交付配置指南

## 📋 需要配置的环境变量

从Railway迁移的6个必需环境变量：

1. `BOCHA_WEB_SEARCH_API_KEY` - Bocha搜索API密钥
2. `INSIGHT_ENGINE_API_KEY` - Insight Engine LLM API密钥
3. `MEDIA_ENGINE_API_KEY` - Media Engine LLM API密钥
4. `QUERY_ENGINE_API_KEY` - Query Engine LLM API密钥
5. `REPORT_ENGINE_API_KEY` - Report Engine LLM API密钥
6. `TAVILY_API_KEY` - Tavily搜索API密钥

---

## 🐳 方式1: Docker容器部署

### 方法1A: 使用.env文件（推荐）

#### Step 1: 创建.env文件

在项目根目录 `BettaFish-main/` 创建 `.env` 文件：

```env
# ============================================
# 必需的环境变量（从Railway迁移）
# ============================================

# 搜索 API Keys
BOCHA_WEB_SEARCH_API_KEY=你的Bocha_API_Key
TAVILY_API_KEY=你的Tavily_API_Key

# LLM API Keys
INSIGHT_ENGINE_API_KEY=你的Gemini_API_Key
MEDIA_ENGINE_API_KEY=你的Gemini_API_Key
QUERY_ENGINE_API_KEY=你的Gemini_API_Key
REPORT_ENGINE_API_KEY=你的Gemini_API_Key

# ============================================
# 服务器配置
# ============================================
HOST=0.0.0.0
PORT=5000

# ============================================
# Python环境配置
# ============================================
PYTHONIOENCODING=utf-8
PYTHONUTF8=1
PYTHONUNBUFFERED=1
```

#### Step 2: 更新docker-compose.yml

修改 `BettaFish-main/docker-compose.yml`：

```yaml
version: "3.9"

services:
  bettafish:
    image: ghcr.io/666ghj/bettafish:latest
    container_name: bettafish
    restart: unless-stopped
    env_file:
      - .env  # 加载.env文件中的所有环境变量
    environment:
      - PYTHONUNBUFFERED=1
      - STREAMLIT_SERVER_ENABLE_FILE_WATCHER=false
    ports:
      - "5000:5000"
      - "8501:8501"
      - "8502:8502"
      - "8503:8503"
    volumes:
      - ./logs:/app/logs
      - ./final_reports:/app/final_reports
      - ./insight_engine_streamlit_reports:/app/insight_engine_streamlit_reports
      - ./media_engine_streamlit_reports:/app/media_engine_streamlit_reports
      - ./query_engine_streamlit_reports:/app/query_engine_streamlit_reports
```

#### Step 3: 启动容器

```bash
cd BettaFish-main
docker-compose up -d
```

**验证环境变量**:
```bash
docker exec bettafish env | grep API_KEY
```

---

### 方法1B: 直接在docker-compose.yml中配置

如果不想使用.env文件，可以直接在docker-compose.yml中配置：

```yaml
version: "3.9"

services:
  bettafish:
    image: ghcr.io/666ghj/bettafish:latest
    container_name: bettafish
    restart: unless-stopped
    environment:
      - PYTHONUNBUFFERED=1
      - STREAMLIT_SERVER_ENABLE_FILE_WATCHER=false
      # 必需的环境变量
      - BOCHA_WEB_SEARCH_API_KEY=你的Bocha_API_Key
      - TAVILY_API_KEY=你的Tavily_API_Key
      - INSIGHT_ENGINE_API_KEY=你的Gemini_API_Key
      - MEDIA_ENGINE_API_KEY=你的Gemini_API_Key
      - QUERY_ENGINE_API_KEY=你的Gemini_API_Key
      - REPORT_ENGINE_API_KEY=你的Gemini_API_Key
      # 服务器配置
      - HOST=0.0.0.0
      - PORT=5000
    ports:
      - "5000:5000"
      - "8501:8501"
      - "8502:8502"
      - "8503:8503"
    volumes:
      - ./logs:/app/logs
      - ./final_reports:/app/final_reports
      - ./insight_engine_streamlit_reports:/app/insight_engine_streamlit_reports
      - ./media_engine_streamlit_reports:/app/media_engine_streamlit_reports
      - ./query_engine_streamlit_reports:/app/query_engine_streamlit_reports
```

---

### 方法1C: 使用Docker run命令

```bash
docker run -d \
  --name bettafish \
  --restart unless-stopped \
  -p 5000:5000 \
  -p 8501:8501 \
  -p 8502:8502 \
  -p 8503:8503 \
  --env-file .env \
  -v $(pwd)/logs:/app/logs \
  -v $(pwd)/final_reports:/app/final_reports \
  -v $(pwd)/insight_engine_streamlit_reports:/app/insight_engine_streamlit_reports \
  -v $(pwd)/media_engine_streamlit_reports:/app/media_engine_streamlit_reports \
  -v $(pwd)/query_engine_streamlit_reports:/app/query_engine_streamlit_reports \
  ghcr.io/666ghj/bettafish:latest
```

---

## 🖥️ 方式2: 云主机直接部署（非Docker）

### 方法2A: 使用.env文件（推荐）

#### Step 1: 创建.env文件

在项目根目录 `BettaFish-main/` 创建 `.env` 文件（同上）

#### Step 2: 配置systemd服务

在 `bettafish.service` 中已经配置了 `EnvironmentFile`：

```ini
[Service]
EnvironmentFile=/home/bettafish/Public_Opinion/BettaFish-main/.env
```

这样systemd会自动加载.env文件中的所有环境变量。

#### Step 3: 重启服务

```bash
sudo systemctl restart bettafish
```

**验证环境变量**:
```bash
sudo systemctl show bettafish | grep EnvironmentFile
sudo journalctl -u bettafish | grep "API_KEY"
```

---

### 方法2B: 直接在systemd服务文件中配置

修改 `/etc/systemd/system/bettafish.service`：

```ini
[Service]
Environment="BOCHA_WEB_SEARCH_API_KEY=你的Bocha_API_Key"
Environment="TAVILY_API_KEY=你的Tavily_API_Key"
Environment="INSIGHT_ENGINE_API_KEY=你的Gemini_API_Key"
Environment="MEDIA_ENGINE_API_KEY=你的Gemini_API_Key"
Environment="QUERY_ENGINE_API_KEY=你的Gemini_API_Key"
Environment="REPORT_ENGINE_API_KEY=你的Gemini_API_Key"
Environment="HOST=0.0.0.0"
Environment="PORT=5000"
```

然后重新加载并重启：
```bash
sudo systemctl daemon-reload
sudo systemctl restart bettafish
```

---

## 🔒 安全建议

### 1. .env文件权限

确保.env文件权限正确：

```bash
# 只有所有者可以读写
chmod 600 .env

# 确保文件所有者正确
chown bettafish:bettafish .env
```

### 2. 不要提交.env到Git

确保 `.env` 在 `.gitignore` 中：

```gitignore
.env
.env.local
.env.*.local
```

### 3. 使用.env.example作为模板

创建 `.env.example` 文件（不包含实际密钥）：

```env
# .env.example
BOCHA_WEB_SEARCH_API_KEY=your_bocha_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
INSIGHT_ENGINE_API_KEY=your_gemini_api_key_here
MEDIA_ENGINE_API_KEY=your_gemini_api_key_here
QUERY_ENGINE_API_KEY=your_gemini_api_key_here
REPORT_ENGINE_API_KEY=your_gemini_api_key_here
```

---

## ✅ 验证环境变量

### 在容器中验证

```bash
# 进入容器
docker exec -it bettafish bash

# 检查环境变量
env | grep API_KEY

# 或在Python中检查
python -c "from config import settings; print('INSIGHT:', bool(settings.INSIGHT_ENGINE_API_KEY)); print('TAVILY:', bool(settings.TAVILY_API_KEY))"
```

### 在云主机中验证

```bash
# 检查systemd环境变量
sudo systemctl show bettafish | grep Environment

# 检查应用日志
sudo journalctl -u bettafish | grep "API Key"

# 在Python中检查
cd /home/bettafish/Public_Opinion/BettaFish-main
source venv/bin/activate
python -c "from config import settings; print('INSIGHT:', bool(settings.INSIGHT_ENGINE_API_KEY)); print('TAVILY:', bool(settings.TAVILY_API_KEY))"
```

---

## 📝 配置检查清单

部署前确认：

- [ ] `.env` 文件已创建
- [ ] 所有6个API密钥已填写
- [ ] `.env` 文件权限正确（600）
- [ ] `.env` 文件所有者正确
- [ ] `.env` 已在 `.gitignore` 中
- [ ] docker-compose.yml 或 systemd服务已配置加载.env
- [ ] 环境变量已验证（在容器或服务中）

---

## 🎯 推荐方案

### Docker部署
**推荐**: 使用 `.env` 文件 + `env_file` 配置（方法1A）
- ✅ 安全：密钥不暴露在配置文件中
- ✅ 灵活：易于更新和管理
- ✅ 标准：符合Docker最佳实践

### 云主机部署
**推荐**: 使用 `.env` 文件 + systemd `EnvironmentFile`（方法2A）
- ✅ 安全：密钥不暴露在服务文件中
- ✅ 灵活：易于更新和管理
- ✅ 标准：符合systemd最佳实践

---

## 🔄 更新环境变量

### Docker方式

```bash
# 1. 编辑.env文件
nano BettaFish-main/.env

# 2. 重启容器
docker-compose restart bettafish
# 或
docker restart bettafish
```

### 云主机方式

```bash
# 1. 编辑.env文件
nano /home/bettafish/Public_Opinion/BettaFish-main/.env

# 2. 重启服务
sudo systemctl restart bettafish
```

---

**最后更新**: 2025-11-11
**状态**: ✅ 配置指南完成

