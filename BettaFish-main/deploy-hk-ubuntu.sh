#!/bin/bash

# BettaFish 香港Ubuntu主机完整部署脚本
# 主机: 14.136.93.109
# 用户: ubuntu
# 用途: 一键部署BettaFish到云主机

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
APP_USER="bettafish"
APP_DIR="/home/${APP_USER}/Public_Opinion/BettaFish-main"
VENV_DIR="${APP_DIR}/venv"
SERVICE_NAME="bettafish"
HOST_IP="14.136.93.109"

# 函数：打印信息
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 检查是否为root用户
check_root() {
    if [ "$EUID" -ne 0 ]; then 
        error "请使用sudo运行此脚本: sudo bash $0"
        exit 1
    fi
}

# Step 1: 安装系统依赖
install_system_dependencies() {
    step "1/12 安装系统依赖..."
    apt update
    apt install -y python3 python3-pip python3-venv git nginx supervisor ufw curl
    
    # 安装Pillow和其他Python包编译所需的系统库
    apt install -y \
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
    
    info "系统依赖安装完成"
}

# Step 2: 创建应用用户
create_app_user() {
    step "2/12 创建应用用户..."
    if ! id "$APP_USER" &>/dev/null; then
        useradd -m -s /bin/bash $APP_USER
        info "用户 $APP_USER 已创建"
    else
        info "用户 $APP_USER 已存在"
    fi
}

# Step 3: 获取Git仓库URL
get_repo_url() {
    step "3/12 配置Git仓库..."
    if [ -z "$REPO_URL" ]; then
        warn "请提供Git仓库URL（用于克隆代码）"
        read -p "Git仓库URL: " REPO_URL
        if [ -z "$REPO_URL" ]; then
            error "Git仓库URL不能为空"
            exit 1
        fi
    fi
    info "Git仓库URL: $REPO_URL"
}

# Step 4: 克隆代码
clone_repository() {
    step "4/12 克隆代码..."
    sudo -u $APP_USER bash << EOF
cd ~
if [ -d "Public_Opinion" ]; then
    echo "目录已存在，更新代码..."
    cd Public_Opinion
    git pull origin main || {
        echo "Git pull失败，可能需要手动处理"
    }
else
    git clone $REPO_URL Public_Opinion || {
        echo "Git克隆失败，请检查仓库URL和网络连接" >&2
        exit 1
    }
fi
EOF
    if [ $? -eq 0 ]; then
        info "代码克隆/更新完成"
    else
        error "代码克隆失败"
        exit 1
    fi
}

# Step 5: 创建虚拟环境
setup_venv() {
    step "5/12 创建Python虚拟环境..."
    sudo -u $APP_USER bash << EOF
cd $APP_DIR
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "虚拟环境已创建"
else
    echo "虚拟环境已存在"
fi
EOF
    info "虚拟环境创建完成"
}

# Step 6: 安装Python依赖
install_python_dependencies() {
    step "6/12 安装Python依赖..."
    sudo -u $APP_USER bash << EOF
source $VENV_DIR/bin/activate
pip install --upgrade pip
pip install -r $APP_DIR/requirements.txt
EOF
    info "Python依赖安装完成"
}

# Step 7: 安装Playwright（如果需要）
install_playwright() {
    step "7/12 安装Playwright浏览器..."
    if grep -q "playwright" "$APP_DIR/requirements.txt" 2>/dev/null; then
        sudo -u $APP_USER bash << EOF
source $VENV_DIR/bin/activate
playwright install chromium || echo "Playwright安装失败，可能需要手动安装" >&2
playwright install-deps || echo "Playwright依赖安装失败" >&2
EOF
        info "Playwright安装完成"
    else
        info "跳过Playwright安装（未在requirements.txt中找到）"
    fi
}

# Step 8: 创建必要的目录
create_directories() {
    step "8/12 创建必要的目录..."
    sudo -u $APP_USER mkdir -p $APP_DIR/logs
    sudo -u $APP_USER mkdir -p $APP_DIR/final_reports
    sudo -u $APP_USER mkdir -p $APP_DIR/insight_engine_streamlit_reports
    sudo -u $APP_USER mkdir -p $APP_DIR/media_engine_streamlit_reports
    sudo -u $APP_USER mkdir -p $APP_DIR/query_engine_streamlit_reports
    info "目录创建完成"
}

