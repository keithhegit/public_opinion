# 修复 Cloudflare 错误代码 1003

## 问题分析

错误代码 **1003** 是 Cloudflare 的连接错误，表示 Workers 无法连接到后端服务器。

### 可能的原因：

1. **Cloudflare Workers 无法连接 HTTP 端点**
   - Cloudflare Workers 可能对 HTTP 连接有安全限制
   - 建议使用 HTTPS

2. **防火墙阻止了 Cloudflare IP**
   - 服务器防火墙可能阻止了 Cloudflare 的 IP 段

3. **BACKEND_URL 配置错误**
   - URL 格式不正确
   - 缺少协议前缀

---

## 解决方案

### 方案1：配置 HTTPS（推荐）

#### 选项 A：使用 Let's Encrypt 免费证书

在服务器上执行：

```bash
# 1. 安装 Certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# 2. 获取证书（如果有域名）
sudo certbot --nginx -d your-domain.com

# 3. 或者使用 IP 地址（需要 Cloudflare Tunnel，见方案2）
```

#### 选项 B：使用自签名证书（仅用于测试）

```bash
# 1. 生成自签名证书
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/bettafish.key \
  -out /etc/ssl/certs/bettafish.crt \
  -subj "/CN=14.136.93.109"

# 2. 配置 Nginx 使用 HTTPS
sudo nano /etc/nginx/sites-available/bettafish
```

添加 HTTPS 配置：

```nginx
server {
    listen 443 ssl;
    server_name 14.136.93.109;

    ssl_certificate /etc/ssl/certs/bettafish.crt;
    ssl_certificate_key /etc/ssl/private/bettafish.key;

    # ... 其他配置保持不变 ...
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name 14.136.93.109;
    return 301 https://$server_name$request_uri;
}
```

```bash
# 3. 测试并重启 Nginx
sudo nginx -t
sudo systemctl restart nginx

# 4. 更新 Cloudflare Workers BACKEND_URL 为 HTTPS
# https://14.136.93.109
```

---

### 方案2：使用 Cloudflare Tunnel（推荐用于生产环境）

Cloudflare Tunnel 可以安全地连接后端，无需开放公网端口。

```bash
# 1. 在服务器上安装 cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb

# 2. 登录 Cloudflare
cloudflared tunnel login

# 3. 创建隧道
cloudflared tunnel create bettafish-backend

# 4. 配置路由（在 Cloudflare Dashboard 中配置）
# 或者使用配置文件

# 5. 运行隧道
cloudflared tunnel run bettafish-backend
```

然后更新 Workers 的 `BACKEND_URL` 为 Cloudflare Tunnel 的 URL。

---

### 方案3：允许 Cloudflare IP 段（临时方案）

如果必须使用 HTTP，需要允许 Cloudflare 的 IP 段访问：

```bash
# 1. 获取 Cloudflare IP 段
# https://www.cloudflare.com/ips/

# 2. 在服务器上允许 Cloudflare IP
sudo ufw allow from 173.245.48.0/20 to any port 80
sudo ufw allow from 103.21.244.0/22 to any port 80
sudo ufw allow from 103.22.200.0/22 to any port 80
sudo ufw allow from 103.31.4.0/22 to any port 80
sudo ufw allow from 141.101.64.0/18 to any port 80
sudo ufw allow from 108.162.192.0/18 to any port 80
sudo ufw allow from 190.93.240.0/20 to any port 80
sudo ufw allow from 188.114.96.0/20 to any port 80
sudo ufw allow from 197.234.240.0/22 to any port 80
sudo ufw allow from 198.41.128.0/17 to any port 80
sudo ufw allow from 162.158.0.0/15 to any port 80
sudo ufw allow from 104.16.0.0/13 to any port 80
sudo ufw allow from 104.24.0.0/14 to any port 80
sudo ufw allow from 172.64.0.0/13 to any port 80
sudo ufw allow from 131.0.72.0/22 to any port 80

# 3. 或者使用脚本自动更新
# 创建脚本更新 Cloudflare IP
```

**注意**：这个方案不推荐，因为：
- HTTP 不安全
- Cloudflare IP 会变化
- 维护成本高

---

### 方案4：检查并修复 BACKEND_URL 配置

1. **检查 Cloudflare Workers 环境变量**
   - 登录 Cloudflare Dashboard
   - 进入 Workers & Pages
   - 选择你的 Worker
   - 检查 `BACKEND_URL` 环境变量
   - 确保格式正确：`http://14.136.93.109` 或 `https://14.136.93.109`

2. **验证后端可访问性**

在服务器上测试：

```bash
# 测试本地访问
curl http://localhost:5000/api/health

# 测试外部访问（从其他机器）
curl http://14.136.93.109/api/health
```

---

## 快速诊断步骤

### 1. 检查后端服务状态

```bash
# 在服务器上
sudo systemctl status bettafish
curl http://localhost:5000/api/health
```

### 2. 检查 Nginx 配置

```bash
sudo nginx -t
sudo systemctl status nginx
```

### 3. 检查防火墙

```bash
sudo ufw status
sudo netstat -tlnp | grep 5000
sudo netstat -tlnp | grep 80
```

### 4. 测试从外部访问

```bash
# 从你的本地机器测试
curl http://14.136.93.109/api/health
curl http://14.136.93.109/
```

### 5. 检查 Cloudflare Workers 日志

- 登录 Cloudflare Dashboard
- 进入 Workers & Pages
- 选择你的 Worker
- 查看 "Logs" 标签
- 查看详细的错误信息

---

## 推荐方案

**最佳实践**：使用 **Cloudflare Tunnel** 或 **HTTPS + Let's Encrypt**

1. **开发/测试环境**：使用 Cloudflare Tunnel（最简单）
2. **生产环境**：使用 HTTPS + Let's Encrypt（最安全）

---

## 临时测试方案

如果急需测试，可以临时：

1. **在服务器上开放所有 IP 访问**（仅用于测试）：
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

2. **检查 BACKEND_URL 是否正确**：
   - 确保是 `http://14.136.93.109`（不是 `https://`）
   - 确保没有尾随斜杠

3. **测试连接**：
   ```bash
   # 从 Cloudflare Workers 测试（使用 curl 或浏览器）
   curl http://14.136.93.109/api/health
   ```

---

## 下一步

选择最适合你的方案并执行。完成后告诉我结果，我会帮你验证。

