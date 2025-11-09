# 🔧 修复 Node.js 兼容性错误

## 问题

部署后出现错误：
```
Node.JS Compatibility Error
no nodejs_compat compatibility flag set
```

## 解决方案：在 Cloudflare Dashboard 设置兼容性标志

### 方法1: 通过 Dashboard 设置（推荐）

1. **访问 Cloudflare Dashboard**
   - https://dash.cloudflare.com

2. **进入 Pages 项目**
   - 左侧菜单 → **Pages**
   - 点击你的项目: `bettafish-frontend`

3. **进入设置**
   - 点击 **Settings** 标签
   - 在左侧找到 **Functions** 部分
   - 点击 **Compatibility Flags**

4. **添加兼容性标志**
   - 在 **Compatibility Flags** 输入框中输入: `nodejs_compat`
   - 或者点击 **Add flag** 按钮，选择 `nodejs_compat`
   - 确保同时为 **Production** 和 **Preview** 环境设置

5. **保存**
   - 点击 **Save** 按钮

6. **重新部署**
   - 进入 **Deployments** 标签
   - 点击最新的部署
   - 点击 **Retry deployment** 或创建新的部署

### 方法2: 使用 wrangler.toml（如果使用 CLI）

如果使用 wrangler CLI 部署，可以在 `bettafish-frontend/wrangler.toml` 中添加：

```toml
compatibility_flags = ["nodejs_compat"]
```

## ✅ 验证修复

设置完成后：
1. 等待重新部署完成
2. 访问 Pages URL
3. 应该不再出现兼容性错误

---

**按照上述步骤设置兼容性标志即可！** ✅