# Step 9: 创建.env文件模板
create_env_file() {
    step "9/12 配置环境变量..."
    ENV_FILE="$APP_DIR/.env"
    
    if [ -f "$ENV_FILE" ]; then
        warn ".env文件已存在，跳过创建"
        warn "请确保.env文件包含所有必需的API密钥"
    else
        info "创建.env文件模板..."
        sudo -u $APP_USER tee "$ENV_FILE" > /dev/null << 'ENV_EOF'
# ============================================
# BettaFish 环境变量配置
# 请填写以下API密钥（从Railway迁移）
# ============================================

# 搜索 API Keys（必需）
BOCHA_WEB_SEARCH_API_KEY=你的Bocha_API_Key
TAVILY_API_KEY=你的Tavily_API_Key

# LLM API Keys（必需，使用 GLM API）
INSIGHT_ENGINE_API_KEY=你的GLM_API_Key
MEDIA_ENGINE_API_KEY=你的GLM_API_Key
QUERY_ENGINE_API_KEY=你的GLM_API_Key
REPORT_ENGINE_API_KEY=你的GLM_API_Key

# ============================================
# 服务器配置
# ============================================
HOST=0.0.0.0
PORT=5000

# ============================================
# Python环境配置
# ============================================
PYTHONIOENCODING=utf-8
PYTHONUTF8=1
PYTHONUNBUFFERED=1

# ============================================
# 数据库配置（可选，如果不需要数据库功能可以不设置）
# ============================================
# DB_HOST=your_db_host
# DB_USER=your_db_user
# DB_PASSWORD=your_db_password
# DB_NAME=your_db_name
# DB_PORT=3306
# DB_CHARSET=utf8mb4
# DB_DIALECT=mysql
ENV_EOF
        
        chmod 600 "$ENV_FILE"
        chown $APP_USER:$APP_USER "$ENV_FILE"
        
        warn "============================================"
        warn "重要: 请编辑.env文件并填写API密钥"
        warn "============================================"
        warn "执行以下命令编辑.env文件:"
        warn "  sudo nano $ENV_FILE"
        warn ""
        warn "必需填写以下6个API密钥:"
        warn "  1. BOCHA_WEB_SEARCH_API_KEY"
        warn "  2. TAVILY_API_KEY"
        warn "  3. INSIGHT_ENGINE_API_KEY"
        warn "  4. MEDIA_ENGINE_API_KEY"
        warn "  5. QUERY_ENGINE_API_KEY"
        warn "  6. REPORT_ENGINE_API_KEY"
        warn "============================================"
    fi
}

# Step 10: 配置systemd服务
setup_systemd_service() {
    step "10/12 配置systemd服务..."
    SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
    
    cat > "$SERVICE_FILE" << EOF
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
    
    systemctl daemon-reload
    systemctl enable $SERVICE_NAME
    info "systemd服务配置完成"
}

# Step 11: 配置Nginx
setup_nginx() {
    step "11/12 配置Nginx反向代理..."
    NGINX_CONFIG="/etc/nginx/sites-available/bettafish"
    
    cat > "$NGINX_CONFIG" << 'NGINX_EOF'
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
NGINX_EOF
    
    # 启用配置
    ln -sf /etc/nginx/sites-available/bettafish /etc/nginx/sites-enabled/
    
    # 测试配置
    if nginx -t; then
        systemctl restart nginx
        info "Nginx配置完成并已重启"
    else
        error "Nginx配置测试失败，请检查配置"
        exit 1
    fi
}

# Step 12: 配置防火墙
setup_firewall() {
    step "12/12 配置防火墙..."
    ufw allow 22/tcp comment 'SSH'
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'
    ufw --force enable
    info "防火墙配置完成"
}

# 显示部署总结
show_summary() {
    echo ""
    info "============================================"
    info "部署完成！"
    info "============================================"
    echo ""
    info "下一步操作:"
    echo ""
    warn "1. 编辑.env文件并填写API密钥:"
    echo "   sudo nano $APP_DIR/.env"
    echo ""
    warn "2. 启动服务:"
    echo "   sudo systemctl start $SERVICE_NAME"
    echo ""
    warn "3. 检查服务状态:"
    echo "   sudo systemctl status $SERVICE_NAME"
    echo ""
    warn "4. 查看日志:"
    echo "   sudo journalctl -u $SERVICE_NAME -f"
    echo ""
    warn "5. 测试API:"
    echo "   curl http://localhost:5000/api/health"
    echo "   curl http://$HOST_IP/api/health"
    echo ""
    info "访问地址:"
    echo "   http://$HOST_IP"
    echo ""
    info "常用命令:"
    echo "   启动服务: sudo systemctl start $SERVICE_NAME"
    echo "   停止服务: sudo systemctl stop $SERVICE_NAME"
    echo "   重启服务: sudo systemctl restart $SERVICE_NAME"
    echo "   查看日志: sudo journalctl -u $SERVICE_NAME -f"
    echo ""
    info "============================================"
}

# 主函数
main() {
    echo ""
    info "============================================"
    info "BettaFish 香港Ubuntu主机部署脚本"
    info "主机: $HOST_IP"
    info "============================================"
    echo ""
    
    check_root
    install_system_dependencies
    create_app_user
    get_repo_url
    clone_repository
    setup_venv
    install_python_dependencies
    install_playwright
    create_directories
    create_env_file
    setup_systemd_service
    setup_nginx
    setup_firewall
    show_summary
}

# 运行主函数
main "$@"

