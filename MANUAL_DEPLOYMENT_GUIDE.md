# 云主机手动部署指南

## 📋 概述

本指南将帮助你将BettaFish Python Flask后端从Railway迁移到新的云主机上。

### 主要差异

| 特性 | Railway | 新云主机 |
|------|---------|----------|
| 自动部署 | ✅ 有 | ❌ 无 |
| 自动构建 | ✅ 有 | ❌ 需要手动 |
| 进程管理 | ✅ 自动 | ❌ 需要systemd/supervisor |
| 反向代理 | ✅ 自动 | ❌ 需要nginx |
| 环境变量 | ✅ Web界面 | ❌ 需要手动配置 |
| 日志管理 | ✅ 自动 | ❌ 需要配置 |

---

## 🚀 部署步骤

### Step 1: 准备云主机环境

#### 1.1 系统要求
- **操作系统**: Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- **Python**: 3.10+ (推荐3.11)
- **内存**: 至少4GB（推荐8GB+）
- **磁盘**: 至少20GB可用空间

#### 1.2 安装基础依赖

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y python3 python3-pip python3-venv git nginx supervisor

# CentOS/RHEL
sudo yum install -y python3 python3-pip git nginx supervisor
```

#### 1.3 创建应用用户（可选但推荐）

```bash
sudo useradd -m -s /bin/bash bettafish
sudo su - bettafish
```

---

### Step 2: 部署应用代码

#### 2.1 克隆代码

```bash
# 在应用用户目录下
cd ~
git clone <your-repo-url> Public_Opinion
cd Public_Opinion/BettaFish-main
```

#### 2.2 创建虚拟环境

```bash
python3 -m venv venv
source venv/bin/activate
```

#### 2.3 安装Python依赖

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

### Step 3: 配置环境变量

#### 3.1 创建环境变量文件

```bash
# 在项目根目录创建.env文件
cd ~/Public_Opinion/BettaFish-main
nano .env
```

#### 3.2 配置必需的环境变量

```bash
# 服务器配置
HOST=0.0.0.0
PORT=5000

# LLM API Keys（必需）
INSIGHT_ENGINE_API_KEY=你的Gemini_API_Key
MEDIA_ENGINE_API_KEY=你的Gemini_API_Key
QUERY_ENGINE_API_KEY=你的Gemini_API_Key
REPORT_ENGINE_API_KEY=你的Gemini_API_Key

# 搜索 API Keys（必需）
BOCHA_WEB_SEARCH_API_KEY=你的Bocha_API_Key
TAVILY_API_KEY=你的Tavily_API_Key

# 数据库配置（可选，如果不需要数据库功能可以不设置）
# DB_HOST=your_db_host
# DB_USER=your_db_user
# DB_PASSWORD=your_db_password
# DB_NAME=your_db_name
# DB_PORT=3306
# DB_CHARSET=utf8mb4
# DB_DIALECT=mysql

# 其他可选配置
KEYWORD_OPTIMIZER_API_KEY=你的API_Key（可选）
FORUM_HOST_API_KEY=你的API_Key（可选）
MINDSPIDER_API_KEY=你的API_Key（可选）
```

#### 3.3 加载环境变量

在`app.py`启动时会自动读取`.env`文件（如果使用python-dotenv）。

或者手动加载：

```bash
# 在启动脚本中
export $(cat .env | xargs)
```

---

### Step 4: 配置进程管理（systemd）

#### 4.1 创建systemd服务文件

```bash
sudo nano /etc/systemd/system/bettafish.service
```

#### 4.2 服务文件内容

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

#### 4.3 启用并启动服务

```bash
# 重新加载systemd配置
sudo systemctl daemon-reload

# 启用服务（开机自启）
sudo systemctl enable bettafish

# 启动服务
sudo systemctl start bettafish

# 检查状态
sudo systemctl status bettafish

# 查看日志
sudo journalctl -u bettafish -f
```

---

### Step 5: 配置Nginx反向代理

#### 5.1 创建Nginx配置

```bash
sudo nano /etc/nginx/sites-available/bettafish
```

#### 5.2 Nginx配置内容

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或IP

    # 日志配置
    access_log /var/log/nginx/bettafish-access.log;
    error_log /var/log/nginx/bettafish-error.log;

    # 客户端最大请求体大小（用于文件上传）
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
        
        # WebSocket支持（用于SocketIO）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # 静态文件（如果有）
    location /static {
        alias /home/bettafish/Public_Opinion/BettaFish-main/static;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 5.3 启用Nginx配置

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/bettafish /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx

# 检查状态
sudo systemctl status nginx
```

#### 5.4 配置HTTPS（可选但推荐）

使用Let's Encrypt免费SSL证书：

```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期（已自动配置）
```

---

### Step 6: 配置防火墙

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp     # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

---

### Step 7: 配置日志管理

#### 7.1 创建日志目录

```bash
mkdir -p ~/Public_Opinion/BettaFish-main/logs
```

#### 7.2 配置日志轮转

```bash
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
    sharedscripts
    postrotate
        systemctl reload bettafish > /dev/null 2>&1 || true
    endscript
}
```

---

## 🔄 更新部署流程

### 手动更新步骤

```bash
# 1. 切换到应用目录
cd ~/Public_Opinion/BettaFish-main

# 2. 激活虚拟环境
source venv/bin/activate

# 3. 拉取最新代码
git pull origin main

# 4. 更新依赖（如果有新依赖）
pip install -r requirements.txt

# 5. 重启服务
sudo systemctl restart bettafish

# 6. 检查状态
sudo systemctl status bettafish
sudo journalctl -u bettafish -f
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
sudo journalctl -u bettafish --since "1 hour ago"
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
# 检查服务状态
sudo systemctl status bettafish

# 查看详细日志
sudo journalctl -u bettafish -n 100

# 检查端口是否被占用
sudo netstat -tlnp | grep 5000
sudo lsof -i :5000
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

### 问题3: 依赖缺失

```bash
# 重新安装依赖
cd ~/Public_Opinion/BettaFish-main
source venv/bin/activate
pip install -r requirements.txt
```

### 问题4: 权限问题

```bash
# 检查文件权限
ls -la ~/Public_Opinion/BettaFish-main

# 修复权限
sudo chown -R bettafish:bettafish ~/Public_Opinion/BettaFish-main
```

---

## ✅ 验证清单

部署完成后，验证以下项目：

- [ ] 服务正在运行: `sudo systemctl status bettafish`
- [ ] 健康检查通过: `curl http://localhost:5000/api/health`
- [ ] Nginx配置正确: `sudo nginx -t`
- [ ] 外部访问正常: `curl http://your-domain.com/api/health`
- [ ] 日志正常输出: `sudo journalctl -u bettafish -f`
- [ ] 环境变量正确: 检查`.env`文件
- [ ] 防火墙配置: 端口80和443开放

---

## 📚 相关文件

- `deploy.sh` - 自动化部署脚本
- `bettafish.service` - systemd服务文件
- `nginx.conf` - Nginx配置文件示例
- `.env.example` - 环境变量模板

---

**最后更新**: 2025-11-11
**状态**: ✅ 部署指南完成

