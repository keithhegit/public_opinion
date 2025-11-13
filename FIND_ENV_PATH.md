# 查找 .env 文件的具体路径

## 📍 根据部署脚本，项目路径应该是：

```bash
/home/bettafish/Public_Opinion/BettaFish-main/.env
```

## 🔍 查找命令

### 方法 1: 直接检查 bettafish 用户目录

```bash
ls -la /home/bettafish/Public_Opinion/BettaFish-main/.env
```

### 方法 2: 如果不存在，检查 ubuntu 用户目录

```bash
ls -la /home/ubuntu/Public_Opinion/BettaFish-main/.env
```

### 方法 3: 全局搜索所有 .env 文件

```bash
sudo find /home -name ".env" -type f 2>/dev/null
```

### 方法 4: 检查 systemd 服务配置（会显示 .env 路径）

```bash
sudo systemctl show bettafish | grep EnvironmentFile
```

### 方法 5: 检查项目目录是否存在

```bash
# 检查 bettafish 用户目录
ls -la /home/bettafish/Public_Opinion/BettaFish-main/ 2>/dev/null

# 检查 ubuntu 用户目录
ls -la /home/ubuntu/Public_Opinion/BettaFish-main/ 2>/dev/null
```

---

## ✏️ 编辑命令（根据找到的路径）

### 如果文件在 bettafish 用户目录：

```bash
sudo nano /home/bettafish/Public_Opinion/BettaFish-main/.env
```

### 如果文件在 ubuntu 用户目录：

```bash
nano /home/ubuntu/Public_Opinion/BettaFish-main/.env
```

### 如果需要切换用户：

```bash
sudo su - bettafish
cd Public_Opinion/BettaFish-main
nano .env
```

