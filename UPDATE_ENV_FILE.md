# 更新 .env 文件中的 Bocha API Key

## 📝 需要更新的环境变量

在 `BettaFish-main/.env` 文件中，找到以下行并更新：

```env
BOCHA_WEB_SEARCH_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd
```

或者如果使用的是 `BOCHA_API_KEY`：

```env
BOCHA_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd
```

## 🔍 查找 .env 文件位置

`.env` 文件应该在以下位置：
- `BettaFish-main/.env`

## ✏️ 编辑步骤

### 方法 1: 使用文本编辑器

1. 打开 `BettaFish-main/.env` 文件
2. 找到 `BOCHA_WEB_SEARCH_API_KEY` 或 `BOCHA_API_KEY` 行
3. 更新为：`BOCHA_WEB_SEARCH_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd`
4. 保存文件

### 方法 2: 使用命令行（Linux/Mac）

```bash
cd BettaFish-main
nano .env
# 或
vim .env
```

找到并修改：
```
BOCHA_WEB_SEARCH_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd
```

### 方法 3: 使用 PowerShell（Windows）

```powershell
cd BettaFish-main
notepad .env
```

## ✅ 验证更新

更新后，重启应用以加载新的环境变量：

```bash
# 如果使用 systemd
sudo systemctl restart bettafish

# 如果使用 Docker
docker-compose restart

# 如果直接运行
# 停止当前进程，然后重新启动
```

## 📋 完整的 .env 文件示例

如果 `.env` 文件不存在，可以创建新文件，内容如下：

```env
# Bocha AI Search API
BOCHA_WEB_SEARCH_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd

# 其他必需的 API Keys
TAVILY_API_KEY=你的Tavily_API_Key
INSIGHT_ENGINE_API_KEY=你的GLM_API_Key
MEDIA_ENGINE_API_KEY=你的GLM_API_Key
QUERY_ENGINE_API_KEY=你的GLM_API_Key
REPORT_ENGINE_API_KEY=你的GLM_API_Key

# 服务器配置
HOST=0.0.0.0
PORT=5000

# Python环境配置
PYTHONIOENCODING=utf-8
PYTHONUTF8=1
PYTHONUNBUFFERED=1
```

完整的模板文件已保存在：`BettaFish-main/.env.template`

