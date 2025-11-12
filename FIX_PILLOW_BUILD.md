# Pillow构建失败修复

## 🐛 问题

Pillow构建失败，错误信息：
```
The headers or library files could not be found for jpeg,
a required dependency when compiling Pillow from source.
```

## 🔍 原因

Pillow需要系统级的图像处理库才能从源码编译。这些库在Ubuntu中需要单独安装。

## ✅ 解决方案

### 方法1: 安装系统依赖后重新安装（推荐）

在SSH会话中执行：

```bash
# 安装Pillow编译所需的系统库
sudo apt install -y \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libfreetype6-dev \
    liblcms2-dev \
    libwebp-dev \
    zlib1g-dev \
    libopenjp2-7-dev \
    libimagequant-dev \
    libraqm-dev

# 然后重新安装Python依赖
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && source venv/bin/activate && pip install -r requirements.txt"
```

### 方法2: 只安装Pillow（如果其他包已安装）

```bash
# 安装系统依赖
sudo apt install -y libjpeg-dev libpng-dev libtiff-dev libfreetype6-dev zlib1g-dev

# 只重新安装Pillow
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && source venv/bin/activate && pip install Pillow==9.5.0"
```

---

## 📝 已更新部署脚本

我已经更新了 `deploy-hk-ubuntu.sh`，在步骤1中添加了这些系统依赖的安装。

如果你重新运行脚本，会自动安装这些依赖。

---

## 🚀 立即修复

**在SSH会话中执行**：

```bash
# 1. 安装系统依赖
sudo apt install -y libjpeg-dev libpng-dev libtiff-dev libfreetype6-dev liblcms2-dev libwebp-dev zlib1g-dev libopenjp2-7-dev libimagequant-dev libraqm-dev

# 2. 重新安装Python依赖
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && source venv/bin/activate && pip install -r requirements.txt"
```

执行后，Pillow应该能正常构建和安装。

