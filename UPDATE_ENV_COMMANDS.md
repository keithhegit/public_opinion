# 更新 .env 文件的命令

## 🚀 快速更新（推荐）

### 方法 1: 使用更新脚本（推荐）

```bash
chmod +x update_env_commands.sh
./update_env_commands.sh
```

### 方法 2: 一行命令更新

```bash
# 如果 .env 文件已存在，更新或添加 BOCHA_WEB_SEARCH_API_KEY
cd BettaFish-main && \
if grep -q "^BOCHA_WEB_SEARCH_API_KEY=" .env 2>/dev/null; then \
  sed -i "s|^BOCHA_WEB_SEARCH_API_KEY=.*|BOCHA_WEB_SEARCH_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd|" .env; \
else \
  echo "BOCHA_WEB_SEARCH_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd" >> .env; \
fi && \
echo "[SUCCESS] API Key 已更新" && \
grep "BOCHA_WEB_SEARCH_API_KEY" .env
```

---

## 📝 手动更新命令

### 1. 检查 .env 文件是否存在

```bash
cd BettaFish-main
ls -la .env
```

### 2. 如果文件存在，更新 API Key

```bash
# Linux
sed -i "s|^BOCHA_WEB_SEARCH_API_KEY=.*|BOCHA_WEB_SEARCH_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd|" .env

# 或者如果使用的是 BOCHA_API_KEY
sed -i "s|^BOCHA_API_KEY=.*|BOCHA_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd|" .env
```

### 3. 如果文件不存在，创建并添加

```bash
cd BettaFish-main
cat >> .env << 'EOF'
# Bocha AI Search API
BOCHA_WEB_SEARCH_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd
EOF
```

### 4. 验证更新

```bash
# 查看更新后的内容
grep "BOCHA" .env

# 或者查看整个文件
cat .env
```

---

## 🔧 使用 nano 编辑器（交互式）

```bash
cd BettaFish-main
nano .env
```

在编辑器中：
1. 找到 `BOCHA_WEB_SEARCH_API_KEY` 行
2. 更新为：`BOCHA_WEB_SEARCH_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd`
3. 按 `Ctrl+O` 保存
4. 按 `Ctrl+X` 退出

---

## ✅ 验证更新

```bash
# 检查 API Key 是否正确设置
cd BettaFish-main
grep "BOCHA_WEB_SEARCH_API_KEY" .env

# 应该看到：
# BOCHA_WEB_SEARCH_API_KEY=sk-f2d544f236214b4fb8d090861176e3dd
```

---

## 🔄 重启应用以加载新配置

```bash
# 如果使用 systemd
sudo systemctl restart bettafish

# 如果使用 Docker
cd BettaFish-main
docker-compose restart

# 检查服务状态
sudo systemctl status bettafish
```

