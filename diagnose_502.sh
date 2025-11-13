#!/bin/bash
# 502 错误诊断脚本

echo "============================================================"
echo "502 Bad Gateway 错误诊断"
echo "============================================================"
echo ""

echo "1. 检查 bettafish 服务状态..."
if sudo systemctl is-active bettafish > /dev/null 2>&1; then
    echo "   ✅ 服务运行中"
    echo "   启动时间: $(sudo systemctl show bettafish -p ActiveEnterTimestamp --value)"
else
    echo "   ❌ 服务未运行"
    echo "   尝试启动服务..."
    sudo systemctl start bettafish
    sleep 3
    if sudo systemctl is-active bettafish > /dev/null 2>&1; then
        echo "   ✅ 服务已启动"
    else
        echo "   ❌ 服务启动失败"
    fi
fi

echo ""
echo "2. 检查端口 5000 监听状态..."
if sudo netstat -tlnp 2>/dev/null | grep -q ":5000"; then
    echo "   ✅ 端口 5000 正在监听"
    sudo netstat -tlnp 2>/dev/null | grep ":5000"
elif sudo ss -tlnp 2>/dev/null | grep -q ":5000"; then
    echo "   ✅ 端口 5000 正在监听"
    sudo ss -tlnp 2>/dev/null | grep ":5000"
else
    echo "   ❌ 端口 5000 未监听"
fi

echo ""
echo "3. 测试本地 API 连接..."
RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:5000/api/system/status 2>/dev/null)
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ 本地 API 连接成功 (HTTP $HTTP_CODE)"
else
    echo "   ❌ 本地 API 连接失败 (HTTP $HTTP_CODE)"
    echo "   响应: $(echo "$RESPONSE" | head -3)"
fi

echo ""
echo "4. 检查最近的服务日志（最后20行）..."
sudo journalctl -u bettafish -n 20 --no-pager | tail -10

echo ""
echo "5. 检查错误日志..."
ERRORS=$(sudo journalctl -u bettafish --since "10 minutes ago" 2>/dev/null | grep -i "error\|exception\|traceback" | tail -5)
if [ -n "$ERRORS" ]; then
    echo "   发现错误:"
    echo "$ERRORS"
else
    echo "   ✅ 最近10分钟内没有发现错误"
fi

echo ""
echo "6. 检查防火墙状态..."
if command -v ufw > /dev/null 2>&1; then
    UFW_STATUS=$(sudo ufw status 2>/dev/null | head -1)
    echo "   $UFW_STATUS"
    if echo "$UFW_STATUS" | grep -q "active"; then
        if sudo ufw status | grep -q "5000"; then
            echo "   ✅ 端口 5000 已开放"
        else
            echo "   ⚠️  端口 5000 可能被防火墙阻止"
            echo "   建议执行: sudo ufw allow 5000/tcp"
        fi
    fi
fi

echo ""
echo "============================================================"
echo "诊断完成"
echo "============================================================"
echo ""
echo "如果服务未运行，尝试重启:"
echo "  sudo systemctl restart bettafish"
echo ""
echo "如果端口未监听，检查服务日志:"
echo "  sudo journalctl -u bettafish -n 50 --no-pager"
echo ""

