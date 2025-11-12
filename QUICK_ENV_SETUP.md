# 快速环境变量配置指南

## 🎯 从Railway迁移的6个环境变量

需要配置的API密钥：

1. `BOCHA_WEB_SEARCH_API_KEY` - Bocha搜索API密钥
2. `INSIGHT_ENGINE_API_KEY` - Insight Engine LLM API密钥
3. `MEDIA_ENGINE_API_KEY` - Media Engine LLM API密钥
4. `QUERY_ENGINE_API_KEY` - Query Engine LLM API密钥
5. `REPORT_ENGINE_API_KEY` - Report Engine LLM API密钥
6. `TAVILY_API_KEY` - Tavily搜索API密钥

---

## 🚀 快速配置（3步）

### Step 1: 创建.env文件

在 `BettaFish-main/` 目录下创建 `.env` 文件：

```bash
cd BettaFish-main
nano .env
```

### Step 2: 填写环境变量

将以下内容复制到 `.env` 文件，替换为实际的API密钥：

```env
# 搜索 API Keys
BOCHA_WEB_SEARCH_API_KEY=你的Bocha_API_Key
TAVILY_API_KEY=你的Tavily_API_Key

# LLM API Keys
INSIGHT_ENGINE_API_KEY=你的Gemini_API_Key
MEDIA_ENGINE_API_KEY=你的Gemini_API_Key
QUERY_ENGINE_API_KEY=你的Gemini_API_Key
REPORT_ENGINE_API_KEY=你的Gemini_API_Key

# 服务器配置
HOST=0.0.0.0
PORT=5000

# Python环境配置
PYTHONIOENCODING=utf-8
PYTHONUTF8=1
PYTHONUNBUFFERED=1
```

### Step 3: 设置文件权限

```bash
chmod 600 .env
```

---

## 🐳 Docker部署

### 使用docker-compose（推荐）

```bash
cd BettaFish-main
docker-compose up -d
```

**已更新**: `docker-compose.yml` 已配置 `env_file: - .env`，会自动加载.env文件。

### 验证环境变量

```bash
# 检查环境变量是否加载
docker exec bettafish env | grep API_KEY
```

---

## 🖥️ 云主机部署

### 使用systemd服务

`.env` 文件已配置在 `bettafish.service` 中：

```ini
EnvironmentFile=/home/bettafish/Public_Opinion/BettaFish-main/.env
```

重启服务：

```bash
sudo systemctl restart bettafish
```

### 验证环境变量

```bash
# 检查服务环境变量
sudo systemctl show bettafish | grep EnvironmentFile

# 检查应用日志
sudo journalctl -u bettafish | grep "API Key"
```

---

## ✅ 验证清单

- [ ] `.env` 文件已创建
- [ ] 所有6个API密钥已填写
- [ ] 文件权限设置为600
- [ ] Docker/云主机已重启
- [ ] 环境变量已验证

---

## 📚 详细文档

查看 `ENV_VARS_DEPLOYMENT_GUIDE.md` 获取更详细的配置说明。

---

**配置完成后，重启服务即可！** 🎉

