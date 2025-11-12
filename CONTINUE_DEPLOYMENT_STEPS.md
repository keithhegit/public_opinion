# 继续部署步骤（7-12）

## ✅ 已完成步骤
- [x] 1. 安装系统依赖
- [x] 2. 创建应用用户
- [x] 3. 配置Git仓库
- [x] 4. 克隆代码
- [x] 5. 创建虚拟环境
- [x] 6. 安装Python依赖

---

## 🚀 继续执行步骤7-12

### Step 7: 安装Playwright浏览器

```bash
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && source venv/bin/activate && playwright install chromium && playwright install-deps"
```

**预计时间**: 2-5分钟

---

### Step 8: 创建必要的目录

```bash
sudo -u bettafish mkdir -p /home/bettafish/Public_Opinion/BettaFish-main/logs
sudo -u bettafish mkdir -p /home/bettafish/Public_Opinion/BettaFish-main/final_reports
sudo -u bettafish mkdir -p /home/bettafish/Public_Opinion/BettaFish-main/insight_engine_streamlit_reports
sudo -u bettafish mkdir -p /home/bettafish/Public_Opinion/BettaFish-main/media_engine_streamlit_reports
sudo -u bettafish mkdir -p /home/bettafish/Public_Opinion/BettaFish-main/query_engine_streamlit_reports
```

---

### Step 9: 创建.env文件并填写API密钥

```bash
sudo nano /home/bettafish/Public_Opinion/BettaFish-main/.env
```

**填写以下内容**（替换为实际的API密钥）：

```env
# 搜索 API Keys（必需）
BOCHA_WEB_SEARCH_API_KEY=你的Bocha_API_Key
TAVILY_API_KEY=你的Tavily_API_Key

# LLM API Keys（必需）
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

**保存**: `Ctrl+X`, 然后 `Y`, 然后 `Enter`

**设置文件权限**:
```bash
sudo chmod 600 /home/bettafish/Public_Opinion/BettaFish-main/.env
sudo chown bettafish:bettafish /home/bettafish/Public_Opinion/BettaFish-main/.env
```

---

### Step 10: 配置systemd服务

```bash
sudo nano /etc/systemd/system/bettafish.service
```

**填写以下内容**：

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

**保存**: `Ctrl+X`, 然后 `Y`, 然后 `Enter`

**启用服务**:
```bash
sudo systemctl daemon-reload
sudo systemctl enable bettafish
```

---

### Step 11: 配置Nginx反向代理

```bash
sudo nano /etc/nginx/sites-available/bettafish
```

**填写以下内容**：

```nginx
server {
    listen 80;
    server_name 14.136.93.109;

    access_log /var/log/nginx/bettafish-access.log;
    error_log /var/log/nginx/bettafish-error.log;

    client_max_body_size 100M;

    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        proxy_buffering off;
        proxy_request_buffering off;
    }

    location /static {
        alias /home/bettafish/Public_Opinion/BettaFish-main/static;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /api/health {
        proxy_pass http://127.0.0.1:5000;
        access_log off;
    }
}
```

**保存**: `Ctrl+X`, 然后 `Y`, 然后 `Enter`

**启用配置**:
```bash
sudo ln -s /etc/nginx/sites-available/bettafish /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### Step 12: 配置防火墙

```bash
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'
sudo ufw --force enable
```

---

## ✅ 启动服务

完成所有步骤后，启动服务：

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

### 2. 查看日志

```bash
sudo journalctl -u bettafish -f
```

### 3. 测试API

```bash
# 本地测试
curl http://localhost:5000/api/health

# 外部测试
curl http://14.136.93.109/api/health
```

### 4. 访问Web界面

在浏览器中打开: **http://14.136.93.109**

---

## 📝 常用命令

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

# 查看最近100行日志
sudo journalctl -u bettafish -n 100
```

---

**开始执行步骤7-12吧！** 🚀

