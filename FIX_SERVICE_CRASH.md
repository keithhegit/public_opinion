# 修复服务崩溃问题

## 🔍 问题诊断

### 当前状态
- ❌ 服务状态：`activating (auto-restart)` - 不断重启但启动失败
- ❌ 退出代码：`status=1/FAILURE` - 启动失败
- ❌ 端口 5000：未监听 - 服务未成功启动

### 问题原因
服务启动后立即崩溃，需要查看错误日志找出原因。

---

## 🔧 诊断步骤

### Step 1: 查看详细错误日志

```bash
# 查看最近的错误日志（最后50行）
sudo journalctl -u bettafish -n 50 --no-pager

# 查看完整的错误信息（包括 traceback）
sudo journalctl -u bettafish --since "5 minutes ago" | grep -A 20 -i "error\|exception\|traceback"
```

### Step 2: 手动运行查看错误

```bash
# 切换到 bettafish 用户并手动运行
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && source venv/bin/activate && python app.py"
```

这会显示完整的错误信息，包括 Python traceback。

---

## 🚀 可能的解决方案

### 方案 1: 检查代码语法错误

如果刚刚更新了代码，可能有语法错误：

```bash
# 检查 Python 语法
cd /home/bettafish/Public_Opinion/BettaFish-main
python -m py_compile app.py

# 检查所有修改过的 Python 文件
python -m py_compile MediaEngine/tools/search.py
python -m py_compile MediaEngine/utils/config.py
python -m py_compile InsightEngine/utils/db.py
```

### 方案 2: 检查导入错误

```bash
# 测试导入
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && source venv/bin/activate && python -c 'from MediaEngine.utils.config import settings; print(\"OK\")'"
```

### 方案 3: 检查环境变量

```bash
# 检查 .env 文件是否有语法错误
sudo cat /home/bettafish/Public_Opinion/BettaFish-main/.env | grep -v "^#" | grep -v "^$"

# 检查是否有未闭合的引号或特殊字符
```

### 方案 4: 回滚到上一个工作版本

如果问题是由最新提交引起的：

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main
sudo -u bettafish git log --oneline -5
# 找到上一个工作的 commit，然后
sudo -u bettafish git reset --hard <上一个commit的hash>
sudo systemctl restart bettafish
```

---

## 📝 快速诊断命令

```bash
# 一键诊断脚本
echo "============================================================"
echo "服务崩溃诊断"
echo "============================================================"

echo "1. 查看最近错误日志..."
sudo journalctl -u bettafish -n 30 --no-pager | tail -20

echo ""
echo "2. 检查 Python 语法..."
cd /home/bettafish/Public_Opinion/BettaFish-main
python -m py_compile app.py 2>&1 && echo "   ✅ app.py 语法正确" || echo "   ❌ app.py 有语法错误"

echo ""
echo "3. 测试导入..."
sudo -u bettafish bash -c "cd /home/bettafish/Public_Opinion/BettaFish-main && source venv/bin/activate && python -c 'import app' 2>&1" | head -10

echo ""
echo "============================================================"
```

