# 🔧 修复 Node.js 兼容性错误

## 问题

部署后出现错误：
```
Node.JS Compatibility Error
no nodejs_compat compatibility flag set
```

## 解决方案

需要在 Cloudflare Pages 项目中添加 `nodejs_compat` 兼容性标志。

### 方法1: 在 Cloudflare Dashboard 设置（推荐）

1. **访问 Cloudflare Dashboard**
   - https://dash.cloudflare.com

2. **进入 Pages 项目**
   - 左侧菜单 → **Pages**
   - 点击你的项目: `bettafish-frontend`

3. **进入设置**
   - 点击 **Settings** 标签
   - 找到 **Compatibility Flags** 部分

4. **添加兼容性标志**
   - 在 **Production** 环境:
     - 点击 **Add compatibility flag**
     - 选择 `nodejs_compat`
   - 在 **Preview** 环境:
     - 点击 **Add compatibility flag**
     - 选择 `nodejs_compat`

5. **保存并重新部署**
   - 点击 **Save**
   - 触发新的部署（或等待自动部署）

### 方法2: 通过 wrangler.toml 配置（如果使用）

如果使用 wrangler 部署，可以在配置文件中添加：

```toml
compatibility_flags = ["nodejs_compat"]
```

## ✅ 验证

添加标志后，重新部署并访问页面，错误应该消失。

---

**按照方法1在Dashboard中设置即可！** 🚀
