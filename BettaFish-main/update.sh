#!/bin/bash

# BettaFish 更新脚本
# 用于快速更新应用代码和重启服务

set -e

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 配置
APP_USER="bettafish"
APP_DIR="/home/${APP_USER}/Public_Opinion/BettaFish-main"
VENV_DIR="${APP_DIR}/venv"
SERVICE_NAME="bettafish"

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
if [ "$EUID" -ne 0 ]; then 
    error "请使用sudo运行此脚本"
    exit 1
fi

# 切换到应用目录
cd "$APP_DIR" || exit 1

info "开始更新BettaFish..."

# 备份当前代码（可选）
if [ -d ".git" ]; then
    info "拉取最新代码..."
    sudo -u $APP_USER git pull origin main || {
        warn "Git pull失败，继续使用当前代码"
    }
else
    warn "未检测到Git仓库，跳过代码更新"
fi

# 更新依赖
info "检查依赖更新..."
if [ -f "requirements.txt" ]; then
    sudo -u $APP_USER bash -c "source $VENV_DIR/bin/activate && pip install -r requirements.txt"
    info "依赖更新完成"
fi

# 重启服务
info "重启服务..."
systemctl restart $SERVICE_NAME

# 等待服务启动
sleep 3

# 检查服务状态
if systemctl is-active --quiet $SERVICE_NAME; then
    info "更新完成！服务已重启"
    echo ""
    info "服务状态:"
    systemctl status $SERVICE_NAME --no-pager -l | head -n 10
else
    error "服务启动失败，请检查日志:"
    echo "  sudo journalctl -u $SERVICE_NAME -f"
    exit 1
fi

