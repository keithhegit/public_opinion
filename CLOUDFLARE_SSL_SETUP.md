# 使用 Cloudflare SSL 配置后端 HTTPS

## 方案选择

### 方案 1: Cloudflare Flexible SSL（最简单，推荐）

**优点**：
- ✅ 不需要在服务器上配置 SSL 证书
- ✅ 用户到 Cloudflare 是 HTTPS（安全）
- ✅ Cloudflare 到服务器是 HTTP（简单）
- ✅ 配置快速，几分钟完成

**缺点**：
- ⚠️ Cloudflare 到服务器之间是 HTTP（但在 Cloudflare 网络内，相对安全）

### 方案 2: Cloudflare Full SSL（更安全）

**优点**：
- ✅ 全程 HTTPS（用户 → Cloudflare → 服务器）
- ✅ 最安全

**缺点**：
- ⚠️ 需要在服务器上配置 SSL 证书

---

## 方案 1: Flexible SSL（推荐，快速）

### 步骤 1: 在 Cloudflare DNS 中添加 A 记录

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择你的域名 **keithhe.com**
3. 进入 **DNS** → **Records**
4. 点击 **Add record**
5. 配置：
   - **Type**: A
   - **Name**: api
   - **IPv4 address**: 14.136.93.109
   - **Proxy status**: 🟠 Proxied（橙色云朵，重要！）
   - **TTL**: Auto
6. 点击 **Save**

**重要**：必须启用 Proxy（橙色云朵），这样才能使用 Cloudflare 的 SSL 服务。

### 步骤 2: 配置 Cloudflare SSL/TLS

1. 在 Cloudflare Dashboard 中
2. 选择域名 **keithhe.com**
3. 进入 **SSL/TLS** → **Overview**
4. 选择 **Flexible** 模式
5. 等待几分钟让 DNS 和 SSL 生效

### 步骤 3: 更新 Nginx 配置（确保支持 HTTP）

在服务器上，确保 Nginx 配置监听 HTTP（80 端口）：

```bash
# 检查当前配置
sudo cat /etc/nginx/sites-available/bettafish
```

确保配置中有：

```nginx
server {
    listen 80;
    server_name 14.136.93.109 api.keithhe.com;  # 添加域名

    # ... 其他配置保持不变 ...
}
```

如果需要更新：

```bash
sudo nano /etc/nginx/sites-available/bettafish
```

添加域名到 `server_name`：

```nginx
server_name 14.136.93.109 api.keithhe.com;
```

```bash
# 测试并重启
sudo nginx -t
sudo systemctl restart nginx
```

### 步骤 4: 更新 Cloudflare Workers BACKEND_URL

1. 在 Cloudflare Dashboard 中
2. 进入 **Workers & Pages** → **bettafish-api-prod**
3. 点击 **Settings** → **Variables and Secrets**
4. 编辑 `BACKEND_URL` 环境变量
5. 更新为：`https://api.keithhe.com`
6. 保存

### 步骤 5: 测试

```bash
# 测试 HTTPS（从服务器本地）
curl https://api.keithhe.com/api/health

# 测试从外部
# 在浏览器中访问：https://api.keithhe.com/api/health
```

---

## 方案 2: Full SSL（更安全，需要服务器证书）

### 步骤 1-2: 同方案 1（DNS 和 SSL/TLS 设置）

### 步骤 3: 在服务器上配置 SSL 证书

#### 选项 A: 使用 Let's Encrypt（推荐，免费）

```bash
# 1. 安装 Certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# 2. 获取证书（需要域名已解析）
sudo certbot --nginx -d api.keithhe.com

# 3. 测试自动续期
sudo certbot renew --dry-run
```

Certbot 会自动：
- 获取 SSL 证书
- 配置 Nginx
- 设置自动续期

#### 选项 B: 使用 Cloudflare Origin Certificate（更简单）

1. 在 Cloudflare Dashboard 中
2. 进入 **SSL/TLS** → **Origin Server**
3. 点击 **Create Certificate**
4. 配置：
   - **Private key type**: RSA (2048)
   - **Hostnames**: `api.keithhe.com`, `*.keithhe.com`（可选）
   - **Validity**: 15 years
5. 点击 **Create**
6. 复制 **Origin Certificate** 和 **Private Key**

在服务器上：

```bash
# 1. 创建证书目录
sudo mkdir -p /etc/ssl/cloudflare

# 2. 保存 Origin Certificate
sudo nano /etc/ssl/cloudflare/origin.crt
# 粘贴 Origin Certificate 内容

# 3. 保存 Private Key
sudo nano /etc/ssl/cloudflare/origin.key
# 粘贴 Private Key 内容

# 4. 设置权限
sudo chmod 600 /etc/ssl/cloudflare/origin.key
sudo chmod 644 /etc/ssl/cloudflare/origin.crt
```

更新 Nginx 配置：

```bash
sudo nano /etc/nginx/sites-available/bettafish
```

```nginx
# HTTPS 服务器
server {
    listen 443 ssl http2;
    server_name api.keithhe.com;

    ssl_certificate /etc/ssl/cloudflare/origin.crt;
    ssl_certificate_key /etc/ssl/cloudflare/origin.key;

    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... 其他配置保持不变 ...
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name api.keithhe.com;
    return 301 https://$server_name$request_uri;
}
```

```bash
# 测试并重启
sudo nginx -t
sudo systemctl restart nginx
```

### 步骤 4: 配置 Cloudflare SSL/TLS 为 Full

1. 在 Cloudflare Dashboard 中
2. 进入 **SSL/TLS** → **Overview**
3. 选择 **Full** 模式（不是 Full (strict)）

### 步骤 5: 更新 Cloudflare Workers BACKEND_URL

同方案 1 的步骤 4。

---

## 推荐方案

**建议使用方案 1（Flexible SSL）**，因为：
- ✅ 配置最简单
- ✅ 不需要在服务器上管理证书
- ✅ 几分钟就能完成
- ✅ 对于内部服务（Cloudflare → 服务器）已经足够安全

如果以后需要更高安全性，可以升级到方案 2。

---

## 配置完成后的验证

### 1. 测试 DNS 解析

```bash
# 应该返回 Cloudflare 的 IP（不是 14.136.93.109）
nslookup api.keithhe.com
```

### 2. 测试 HTTPS

```bash
# 在服务器上
curl https://api.keithhe.com/api/health

# 在浏览器中
https://api.keithhe.com/api/health
```

### 3. 测试 Workers 连接

更新 `BACKEND_URL` 后，在前端测试 Engine 启动，应该不再有 1003 错误。

---

## 故障排查

### DNS 未生效

- 等待几分钟（DNS 传播需要时间）
- 清除 DNS 缓存：`ipconfig /flushdns`（Windows）

### SSL 证书错误

- 确认 Proxy 状态是 🟠 Proxied
- 确认 SSL/TLS 模式设置正确

### 仍然无法连接

- 检查防火墙是否允许 80/443 端口
- 检查 Nginx 配置是否正确
- 查看 Cloudflare Workers 日志

---

**开始配置吧！推荐先试方案 1（Flexible SSL），最快最简单！** 🚀

