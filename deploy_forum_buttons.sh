#!/bin/bash
# 部署 Forum Engine 按钮功能到服务器

echo "============================================================"
echo "部署 Forum Engine 按钮功能"
echo "============================================================"
echo ""

# 检查服务器上的文件
echo "1. 检查服务器上的文件..."
if grep -q "forumDownloadBtn" /home/bettafish/Public_Opinion/BettaFish-main/templates/index.html 2>/dev/null; then
    echo "   ✅ 服务器上的文件已包含按钮代码"
else
    echo "   ❌ 服务器上的文件没有按钮代码，需要更新"
    echo ""
    echo "   请执行以下步骤："
    echo "   1. 在本地提交并推送代码："
    echo "      cd BettaFish-main"
    echo "      git add templates/index.html app.py"
    echo "      git commit -m 'Add Forum Engine log viewing and download functionality'"
    echo "      git push"
    echo ""
    echo "   2. 在服务器上拉取代码："
    echo "      cd /home/bettafish/Public_Opinion/BettaFish-main"
    echo "      sudo -u bettafish git pull"
    echo ""
    echo "   3. 重启服务："
    echo "      sudo systemctl restart bettafish"
    exit 1
fi

echo ""
echo "2. 检查文件修改时间..."
ls -lh /home/bettafish/Public_Opinion/BettaFish-main/templates/index.html

echo ""
echo "3. 检查 git 状态..."
cd /home/bettafish/Public_Opinion/BettaFish-main
git status --short

echo ""
echo "4. 检查最近的提交..."
git log --oneline -5 | head -3

echo ""
echo "============================================================"
echo "如果文件已更新，请重启服务："
echo "  sudo systemctl restart bettafish"
echo "============================================================"

