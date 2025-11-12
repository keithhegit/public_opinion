# 香港Ubuntu主机部署指南

## 📋 主机信息

- **IP地址**: 14.136.93.109
- **系统**: Ubuntu
- **用户名**: ubuntu
- **部署方式**: 云主机直接部署（非Docker）

---

## 🚀 快速部署步骤

### Step 1: 连接到主机

```bash
ssh ubuntu@14.136.93.109
```

如果是首次连接，会提示确认主机指纹，输入 `yes`。

---

### Step 2: 安装基础依赖

```bash
# 更新系统
sudo apt update
sudo apt upgrade -y

# 安装必需软件
sudo apt install -y python3 python3-pip python3-venv git nginx supervisor
```

---

### Step 3: 创建应用用户（可选但推荐）

```bash
# 创建专用用户
sudo useradd -m -s /bin/bash bettafish

# 切换到应用用户
sudo su - bettafish
```

---

### Step 4: 克隆代码

```bash
# 在应用用户目录下
cd ~
git clone <your-repo-url> Public_Opinion
cd Public_Opinion/BettaFish-main
```

**注意**: 替换 `<your-repo-url>` 为实际的Git仓库地址。

---

### Step 5: 创建虚拟环境

```bash
python3 -m venv venv
source venv/bin/activate
```

---

### Step 6: 安装Python依赖

```bash
# 升级pip
pip install --upgrade pip

# 安装依赖
pip install -r requirements.txt

# 安装Playwright浏览器（如果需要）
playwright install chromium
playwright install-deps
```

---

### Step 7: 配置环境变量

```bash
# 创建.env文件
nano .env
```

**填写以下内容**（替换为实际的API密钥）：

```env
# 搜索 API Keys
BOCHA_WEB_SEARCH_API_KEY=你的Bocha_API_Key
TAVILY_API_KEY=你的Tavily_API_Key

# LLM API Keys
INSIGHT_ENGINE_API_KEY=你的Gemini_API_Key
MEDIA_ENGINE_API_KEY=你的Gemini_API_Key
QUERY_ENGINE_API_KEY=你的Gemini_API_Key
REPORT_ENGINE_API_KEY=你的Gemini_API_Key

# 服务器配置
HOST=0.0.0.0
PORT=5000

# Python环境配置
PYTHONIOENCODING=utf-8
PYTHONUTF8=1
PYTHONUNBUFFERED=1
```

**保存并退出**: `Ctrl+X`, 然后 `Y`, 然后 `Enter`

**设置文件权限**:
```bash
chmod 600 .env
```

---

### Step 8: 创建必要的目录

```bash
mkdir -p logs final_reports insight_engine_streamlit_reports media_engine_streamlit_reports query_engine_streamlit_reports
```

---

### Step 9: 配置systemd服务

```bash
# 退出应用用户，回到ubuntu用户
exit

# 创建systemd服务文件
sudo nano /etc/systemd/system/bettafish.service
```

**填写以下内容**（根据实际路径调整）：

```ini
[Unit]
Description=BettaFish Flask Application
After=network.target

[Service]
Type=simple
User=bettafish
Group=bettafish
WorkingDirectory=/home/bettafish/Public_Opinion/BettaFish-main
Environment="PATH=/home/bettafish/Public_Opinion/BettaFish-main/venv/bin"
EnvironmentFile=/home/bettafish/Public_Opinion/BettaFish-main/.env
ExecStart=/home/bettafish/Public_Opinion/BettaFish-main/venv/bin/python app.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

**保存并退出**: `Ctrl+X`, 然后 `Y`, 然后 `Enter`

---

### Step 10: 启用并启动服务

```bash
# 重新加载systemd配置
sudo systemctl daemon-reload

# 启用服务（开机自启）
sudo systemctl enable bettafish

# 启动服务
sudo systemctl start bettafish

