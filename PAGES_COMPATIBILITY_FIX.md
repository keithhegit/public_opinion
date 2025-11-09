# ⚡ 快速修复 Node.js 兼容性错误

## 🎯 立即修复步骤

### 1. 打开 Cloudflare Dashboard
访问: https://dash.cloudflare.com

### 2. 进入 Pages 项目
- 左侧菜单 → **Pages**
- 点击项目: **bettafish-frontend**

### 3. 进入设置
- 点击 **Settings** 标签
- 向下滚动找到 **Compatibility Flags**

### 4. 添加兼容性标志

**Production 环境**:
1. 在 **Production** 部分
2. 点击 **Add compatibility flag**
3. 输入或选择: `nodejs_compat`
4. 点击 **Add**

**Preview 环境**:
1. 在 **Preview** 部分
2. 点击 **Add compatibility flag**
3. 输入或选择: `nodejs_compat`
4. 点击 **Add**

### 5. 保存
- 点击页面底部的 **Save** 按钮

### 6. 重新部署
- 点击 **Deployments** 标签
- 点击最新的部署
- 点击 **Retry deployment** 或等待自动重新部署

## ✅ 完成

设置完成后，页面应该可以正常工作了！

---

**详细说明**: 查看 [FIX_NODEJS_COMPAT.md](./FIX_NODEJS_COMPAT.md)

