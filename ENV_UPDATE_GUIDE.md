# .env 文件更新指南

## 📝 需要更新的环境变量

在 `BettaFish-main/.env` 文件中，找到并更新以下行：

```env
BOCHA_WEB_SEARCH_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd
```

## 🔍 文件位置

`.env` 文件应该在：
- `BettaFish-main/.env`

## ✏️ 编辑方法

### Windows

1. 打开文件资源管理器
2. 导航到 `BettaFish-main` 目录
3. 右键点击 `.env` 文件
4. 选择"用记事本打开"或使用 VS Code 打开
5. 找到 `BOCHA_WEB_SEARCH_API_KEY` 行
6. 更新为：`BOCHA_WEB_SEARCH_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd`
7. 保存文件

### Linux/Mac

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

## 📋 完整的 .env 文件示例

如果 `.env` 文件不存在，可以创建新文件：

```env
# ============================================
# BettaFish 环境变量配置
# ============================================

# ================== 搜索 API Keys ====================
# Bocha AI Search API（已更新）
BOCHA_WEB_SEARCH_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd

# Tavily API
TAVILY_API_KEY=你的Tavily_API_Key

# ================== LLM API Keys ====================
INSIGHT_ENGINE_API_KEY=你的GLM_API_Key
MEDIA_ENGINE_API_KEY=你的GLM_API_Key
QUERY_ENGINE_API_KEY=你的GLM_API_Key
REPORT_ENGINE_API_KEY=你的GLM_API_Key

# ================== 服务器配置 ====================
HOST=0.0.0.0
PORT=5000

# ================== Python环境配置 ====================
PYTHONIOENCODING=utf-8
PYTHONUTF8=1
PYTHONUNBUFFERED=1
```

## ✅ 验证更新

更新后，重启应用：

```bash
# systemd
sudo systemctl restart bettafish

# Docker
docker-compose restart

# 直接运行
# 停止当前进程，然后重新启动
```

## 🔍 检查环境变量是否加载

```bash
# 在应用启动后，检查日志
# 应该能看到 Bocha API 相关的日志，而不是"API Key未找到"的警告
```