# 检查状态
sudo systemctl status bettafish
```

---

### Step 11: 配置Nginx反向代理

```bash
# 创建Nginx配置
sudo nano /etc/nginx/sites-available/bettafish
```

**填写以下内容**:

```nginx
server {
    listen 80;
    server_name 14.136.93.109;  # 或你的域名

    # 日志配置
    access_log /var/log/nginx/bettafish-access.log;
    error_log /var/log/nginx/bettafish-error.log;

    # 客户端最大请求体大小
    client_max_body_size 100M;

    # 超时设置
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;

    # 代理到Flask应用
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # 缓冲设置
        proxy_buffering off;
        proxy_request_buffering off;
    }

    # 静态文件
    location /static {
        alias /home/bettafish/Public_Opinion/BettaFish-main/static;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

**保存并退出**: `Ctrl+X`, 然后 `Y`, 然后 `Enter`

**启用配置**:
```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/bettafish /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

---

### Step 12: 配置防火墙

```bash
# 允许SSH（如果还没允许）
sudo ufw allow 22/tcp

# 允许HTTP和HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 启用防火墙
sudo ufw enable

# 检查状态
sudo ufw status
```

---

## ✅ 验证部署

### 1. 检查服务状态

```bash
sudo systemctl status bettafish
```

应该显示 `Active: active (running)`

### 2. 检查日志

```bash
# 查看实时日志
sudo journalctl -u bettafish -f

# 查看最近100行日志
sudo journalctl -u bettafish -n 100
```

### 3. 测试API

```bash
# 本地测试
curl http://localhost:5000/api/health

# 外部测试（从你的电脑）
curl http://14.136.93.109/api/health
```

### 4. 测试Web界面

在浏览器中访问: `http://14.136.93.109`

---

## 🔄 更新部署

### 方法1: 使用更新脚本

```bash
cd ~/Public_Opinion/BettaFish-main
sudo ./update.sh
```

### 方法2: 手动更新

```bash
# 切换到应用用户
sudo su - bettafish

# 切换到项目目录
cd ~/Public_Opinion/BettaFish-main

# 激活虚拟环境
source venv/bin/activate

# 拉取最新代码
git pull origin main

# 更新依赖（如果有新依赖）
pip install -r requirements.txt

# 退出应用用户
exit

# 重启服务
sudo systemctl restart bettafish
```

---

## 📝 常用命令

### 服务管理

```bash
# 启动服务
sudo systemctl start bettafish

# 停止服务
sudo systemctl stop bettafish

# 重启服务
sudo systemctl restart bettafish

# 查看状态
sudo systemctl status bettafish

# 查看日志
sudo journalctl -u bettafish -f
```

### Nginx管理

```bash
# 重启Nginx
sudo systemctl restart nginx

# 重新加载配置（不中断服务）
sudo systemctl reload nginx

# 测试配置
sudo nginx -t

# 查看日志
sudo tail -f /var/log/nginx/bettafish-access.log
sudo tail -f /var/log/nginx/bettafish-error.log
```

---

## 🔍 故障排查

### 问题1: 服务无法启动

```bash
# 查看详细日志
sudo journalctl -u bettafish -n 100

# 检查环境变量
sudo systemctl show bettafish | grep EnvironmentFile

# 检查端口占用
sudo netstat -tlnp | grep 5000
```

### 问题2: 502 Bad Gateway

```bash
# 检查Flask应用是否运行
curl http://127.0.0.1:5000/api/health

# 检查Nginx配置
sudo nginx -t

# 查看Nginx错误日志
sudo tail -f /var/log/nginx/bettafish-error.log
```

### 问题3: 环境变量未加载

```bash
# 检查.env文件是否存在
ls -la /home/bettafish/Public_Opinion/BettaFish-main/.env

# 检查文件权限
ls -l /home/bettafish/Public_Opinion/BettaFish-main/.env

# 检查systemd配置
sudo systemctl show bettafish | grep EnvironmentFile

# 手动测试环境变量
sudo -u bettafish bash -c "source /home/bettafish/Public_Opinion/BettaFish-main/.env && env | grep API_KEY"
```

---

## 🔒 安全建议

### 1. SSH密钥认证

```bash
# 在本地生成SSH密钥（如果还没有）
ssh-keygen -t rsa -b 4096

# 复制公钥到服务器
ssh-copy-id ubuntu@14.136.93.109

# 在服务器上禁用密码登录（可选）
sudo nano /etc/ssh/sshd_config
# 设置: PasswordAuthentication no
sudo systemctl restart sshd
```

### 2. 配置HTTPS（推荐）

```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取SSL证书（如果有域名）
sudo certbot --nginx -d your-domain.com

# 自动续期（已自动配置）
```

### 3. 定期更新

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 更新应用代码
cd ~/Public_Opinion/BettaFish-main
git pull origin main
```

---

## 📊 监控和维护

### 查看资源使用

```bash
# CPU和内存
htop

# 磁盘使用
df -h

# 服务状态
systemctl status bettafish nginx
```

### 日志管理

```bash
# 配置日志轮转
sudo nano /etc/logrotate.d/bettafish
```

内容：
```
/home/bettafish/Public_Opinion/BettaFish-main/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0644 bettafish bettafish
}
```

---

## ✅ 部署检查清单

- [ ] 系统依赖已安装
- [ ] 代码已克隆
- [ ] 虚拟环境已创建
- [ ] Python依赖已安装
- [ ] `.env` 文件已创建并配置
- [ ] 文件权限已设置（600）
- [ ] systemd服务已配置
- [ ] 服务已启动并运行
- [ ] Nginx已配置
- [ ] 防火墙已配置
- [ ] 健康检查通过
- [ ] Web界面可访问

---

**最后更新**: 2025-11-11
**主机**: 14.136.93.109 (Ubuntu)
**状态**: ✅ 部署指南完成

