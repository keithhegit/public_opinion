# 🚀 立即开始测试

## 快速测试步骤

### 1️⃣ 启动Workers API

**打开新的PowerShell窗口**，运行：

```powershell
cd D:\Code\Public_Opinion\bettafish-workers
npm run dev
```

**等待看到**:
```
Ready on http://localhost:8787
```

**验证**: 打开浏览器访问 http://localhost:8787/api/health

### 2️⃣ 启动前端

**打开另一个PowerShell窗口**，运行：

```powershell
cd D:\Code\Public_Opinion\bettafish-frontend
npm run dev
```

**等待看到**:
```
Ready on http://localhost:3000
```

**验证**: 打开浏览器访问 http://localhost:3000

### 3️⃣ 测试功能

在浏览器中（http://localhost:3000）：

1. **查看主界面** - 应该看到搜索框和按钮
2. **点击"配置"** - 应该打开配置对话框
3. **点击"生成报告"** - 应该打开报告对话框
4. **输入搜索查询** - 点击搜索，查看Network标签的请求
5. **打开开发者工具** (F12) - 检查Console和Network标签

### 4️⃣ 验证API

在浏览器中访问：
- http://localhost:8787/api/health ✅ 应该返回JSON
- http://localhost:8787/api/status ✅ 应该返回状态（可能显示后端不可用）

## ✅ 测试检查

- [ ] Workers API启动成功
- [ ] 前端启动成功
- [ ] 健康检查通过
- [ ] 前端页面正常显示
- [ ] 配置对话框可以打开
- [ ] 报告对话框可以打开
- [ ] 搜索功能可以触发API请求
- [ ] 无控制台错误（后端不可用的警告是正常的）

## 🆘 遇到问题？

查看 [LOCAL_TESTING_GUIDE.md](./LOCAL_TESTING_GUIDE.md) 获取详细帮助。

---

**现在开始**: 按照上述步骤启动服务！

