# Cloudflare SSL/TLS Flexible 模式设置指南

## 详细步骤

### 1. 进入 SSL/TLS 设置

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择你的域名 **keithhe.com**（左侧域名列表）
3. 在左侧菜单中找到 **SSL/TLS**（通常在 **Security** 或 **Network** 部分）
4. 点击 **SSL/TLS**

### 2. 找到 Overview 页面

进入 SSL/TLS 后，默认应该就在 **Overview** 标签页。

如果没有，点击顶部的 **Overview** 标签。

### 3. 找到 SSL/TLS encryption mode 设置

在 Overview 页面中，你会看到：

**SSL/TLS encryption mode**

下面有几个选项按钮：

- 🔒 **Off** - 不加密（灰色）
- 🔓 **Flexible** - 灵活模式（推荐）
- 🔒 **Full** - 完整模式
- 🔒 **Full (strict)** - 完整严格模式

### 4. 选择 Flexible 模式

点击 **Flexible** 按钮（通常是第二个选项）。

**Flexible 模式的说明**：
- ✅ 用户到 Cloudflare：HTTPS（加密）
- ✅ Cloudflare 到服务器：HTTP（不加密，但在 Cloudflare 网络内）
- ✅ 不需要服务器 SSL 证书
- ✅ 适合快速配置

### 5. 保存设置

点击后会自动保存，不需要额外的保存按钮。

---

## 如果找不到 SSL/TLS 选项

### 方法 1: 通过左侧菜单

1. 在域名概览页面
2. 左侧菜单栏，找到：
   - **SSL/TLS**（可能在 Security 分组下）
   - 或者 **Security** → **SSL/TLS**

### 方法 2: 通过搜索

1. 在 Cloudflare Dashboard 顶部
2. 使用搜索框搜索 "SSL"
3. 选择 "SSL/TLS" 选项

### 方法 3: 直接 URL

登录后，直接访问：
```
https://dash.cloudflare.com/[你的账户ID]/keithhe.com/ssl-tls
```

（需要替换 `[你的账户ID]` 为实际值）

---

## 界面说明

### SSL/TLS Overview 页面布局

```
┌─────────────────────────────────────┐
│  SSL/TLS                             │
│  [Overview] [Edge Certificates] ... │
├─────────────────────────────────────┤
│                                     │
│  SSL/TLS encryption mode            │
│                                     │
│  [Off]  [Flexible]  [Full]  [...]  │
│         ↑ 点击这个                  │
│                                     │
│  Description:                       │
│  Flexible - Encrypts traffic       │
│  between your visitor and           │
│  Cloudflare, but not to your       │
│  origin server.                     │
│                                     │
└─────────────────────────────────────┘
```

---

## 验证设置

设置完成后：

1. **检查状态**：应该看到 **Flexible** 按钮被选中（高亮显示）
2. **等待生效**：通常立即生效，但可能需要几分钟
3. **测试 HTTPS**：等待几分钟后，访问 `https://api.keithhe.com/api/health`

---

## 常见问题

### Q: 找不到 SSL/TLS 选项？

**A**: 
- 确认你选择的是正确的域名（keithhe.com）
- 确认你的账户有权限访问 SSL/TLS 设置
- 尝试刷新页面

### Q: Flexible 模式安全吗？

**A**: 
- 用户到 Cloudflare 是 HTTPS（安全）
- Cloudflare 到服务器是 HTTP（在 Cloudflare 网络内，相对安全）
- 对于大多数应用场景已经足够
- 如果需要更高安全性，可以后续升级到 Full 模式

### Q: 设置后多久生效？

**A**: 
- 通常立即生效
- DNS 传播可能需要 5-10 分钟
- 建议等待 10 分钟后测试

---

**找到 Flexible 模式了吗？如果还是找不到，告诉我你在 SSL/TLS 页面看到了什么，我会继续帮你！** 🔍

