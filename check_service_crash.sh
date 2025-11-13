#!/bin/bash
# 服务崩溃诊断脚本

echo "============================================================"
echo "服务崩溃诊断"
echo "============================================================"
echo ""

echo "1. 查看最近的服务日志（最后30行）..."
echo "------------------------------------------------------------"
sudo journalctl -u bettafish -n 30 --no-pager | tail -25
echo ""

echo "2. 查找错误和异常..."
echo "------------------------------------------------------------"
ERRORS=$(sudo journalctl -u bettafish --since "10 minutes ago" 2>/dev/null | grep -i -A 5 "error\|exception\|traceback\|failed" | head -30)
if [ -n "$ERRORS" ]; then
    echo "$ERRORS"
else
    echo "   未找到明显的错误信息"
fi
echo ""

echo "3. 检查 Python 语法..."
echo "------------------------------------------------------------"
cd /home/bettafish/Public_Opinion/BettaFish-main
if python3 -m py_compile app.py 2>&1; then
    echo "   ✅ app.py 语法正确"
else
    echo "   ❌ app.py 有语法错误"
    python3 -m py_compile app.py 2>&1
fi
echo ""

echo "4. 测试关键模块导入..."
echo "------------------------------------------------------------"
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && source venv/bin/activate && python -c 'from MediaEngine.utils.config import settings; print(\"✅ MediaEngine config OK\")' 2>&1" | head -5
echo ""

echo "5. 尝试手动运行（前10行输出）..."
echo "------------------------------------------------------------"
echo "   注意：这会显示启动时的错误信息"
echo "   按 Ctrl+C 停止"
echo ""
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && source venv/bin/activate && timeout 5 python app.py 2>&1" | head -20
echo ""

echo "============================================================"
echo "诊断完成"
echo "============================================================"
echo ""
echo "如果看到错误信息，请根据错误类型修复："
echo "  - 语法错误：修复代码"
echo "  - 导入错误：检查依赖是否安装"
echo "  - 配置错误：检查 .env 文件"
echo ""

