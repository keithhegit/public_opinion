#!/bin/bash

# BettaFish 部署脚本
# 用于在云主机上部署和更新应用

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置
APP_USER="bettafish"
APP_DIR="/home/${APP_USER}/Public_Opinion/BettaFish-main"
VENV_DIR="${APP_DIR}/venv"
SERVICE_NAME="bettafish"

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

# 检查是否为root用户
check_root() {
    if [ "$EUID" -ne 0 ]; then 
        error "请使用sudo运行此脚本"
        exit 1
    fi
}

# 检查应用目录是否存在
check_app_dir() {
    if [ ! -d "$APP_DIR" ]; then
        error "应用目录不存在: $APP_DIR"
        error "请先克隆代码到该目录"
        exit 1
    fi
}

# 创建虚拟环境
setup_venv() {
    info "检查虚拟环境..."
    if [ ! -d "$VENV_DIR" ]; then
        info "创建虚拟环境..."
        sudo -u $APP_USER python3 -m venv "$VENV_DIR"
        info "虚拟环境创建完成"
    else
        info "虚拟环境已存在"
    fi
}

# 安装依赖
install_dependencies() {
    info "安装Python依赖..."
    sudo -u $APP_USER bash -c "source $VENV_DIR/bin/activate && pip install --upgrade pip"
    sudo -u $APP_USER bash -c "source $VENV_DIR/bin/activate && pip install -r $APP_DIR/requirements.txt"
    info "依赖安装完成"
}

# 安装Playwright（如果需要）
install_playwright() {
    if [ -f "$APP_DIR/requirements.txt" ] && grep -q "playwright" "$APP_DIR/requirements.txt"; then
        info "安装Playwright浏览器..."
        sudo -u $APP_USER bash -c "source $VENV_DIR/bin/activate && playwright install chromium"
        sudo -u $APP_USER bash -c "source $VENV_DIR/bin/activate && playwright install-deps"
        info "Playwright安装完成"
    fi
}

# 创建必要的目录
create_directories() {
    info "创建必要的目录..."
    sudo -u $APP_USER mkdir -p "$APP_DIR/logs"
    sudo -u $APP_USER mkdir -p "$APP_DIR/final_reports"
    sudo -u $APP_USER mkdir -p "$APP_DIR/insight_engine_streamlit_reports"
    sudo -u $APP_USER mkdir -p "$APP_DIR/media_engine_streamlit_reports"
    sudo -u $APP_USER mkdir -p "$APP_DIR/query_engine_streamlit_reports"
    info "目录创建完成"
}

# 检查环境变量文件
check_env_file() {
    if [ ! -f "$APP_DIR/.env" ]; then
        warn ".env文件不存在"
        if [ -f "$APP_DIR/.env.example" ]; then
            info "从.env.example创建.env文件..."
            sudo -u $APP_USER cp "$APP_DIR/.env.example" "$APP_DIR/.env"
            warn "请编辑 $APP_DIR/.env 文件，配置必要的环境变量"
        else
            warn "请创建 $APP_DIR/.env 文件并配置环境变量"
        fi
    else
        info ".env文件已存在"
    fi
}

# 设置文件权限
set_permissions() {
    info "设置文件权限..."
    sudo chown -R $APP_USER:$APP_USER "$APP_DIR"
    sudo chmod +x "$APP_DIR/app.py"
    info "权限设置完成"
}

# 创建systemd服务文件
create_systemd_service() {
    info "创建systemd服务文件..."
    
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

    info "systemd服务文件创建完成: $SERVICE_FILE"
}

# 启用并启动服务
enable_service() {
    info "启用systemd服务..."
    systemctl daemon-reload
    systemctl enable $SERVICE_NAME
    info "服务已启用（开机自启）"
}

# 重启服务
restart_service() {
    info "重启服务..."
    systemctl restart $SERVICE_NAME
    sleep 2
    if systemctl is-active --quiet $SERVICE_NAME; then
        info "服务重启成功"
    else
        error "服务启动失败，请检查日志: sudo journalctl -u $SERVICE_NAME -f"
        exit 1
    fi
}

# 显示服务状态
show_status() {
    info "服务状态:"
    systemctl status $SERVICE_NAME --no-pager -l
}

# 主函数
main() {
    info "开始部署BettaFish..."
    
    check_root
    check_app_dir
    
    # 部署步骤
    setup_venv
    install_dependencies
    install_playwright
    create_directories
    check_env_file
    set_permissions
    create_systemd_service
    enable_service
    restart_service
    
    info "部署完成！"
    echo ""
    info "常用命令:"
    echo "  查看状态: sudo systemctl status $SERVICE_NAME"
    echo "  查看日志: sudo journalctl -u $SERVICE_NAME -f"
    echo "  重启服务: sudo systemctl restart $SERVICE_NAME"
    echo "  停止服务: sudo systemctl stop $SERVICE_NAME"
    echo ""
    show_status
}

# 运行主函数
main "$@"

