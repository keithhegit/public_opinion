# 服务器 .env 文件编辑命令（GNU nano）

## 📋 快速命令

### 1. SSH 连接到服务器

```bash
ssh your_username@your_server_ip
# 或
ssh your_username@your_server_hostname
```

### 2. 导航到项目目录

```bash
# 进入项目根目录（根据你的实际路径调整）
cd ~/Public_Opinion/BettaFish-main
# 或
cd /home/bettafish/Public_Opinion/BettaFish-main
# 或
cd /app  # 如果在 Docker 容器中
```

### 3. 使用 nano 编辑 .env 文件

```bash
nano .env
```

### 4. nano 基本操作

**编辑内容：**
- 直接输入文字即可编辑
- 使用方向键移动光标

**保存并退出：**
```
Ctrl + O  (保存文件)
Enter     (确认文件名)
Ctrl + X  (退出编辑器)
```

**不保存退出：**
```
Ctrl + X  (退出)
N         (不保存)
```

**其他常用快捷键：**
```
Ctrl + W  (搜索)
Ctrl + K  (删除当前行)
Ctrl + U  (粘贴)
Ctrl + G  (显示帮助)
```

---

## 🔧 完整操作流程

### 步骤 1: 连接到服务器

```bash
ssh your_username@your_server_ip
```

### 步骤 2: 找到 .env 文件位置

```bash
# 方法 1: 如果知道项目路径
cd ~/Public_Opinion/BettaFish-main

# 方法 2: 搜索 .env 文件
find ~ -name ".env" -type f 2>/dev/null

# 方法 3: 检查当前目录
pwd
ls -la | grep .env
```

### 步骤 3: 备份 .env 文件（推荐）

```bash
# 在编辑前先备份
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
```

### 步骤 4: 使用 nano 编辑

```bash
nano .env
```

### 步骤 5: 编辑 API Keys

在 nano 中，找到并更新以下行：

```env
# Query Engine API Key
QUERY_ENGINE_API_KEY=你的新API_Key

# Media Engine API Key
MEDIA_ENGINE_API_KEY=你的新API_Key

# Insight Engine API Key（如果需要）
INSIGHT_ENGINE_API_KEY=你的新API_Key

# Report Engine API Key（如果需要）
REPORT_ENGINE_API_KEY=你的新API_Key
```

**注意：**
- 确保等号 `=` 前后没有空格
- 确保值没有引号（除非值本身包含空格）
- 确保没有多余的空格或特殊字符

### 步骤 6: 保存并退出

```
1. 按 Ctrl + O  (保存)
2. 按 Enter     (确认)
3. 按 Ctrl + X  (退出)
```

### 步骤 7: 验证修改

```bash
# 检查修改后的内容
grep -E "QUERY_ENGINE_API_KEY|MEDIA_ENGINE_API_KEY" .env
```

### 步骤 8: 重启服务

```bash
# 方法 1: 如果使用 systemd
sudo systemctl restart bettafish
# 或
sudo systemctl restart publicopinion

# 方法 2: 如果使用 Docker
docker restart bettafish-container
# 或
docker-compose restart

# 方法 3: 如果是直接运行
# 找到进程并重启
ps aux | grep app.py
kill -HUP <PID>
# 或重新运行启动脚本
```

---

## 🔍 常用检查命令

### 检查 .env 文件是否存在

```bash
ls -la .env
```

### 查看 .env 文件内容（不编辑）

```bash
cat .env
# 或
less .env
# 或
more .env
```

### 查看特定环境变量

```bash
# 查看所有 Engine API Keys
grep -E "ENGINE_API_KEY" .env

# 查看 Query Engine 配置
grep "QUERY_ENGINE" .env

# 查看 Media Engine 配置
grep "MEDIA_ENGINE" .env
```

### 检查环境变量是否生效

```bash
# 方法 1: 在 Python 中检查
python3 -c "from config import settings; print(settings.QUERY_ENGINE_API_KEY[:20] if settings.QUERY_ENGINE_API_KEY else 'None')"

# 方法 2: 使用 source（如果使用 bash）
source .env
echo $QUERY_ENGINE_API_KEY
```

---

## ⚠️ 注意事项

1. **权限问题：**
   ```bash
   # 如果提示权限不足，使用 sudo
   sudo nano .env
   ```

2. **文件编码：**
   - 确保文件使用 UTF-8 编码
   - 避免使用 Windows 换行符（CRLF），使用 Linux 换行符（LF）

3. **语法错误：**
   - 确保每行格式正确：`KEY=value`
   - 不要有多余的空格
   - 注释行以 `#` 开头

4. **备份：**
   - 编辑前一定要备份
   - 如果出错，可以恢复：
     ```bash
     cp .env.backup.* .env
     ```

---

## 🚀 快速修复 401 错误的完整命令序列

```bash
# 1. 连接到服务器
ssh your_username@your_server_ip

# 2. 进入项目目录
cd ~/Public_Opinion/BettaFish-main

# 3. 备份 .env
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# 4. 编辑 .env
nano .env

# 5. 在 nano 中：
#    - 找到 QUERY_ENGINE_API_KEY= 行
#    - 更新为新的 API Key
#    - 找到 MEDIA_ENGINE_API_KEY= 行
#    - 更新为新的 API Key
#    - Ctrl+O 保存，Enter 确认，Ctrl+X 退出

# 6. 验证修改
grep -E "QUERY_ENGINE_API_KEY|MEDIA_ENGINE_API_KEY" .env

# 7. 重启服务
sudo systemctl restart bettafish

# 8. 检查服务状态
sudo systemctl status bettafish
```

---

## 📝 示例 .env 文件片段

```env
# Query Engine 配置
QUERY_ENGINE_API_KEY=sk-your-new-api-key-here
QUERY_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
QUERY_ENGINE_MODEL_NAME=glm-4.6

# Media Engine 配置
MEDIA_ENGINE_API_KEY=sk-your-new-api-key-here
MEDIA_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
MEDIA_ENGINE_MODEL_NAME=glm-4.6

# Insight Engine 配置
INSIGHT_ENGINE_API_KEY=sk-your-new-api-key-here
INSIGHT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
INSIGHT_ENGINE_MODEL_NAME=glm-4.6

# Report Engine 配置
REPORT_ENGINE_API_KEY=sk-your-new-api-key-here
REPORT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
REPORT_ENGINE_MODEL_NAME=glm-4.6
```

---

**提示：** 如果 nano 不可用，可以使用 `vi` 或 `vim`：
```bash
vi .env
# 或
vim .env
```

