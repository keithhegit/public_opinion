# 🔧 Python 后端配置指南

## 当前问题

Workers API 无法连接到 Python 后端，因为 `BACKEND_URL` 配置为占位符。

## 解决方案

### 步骤1: 确认 Python 后端状态

**选项A: Python 后端已部署**
- 如果后端已部署到服务器，记录其 URL（例如：`https://api.yourdomain.com`）

**选项B: Python 后端未部署**
- 需要先部署 Python 后端
- 或者使用本地开发环境

### 步骤2: 更新 Workers API 配置

#### 方法1: 通过 Cloudflare Dashboard（推荐）

1. **访问 Cloudflare Dashboard**
   - https://dash.cloudflare.com
   - 登录账户

2. **进入 Workers & Pages**
   - 左侧菜单 → **Workers & Pages**
   - 点击 **bettafish-api-prod**

3. **进入设置**
   - 点击 **Settings** 标签
   - 向下滚动找到 **Variables**

4. **更新 BACKEND_URL**
   - 找到 `BACKEND_URL` 变量
   - 点击 **Edit**
   - 输入你的 Python 后端 URL（例如：`https://api.yourdomain.com`）
   - 点击 **Save**

5. **重新部署**
   - 进入 **Deployments** 标签
   - 触发新的部署

#### 方法2: 通过 wrangler.toml

1. **编辑 `bettafish-workers/wrangler.toml`**
   ```toml
   [env.production.vars]
   BACKEND_URL = "https://your-actual-backend-url.com"  # 替换为真实URL
   ```

2. **重新部署**
   ```bash
   cd bettafish-workers
   wrangler deploy --env production
   ```

### 步骤3: 验证连接

部署完成后，测试 API：
```bash
curl https://bettafish-api-prod.keithhe2021.workers.dev/api/status
```

应该返回系统状态，而不是 500 错误。

## 本地开发

如果使用本地开发环境：

1. **启动 Python 后端**
   ```bash
   cd BettaFish-main
   python app.py
   ```
   后端应该在 `http://localhost:5000` 运行

2. **使用开发环境的 Workers API**
   - 开发环境的 `BACKEND_URL` 已配置为 `http://localhost:5000`
   - 运行 `npm run dev` 即可

## 注意事项

- **生产环境**: 需要部署 Python 后端到可访问的服务器
- **开发环境**: 使用 `localhost:5000`
- **BACKEND_TOKEN**: 如果后端需要认证，也需要配置此变量

---

**配置完成后，500 错误应该消失！** ✅

