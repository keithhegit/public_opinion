# 查找 .env 文件位置

## 🔍 查找命令

### 方法 1: 查找所有 .env 文件

```bash
find ~ -name ".env" -type f 2>/dev/null
```

### 方法 2: 查找 BettaFish 相关目录

```bash
find ~ -type d -name "*BettaFish*" 2>/dev/null
```

### 方法 3: 查找项目根目录

```bash
# 查看当前目录
pwd

# 查看当前目录下的所有文件和文件夹
ls -la

# 查找包含 .env 的目录
find . -name ".env" -type f 2>/dev/null
```

### 方法 4: 如果项目在特定位置

```bash
# 检查常见位置
ls -la ~/Public_Opinion/
ls -la ~/BettaFish/
ls -la /home/bettafish/Public_Opinion/BettaFish-main/
```

---

## 📝 找到后编辑

找到 .env 文件后，使用完整路径：

```bash
nano /完整/路径/到/.env
```

例如：
```bash
nano ~/Public_Opinion/BettaFish-main/.env
# 或
nano /home/bettafish/Public_Opinion/BettaFish-main/.env
```

