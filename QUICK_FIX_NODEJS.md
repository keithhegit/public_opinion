# ⚡ 快速修复 Node.js 兼容性错误

## 🎯 3步修复

### 1️⃣ 打开 Cloudflare Dashboard
访问: https://dash.cloudflare.com

### 2️⃣ 设置兼容性标志
1. **Pages** → 你的项目 (`bettafish-frontend`)
2. **Settings** → **Functions** → **Compatibility Flags**
3. 添加: `nodejs_compat`
4. 确保 **Production** 和 **Preview** 都设置
5. 点击 **Save**

### 3️⃣ 重新部署
1. **Deployments** 标签
2. 点击 **Retry deployment** 或创建新部署

## ✅ 完成！

等待部署完成后，错误应该消失了。

---

**详细说明**: 查看 [FIX_NODEJS_COMPAT.md](./FIX_NODEJS_COMPAT.md)

