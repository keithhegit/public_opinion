# 检查 Git 状态和部署 Forum Engine 功能

## 🔍 需要检查的事项

### 1. 检查服务器上的 Git 状态

在服务器上执行：

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main
git status
```

### 2. 检查服务器上的文件是否包含按钮代码

```bash
# 检查服务器上的文件
grep -n "forumDownloadBtn" /home/bettafish/Public_Opinion/BettaFish-main/templates/index.html

# 如果返回空，说明服务器上的文件没有更新
```

### 3. 如果服务器上的文件没有更新

需要：
1. 提交本地更改到 git
2. 推送到远程仓库
3. 在服务器上拉取最新代码
4. 重启服务

---

## 📝 操作步骤

### Step 1: 检查本地 Git 状态（在本地 Windows 机器）

```bash
cd BettaFish-main
git status
git diff templates/index.html
```

### Step 2: 如果文件已修改但未提交

```bash
# 添加更改
git add templates/index.html app.py

# 提交
git commit -m "Add Forum Engine log viewing and download functionality"

# 推送到远程
git push
```

### Step 3: 在服务器上拉取最新代码

```bash
# SSH 到服务器
ssh ubuntu@14.136.93.109

# 切换到项目目录
cd /home/bettafish/Public_Opinion/BettaFish-main

# 拉取最新代码
sudo -u bettafish git pull

# 或者如果使用 root
git pull
```

### Step 4: 重启服务

```bash
sudo systemctl restart bettafish
```

---

## 🔍 关于按钮显示的问题

**按钮不需要启动搜索才显示**。按钮是在 HTML 中直接定义的，应该在页面加载时就显示。

如果按钮不显示，可能的原因：
1. **服务器上的文件没有更新**（最可能）
2. **浏览器缓存**（已尝试强制刷新）
3. **CSS 样式问题**（按钮被隐藏）

---

## ✅ 快速验证命令（在服务器上执行）

```bash
# 1. 检查文件是否包含按钮代码
grep -c "forumDownloadBtn" /home/bettafish/Public_Opinion/BettaFish-main/templates/index.html
# 应该返回 2（定义 + 事件监听器）

# 2. 检查文件修改时间
ls -la /home/bettafish/Public_Opinion/BettaFish-main/templates/index.html

# 3. 检查 git 状态
cd /home/bettafish/Public_Opinion/BettaFish-main
git status
git log --oneline -5
```

