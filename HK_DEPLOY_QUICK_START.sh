#!/bin/bash

# 香港Ubuntu主机快速部署脚本
# 主机: 14.136.93.109
# 用户: ubuntu

set -e

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 配置
APP_USER="bettafish"
APP_DIR="/home/${APP_USER}/Public_Opinion/BettaFish-main"
VENV_DIR="${APP_DIR}/venv"
SERVICE_NAME="bettafish"
REPO_URL=""  # 需要用户提供

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then 
    error "请使用sudo运行此脚本"
    exit 1
fi

info "开始部署BettaFish到香港Ubuntu主机..."

# Step 1: 安装基础依赖
info "安装基础依赖..."
apt update
apt install -y python3 python3-pip python3-venv git nginx supervisor

# Step 2: 创建应用用户
info "创建应用用户..."
if ! id "$APP_USER" &>/dev/null; then
    useradd -m -s /bin/bash $APP_USER
    info "用户 $APP_USER 已创建"
else
    info "用户 $APP_USER 已存在"
fi

# Step 3: 获取Git仓库URL
if [ -z "$REPO_URL" ]; then
    warn "请提供Git仓库URL:"
    read -p "Git仓库URL: " REPO_URL
fi

# Step 4: 克隆代码
info "克隆代码..."
sudo -u $APP_USER bash << EOF
cd ~
if [ -d "Public_Opinion" ]; then
    warn "目录已存在，跳过克隆"
    cd Public_Opinion
    git pull origin main || true
else
    git clone $REPO_URL Public_Opinion
fi
cd Public_Opinion/BettaFish-main
EOF

# Step 5: 创建虚拟环境
info "创建虚拟环境..."
sudo -u $APP_USER bash << EOF
cd $APP_DIR
if [ ! -d "venv" ]; then
    python3 -m venv venv
    info "虚拟环境已创建"
else
    info "虚拟环境已存在"
fi
EOF

# Step 6: 安装Python依赖
info "安装Python依赖..."
sudo -u $APP_USER bash << EOF
source $VENV_DIR/bin/activate
pip install --upgrade pip
pip install -r $APP_DIR/requirements.txt
EOF

# Step 7: 创建必要的目录
info "创建必要的目录..."
sudo -u $APP_USER mkdir -p $APP_DIR/logs
sudo -u $APP_USER mkdir -p $APP_DIR/final_reports
sudo -u $APP_USER mkdir -p $APP_DIR/insight_engine_streamlit_reports
sudo -u $APP_USER mkdir -p $APP_DIR/media_engine_streamlit_reports
sudo -u $APP_USER mkdir -p $APP_DIR/query_engine_streamlit_reports

# Step 8: 检查.env文件
info "检查.env文件..."
if [ ! -f "$APP_DIR/.env" ]; then
    warn ".env文件不存在，请手动创建:"
    echo "  sudo nano $APP_DIR/.env"
    echo ""
    echo "必需的环境变量:"
    echo "  BOCHA_WEB_SEARCH_API_KEY=你的Bocha_API_Key"
    echo "  TAVILY_API_KEY=你的Tavily_API_Key"
    echo "  INSIGHT_ENGINE_API_KEY=你的Gemini_API_Key"
    echo "  MEDIA_ENGINE_API_KEY=你的Gemini_API_Key"
    echo "  QUERY_ENGINE_API_KEY=你的Gemini_API_Key"
    echo "  REPORT_ENGINE_API_KEY=你的Gemini_API_Key"
    echo "  HOST=0.0.0.0"
    echo "  PORT=5000"
    echo ""
    read -p "按Enter继续（请稍后手动创建.env文件）..."
else
    info ".env文件已存在"
    chmod 600 $APP_DIR/.env
    chown $APP_USER:$APP_USER $APP_DIR/.env
fi

# Step 9: 创建systemd服务文件
info "创建systemd服务文件..."
cat > /etc/systemd/system/${SERVICE_NAME}.service << EOF
[Unit]
Description=BettaFish Flask Application
After=network.target

[Service]
Type=simple
User=$APP_USER
Group=$APP_USER
WorkingDirectory=$APP_DIR
Environment="PATH=$VENV_DIR/bin"
EnvironmentFile=$APP_DIR/.env
ExecStart=$VENV_DIR/bin/python app.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Step 10: 启用并启动服务
info "启用systemd服务..."
systemctl daemon-reload
systemctl enable $SERVICE_NAME

# Step 11: 创建Nginx配置
info "创建Nginx配置..."
cat > /etc/nginx/sites-available/bettafish << 'NGINX_EOF'
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
}
NGINX_EOF

# 启用Nginx配置
ln -sf /etc/nginx/sites-available/bettafish /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

# Step 12: 配置防火墙
info "配置防火墙..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

info "部署完成！"
echo ""
info "下一步:"
echo "  1. 创建.env文件: sudo nano $APP_DIR/.env"
echo "  2. 填写6个API密钥"
echo "  3. 启动服务: sudo systemctl start $SERVICE_NAME"
echo "  4. 检查状态: sudo systemctl status $SERVICE_NAME"
echo "  5. 查看日志: sudo journalctl -u $SERVICE_NAME -f"
echo ""
info "访问地址: http://14.136.93.109"

