# BettaFish 本地测试 - 分步指导

## 🎯 测试目标

验证以下功能：
1. Workers API可以正常启动
2. 前端可以正常启动
3. 前端可以连接Workers API
4. 所有UI组件正常工作

## 📝 测试步骤（按顺序执行）

### Step 1: 安装依赖 ✅

依赖应该已经安装完成。验证：

```powershell
# 检查Workers依赖
Test-Path "bettafish-workers\node_modules"
# 应该返回 True

# 检查前端依赖
Test-Path "bettafish-frontend\node_modules"
# 应该返回 True
```

### Step 2: 配置环境变量 ✅

环境变量文件应该已创建。验证：

```powershell
# 检查前端环境变量
Get-Content "bettafish-frontend\.env.local"
# 应该显示: NEXT_PUBLIC_API_URL=http://localhost:8787

# 检查Workers环境变量
Get-Content "bettafish-workers\.dev.vars"
# 应该显示环境变量配置
```

### Step 3: 启动Workers API

**打开新的PowerShell终端**（保持当前终端打开）：

```powershell
# 切换到Workers目录
cd D:\Code\Public_Opinion\bettafish-workers

# 启动开发服务器
npm run dev
```

**预期输出**:
```
⎔ Starting local server...
[wrangler:inf] Ready on http://localhost:8787
```

**如果看到错误**:
- 如果是wrangler未登录，运行: `wrangler login`
- 如果是端口被占用，检查是否有其他服务在使用8787端口

**验证API运行**:
- 打开浏览器访问: http://localhost:8787/api/health
- 或运行: `Invoke-WebRequest -Uri "http://localhost:8787/api/health"`

**应该看到**:
```json
{
  "status": "ok",
  "timestamp": "...",
  "environment": "development"
}
```

### Step 4: 启动前端

**打开另一个新的PowerShell终端**：

```powershell
# 切换到前端目录
cd D:\Code\Public_Opinion\bettafish-frontend

# 启动开发服务器
npm run dev
```

**预期输出**:
```
▲ Next.js 16.0.1
- Local:        http://localhost:3000
✓ Ready in X ms
```

**验证前端运行**:
- 打开浏览器访问: http://localhost:3000
- 应该看到BettaFish主界面

### Step 5: 测试API连接

**在浏览器中** (http://localhost:3000):

1. **打开开发者工具** (按F12)
2. **切换到Network标签**
3. **观察API请求**:
   - 应该看到每2秒有 `/api/status` 请求
   - 应该看到每3秒有 `/api/output/:app` 请求（如果Engine运行）
   - 应该看到每5秒有 `/api/forum/log` 请求

4. **检查Console标签**:
   - 不应该有红色错误
   - 可能有警告（后端不可用），这是正常的

### Step 6: 测试各个功能

#### 6.1 测试搜索功能

1. 在搜索框输入: `测试查询`
2. 点击"搜索"按钮
3. **检查Network标签**:
   - 应该看到 `POST /api/search` 请求
   - 请求应该发送到 `http://localhost:8787/api/search`
   - 响应可能是错误（后端未运行），这是正常的

#### 6.2 测试配置管理

1. 点击"配置"按钮
2. **应该看到**:
   - 配置对话框打开
   - 有7个Tab（数据库、Insight、Media、Query、Report、Forum、搜索）
3. **切换Tab**:
   - 每个Tab应该显示相应的配置字段
4. **检查Network标签**:
   - 打开对话框时应该有 `GET /api/config` 请求

#### 6.3 测试Engine管理

1. 查看主内容区域（左侧）
2. **应该看到**:
   - Engine未运行状态
   - "启动Engine"按钮
3. 点击"启动Engine"按钮
4. **检查Network标签**:
   - 应该看到 `POST /api/start/insight` 请求
   - 响应可能是错误（后端未运行），这是正常的

#### 6.4 测试报告生成

1. 点击"生成报告"按钮
2. **应该看到**:
   - 报告生成对话框
   - 查询输入框
   - 自定义模板输入框
3. 输入测试查询，点击"生成报告"
4. **检查Network标签**:
   - 应该看到 `POST /api/report/generate` 请求
   - 可能先有 `GET /api/report/check` 请求

#### 6.5 测试控制台输出

1. 查看右侧控制台区域
2. **应该看到**:
   - 4个Tab按钮（Insight、Media、Query、Report）
   - 控制台输出区域（黑色背景）
   - 显示"等待输出..."或实际输出

### Step 7: 验证错误处理

**测试后端不可用的情况**（当前状态）:

1. **检查状态显示**:
   - 系统状态应该显示后端不可用
   - 这是正常的，因为Python后端未运行

2. **检查错误提示**:
   - 尝试启动Engine，应该看到错误提示
   - 错误应该友好显示，而不是崩溃

3. **检查控制台**:
   - 浏览器Console不应该有未处理的错误
   - 错误应该被正确捕获和显示

## ✅ 测试成功标准

### Workers API
- [x] 可以启动（`npm run dev`成功）
- [x] 健康检查返回200 OK
- [x] 系统状态API正常（即使后端不可用）
- [x] CORS配置正确（前端可以访问）

### 前端
- [x] 可以启动（`npm run dev`成功）
- [x] 页面加载正常
- [x] 所有UI组件显示正常
- [x] API请求正常发送
- [x] 错误处理正常
- [x] 状态轮询正常工作

### 集成
- [x] 前端可以连接Workers API
- [x] API响应正确解析
- [x] 错误信息正确显示
- [x] 无CORS错误

## 🐛 如果遇到问题

### 问题: Workers API无法启动

**检查**:
```powershell
cd bettafish-workers
npm run dev
```

**常见错误和解决**:

1. **"wrangler: command not found"**
   ```powershell
   npm install -g wrangler
   wrangler login
   ```

2. **"Port 8787 already in use"**
   - 关闭占用端口的程序
   - 或修改wrangler.toml中的端口

3. **"Authentication required"**
   ```powershell
   wrangler login
   ```

### 问题: 前端无法连接API

**检查**:
1. Workers API是否运行（http://localhost:8787/api/health）
2. `.env.local` 中的URL是否正确
3. 浏览器Console的错误信息

**解决**:
- 确认API URL: `http://localhost:8787`
- 检查CORS配置
- 清除浏览器缓存

### 问题: 页面显示错误

**检查**:
1. 浏览器Console的错误
2. Network标签的请求状态
3. 代码是否有语法错误

**解决**:
- 检查所有依赖已安装
- 检查环境变量配置
- 查看详细错误信息

## 📊 测试结果记录

完成测试后，记录结果：

### API测试
- 健康检查: ✅ / ❌
- 系统状态: ✅ / ❌
- CORS配置: ✅ / ❌

### 前端测试
- 页面加载: ✅ / ❌
- 搜索功能: ✅ / ❌
- 配置管理: ✅ / ❌
- 报告生成: ✅ / ❌
- Engine管理: ✅ / ❌

### 集成测试
- API连接: ✅ / ❌
- 错误处理: ✅ / ❌
- 状态轮询: ✅ / ❌

## 🎯 下一步

测试通过后：
1. 配置Cloudflare资源
2. 部署到开发环境
3. 进行生产环境测试

---

**现在开始**: 按照Step 3开始启动服务

