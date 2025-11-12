# 香港Ubuntu主机一键部署指南

## 🚀 快速部署（3步完成）

### Step 1: 连接到主机

在你的本地终端执行：

```bash
ssh ubuntu@14.136.93.109
```

### Step 2: 上传并执行部署脚本

**方法A: 直接创建脚本（推荐）**

连接后，在主机上执行：

```bash
# 创建脚本文件
cat > /tmp/deploy.sh << 'SCRIPT_EOF'
# 将完整的脚本内容粘贴到这里
SCRIPT_EOF

# 或者使用wget/curl从GitHub下载（如果已上传）
# wget https://raw.githubusercontent.com/your-repo/deploy-hk-ubuntu.sh
# 或
# curl -O https://raw.githubusercontent.com/your-repo/deploy-hk-ubuntu.sh
```

**方法B: 使用scp上传（从本地）**

在你的本地终端（新开一个，保持SSH连接）执行：

```bash
# 从本地Windows上传脚本到远程主机
scp BettaFish-main/deploy-hk-ubuntu.sh ubuntu@14.136.93.109:/tmp/
```

然后在SSH会话中：

```bash
sudo bash /tmp/deploy-hk-ubuntu.sh
```

### Step 3: 填写API密钥

脚本执行完成后，会提示你编辑.env文件：

```bash
sudo nano /home/bettafish/Public_Opinion/BettaFish-main/.env
```

**填写以下6个API密钥**（从Railway迁移）：

```env
BOCHA_WEB_SEARCH_API_KEY=你的Bocha_API_Key
TAVILY_API_KEY=你的Tavily_API_Key
INSIGHT_ENGINE_API_KEY=你的Gemini_API_Key
MEDIA_ENGINE_API_KEY=你的Gemini_API_Key
QUERY_ENGINE_API_KEY=你的Gemini_API_Key
REPORT_ENGINE_API_KEY=你的Gemini_API_Key
```

**保存**: `Ctrl+X`, 然后 `Y`, 然后 `Enter`

---

## ✅ 启动服务

填写完API密钥后，启动服务：

```bash
sudo systemctl start bettafish
sudo systemctl status bettafish
```

---

## 🧪 验证部署

### 1. 检查服务状态

```bash
sudo systemctl status bettafish
```

应该显示 `Active: active (running)`

### 2. 测试API

```bash
# 本地测试
curl http://localhost:5000/api/health

# 外部测试（从你的电脑）
curl http://14.136.93.109/api/health
```

### 3. 查看日志

```bash
sudo journalctl -u bettafish -f
```

### 4. 访问Web界面

在浏览器中打开: **http://14.136.93.109**

---

## 📋 脚本功能

部署脚本会自动完成：

- ✅ 安装系统依赖（Python、Nginx、Supervisor等）
- ✅ 创建应用用户（bettafish）
- ✅ 克隆代码仓库
- ✅ 创建Python虚拟环境
- ✅ 安装Python依赖
- ✅ 安装Playwright浏览器
- ✅ 创建必要的目录
- ✅ 创建.env文件模板
- ✅ 配置systemd服务
- ✅ 配置Nginx反向代理
- ✅ 配置防火墙

---

## 🔧 故障排查

### 问题1: 脚本执行失败

```bash
# 查看详细错误
bash -x /tmp/deploy-hk-ubuntu.sh

# 检查权限
ls -l /tmp/deploy-hk-ubuntu.sh
chmod +x /tmp/deploy-hk-ubuntu.sh
```

### 问题2: Git克隆失败

```bash
# 检查网络连接
ping github.com

# 手动克隆
sudo -u bettafish git clone <your-repo-url> /home/bettafish/Public_Opinion
```

### 问题3: 服务无法启动

```bash
# 检查.env文件
sudo cat /home/bettafish/Public_Opinion/BettaFish-main/.env

# 检查日志
sudo journalctl -u bettafish -n 50

# 手动测试
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && source venv/bin/activate && python app.py"
```

---

## 📝 后续更新

更新代码：

```bash
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && git pull origin main"
sudo systemctl restart bettafish
```

或使用更新脚本：

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main
sudo ./update.sh
```

---

**开始部署吧！** 🚀

