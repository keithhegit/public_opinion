# 提交并推送 Forum Engine 功能

## 📋 需要提交的文件

根据 git status，以下文件已修改但未提交：

1. ✅ `templates/index.html` - Forum Engine 按钮和日志查看窗口
2. ✅ `app.py` - Forum Engine API 端点
3. ✅ `MediaEngine/tools/search.py` - Bocha API 修复
4. ✅ `MediaEngine/utils/config.py` - Bocha API 配置
5. ✅ `config.py` - 全局配置
6. ✅ `InsightEngine/utils/db.py` - 数据库修复

---

## 🚀 提交和推送步骤

### Step 1: 添加更改的文件

```bash
cd BettaFish-main

# 添加所有修改的文件
git add templates/index.html app.py MediaEngine/tools/search.py MediaEngine/utils/config.py config.py InsightEngine/utils/db.py
```

### Step 2: 提交更改

```bash
git commit -m "Add Forum Engine log viewing/download and fix Bocha API

- Add Forum Engine log viewing modal window
- Add Forum Engine log download functionality
- Fix Bocha API to use AI Search API endpoint
- Update Bocha API response parsing logic
- Fix database connection issues"
```

### Step 3: 推送到远程仓库

```bash
git push
```

---

## 📝 在服务器上拉取并重启

### Step 1: SSH 到服务器

```bash
ssh ubuntu@14.136.93.109
```

### Step 2: 拉取最新代码

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main
sudo -u bettafish git pull
```

### Step 3: 重启服务

```bash
sudo systemctl restart bettafish
```

### Step 4: 验证部署

```bash
# 检查文件是否已更新
grep -n "forumDownloadBtn" /home/bettafish/Public_Opinion/BettaFish-main/templates/index.html

# 应该看到：
# 1185:                        <button class="forum-download-btn" id="forumDownloadBtn" title="下载Forum日志">
# 2441:        document.getElementById('forumDownloadBtn').addEventListener('click', function() {
```

---

## ✅ 完整操作流程

### 在本地（Windows）：

```bash
cd BettaFish-main
git add templates/index.html app.py MediaEngine/tools/search.py MediaEngine/utils/config.py config.py InsightEngine/utils/db.py
git commit -m "Add Forum Engine log viewing/download and fix Bocha API"
git push
```

### 在服务器（Linux）：

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main
sudo -u bettafish git pull
sudo systemctl restart bettafish
```

---

## 🔍 验证步骤

1. **在浏览器中强制刷新** (`Ctrl + Shift + R`)
2. **检查 Forum Engine 按钮下方**是否出现两个小按钮：
   - "下载日志"
   - "查看日志"
3. **测试功能**：
   - 点击 "查看日志" 应该弹出日志窗口
   - 点击 "下载日志" 应该下载日志文件

