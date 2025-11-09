# 🚀 立即开始本地测试

## ✅ 准备工作已完成

- ✅ Workers依赖已安装
- ✅ 前端依赖已安装
- ✅ Wrangler CLI已安装
- ✅ 环境变量已配置

## 🎯 现在开始测试（3个简单步骤）

### Step 1: 启动Workers API

**打开新的PowerShell终端窗口**（重要：保持当前窗口打开），运行：

```powershell
cd D:\Code\Public_Opinion\bettafish-workers
npm run dev
```

**等待看到**:
```
⎔ Starting local server...
[wrangler:inf] Ready on http://localhost:8787
```

**✅ 验证**: 
- 打开浏览器访问: http://localhost:8787/api/health
- 应该看到JSON响应: `{"status":"ok","timestamp":"...","environment":"development"}`

**⚠️ 如果看到错误**:
- 如果是"wrangler: command not found"，运行: `npm install -g wrangler`
- 如果是"Authentication required"，运行: `wrangler login`
- 如果是端口被占用，检查是否有其他服务在使用8787端口

### Step 2: 启动前端

**打开另一个新的PowerShell终端窗口**，运行：

```powershell
cd D:\Code\Public_Opinion\bettafish-frontend
npm run dev
```

**等待看到**:
```
▲ Next.js 16.0.1
- Local:        http://localhost:3000
✓ Ready in X ms
```

**✅ 验证**: 
- 打开浏览器访问: http://localhost:3000
- 应该看到BettaFish主界面（搜索框、配置按钮、生成报告按钮）

### Step 3: 测试功能

在浏览器中（http://localhost:3000）进行以下测试：

#### 测试1: 查看主界面 ✅
- [ ] 看到"微舆"标题
- [ ] 看到搜索框
- [ ] 看到"配置"按钮
- [ ] 看到"生成报告"按钮
- [ ] 看到主内容区域（左侧）
- [ ] 看到控制台区域（右侧）

#### 测试2: 打开开发者工具 (F12)
- [ ] Console标签没有红色错误
- [ ] Network标签有API请求（每2秒的status请求）

#### 测试3: 测试配置管理
1. 点击"配置"按钮
2. [ ] 配置对话框打开
3. [ ] 看到7个Tab（数据库、Insight、Media、Query、Report、Forum、搜索）
4. [ ] 可以切换Tab
5. [ ] 每个Tab显示相应的配置字段

#### 测试4: 测试报告生成
1. 点击"生成报告"按钮
2. [ ] 报告对话框打开
3. [ ] 看到查询输入框
4. [ ] 看到自定义模板输入框
5. 输入测试内容，点击"生成报告"
6. [ ] 看到状态提示（可能显示错误，这是正常的，因为后端未运行）

#### 测试5: 测试搜索功能
1. 在搜索框输入: `测试查询`
2. 点击"搜索"按钮
3. [ ] Network标签看到 `POST /api/search` 请求
4. [ ] 请求发送到 `http://localhost:8787/api/search`
5. [ ] 响应可能是错误（后端未运行），这是正常的

#### 测试6: 测试Engine管理
1. 查看主内容区域（左侧）
2. [ ] 看到Engine未运行状态
3. [ ] 看到"启动Engine"按钮
4. 点击"启动Engine"按钮
5. [ ] Network标签看到 `POST /api/start/insight` 请求
6. [ ] 可能显示错误（后端未运行），这是正常的

#### 测试7: 验证API端点
在浏览器中直接访问：
- http://localhost:8787/api/health ✅ 应该返回JSON
- http://localhost:8787/api/status ✅ 应该返回状态（可能显示后端不可用）

## ✅ 测试成功标准

### 必须通过的测试
- [x] Workers API可以启动
- [x] 前端可以启动
- [x] 健康检查API正常
- [x] 前端页面正常显示
- [x] 配置对话框可以打开
- [x] 报告对话框可以打开
- [x] API请求正常发送
- [x] 无CORS错误

### 正常的"错误"
以下情况是**正常的**，因为Python后端未运行：
- 系统状态显示"Backend unreachable" ✅
- 启动Engine返回错误 ✅
- 搜索返回错误 ✅
- 配置读取返回错误 ✅

这些错误说明：
- ✅ Workers API正常工作
- ✅ 前端正确连接API
- ✅ 错误处理正常

## 🐛 如果遇到问题

### 问题1: Workers API无法启动

**检查**:
```powershell
cd bettafish-workers
npm run dev
```

**常见错误**:

1. **"wrangler: command not found"**
   ```powershell
   npm install -g wrangler
   wrangler login
   ```

2. **"Authentication required"**
   ```powershell
   wrangler login
   # 在浏览器中完成登录
   ```

3. **端口被占用**
   ```powershell
   # 检查端口
   netstat -ano | findstr :8787
   # 关闭占用端口的程序，或修改wrangler.toml
   ```

### 问题2: 前端无法连接API

**检查**:
1. Workers API是否运行（访问 http://localhost:8787/api/health）
2. `.env.local` 文件是否存在且内容正确
3. 浏览器Console的错误信息

**解决**:
```powershell
# 检查环境变量
Get-Content bettafish-frontend\.env.local
# 应该显示: NEXT_PUBLIC_API_URL=http://localhost:8787
```

### 问题3: CORS错误

**检查**:
- `wrangler.toml` 中的CORS配置
- 前端URL是否在允许列表中

**解决**:
编辑 `bettafish-workers/src/index.ts`，确保CORS配置包含 `http://localhost:3000`

## 📊 测试结果记录

完成测试后，记录结果：

```
测试日期: ___________
测试人员: ___________

Workers API:
- 启动: ✅ / ❌
- 健康检查: ✅ / ❌
- 系统状态: ✅ / ❌

前端:
- 启动: ✅ / ❌
- 页面加载: ✅ / ❌
- 配置管理: ✅ / ❌
- 报告生成: ✅ / ❌
- 搜索功能: ✅ / ❌

集成:
- API连接: ✅ / ❌
- 错误处理: ✅ / ❌
```

## 🎯 下一步

测试通过后：
1. 配置Cloudflare资源（D1、KV）
2. 部署到开发环境
3. 进行生产环境部署

---

**现在开始**: 
1. 打开第一个终端，运行 `cd bettafish-workers && npm run dev`
2. 打开第二个终端，运行 `cd bettafish-frontend && npm run dev`
3. 在浏览器中测试功能

**详细指南**: 查看 [LOCAL_TESTING_GUIDE.md](./LOCAL_TESTING_GUIDE.md) 或 [STEP_BY_STEP_TESTING.md](./STEP_BY_STEP_TESTING.md)

