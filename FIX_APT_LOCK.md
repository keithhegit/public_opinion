# 修复 apt 锁文件问题

## 问题
另一个 apt 进程正在运行，占用了锁文件。

## 解决步骤

### 1. 检查是否有 apt 进程在运行

```bash
ps aux | grep apt
```

### 2. 查看占用锁文件的进程

```bash
sudo lsof /var/lib/dpkg/lock-frontend
sudo lsof /var/lib/apt/lists/lock
```

### 3. 等待进程完成（推荐）

如果看到有 `apt` 或 `apt-get` 进程在运行，最好等待它们完成：

```bash
# 监控进程
watch -n 1 'ps aux | grep -E "apt|dpkg" | grep -v grep'
```

按 `Ctrl+C` 退出监控。

### 4. 如果进程卡住了，终止它

**⚠️ 警告：只有在确认进程卡住时才执行此操作**

```bash
# 查看进程详情
ps aux | grep 1361988

# 如果确认是卡住的进程，终止它
sudo kill -9 1361988

# 或者终止所有 apt 相关进程
sudo killall apt apt-get dpkg
```

### 5. 清理锁文件（仅在进程已终止后）

```bash
sudo rm /var/lib/dpkg/lock-frontend
sudo rm /var/lib/apt/lists/lock
sudo rm /var/cache/apt/archives/lock
sudo dpkg --configure -a
```

### 6. 重新执行 Playwright 依赖安装

```bash
sudo /home/bettafish/Public_Opinion/BettaFish-main/venv/bin/playwright install-deps
```

---

## 快速解决方案（如果确认没有重要进程在运行）

```bash
# 1. 检查进程
ps aux | grep -E "apt|dpkg" | grep -v grep

# 2. 如果没有重要进程，清理锁文件
sudo rm -f /var/lib/dpkg/lock-frontend
sudo rm -f /var/lib/apt/lists/lock
sudo rm -f /var/cache/apt/archives/lock
sudo dpkg --configure -a

# 3. 重新安装
sudo /home/bettafish/Public_Opinion/BettaFish-main/venv/bin/playwright install-deps
```

