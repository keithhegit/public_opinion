# 本地完整测试指南 - CORS修复后

## 🎯 测试目标

在CORS修复后，完整测试前端用户流程，确保所有功能正常工作。

---

## 📋 准备工作

### 1. 检查环境变量配置

#### 前端环境变量（可选，默认已配置）

创建 `bettafish-frontend/.env.local`（如果不存在）:
```env
NEXT_PUBLIC_API_URL=http://localhost:8787
```

#### Workers开发环境变量（可选）

创建 `bettafish-workers/.dev.vars`（如果不存在）:
```env
ENVIRONMENT=development
BACKEND_URL=http://localhost:5000
BACKEND_TOKEN=
```

**注意**: 如果Python后端未运行，Workers会返回503错误，这是正常的。

---

## 🚀 启动测试环境

### Step 1: 启动Workers API

**打开PowerShell终端1**:

```powershell
cd D:\Code\Public_Opinion\bettafish-workers
npm run dev
```

**预期输出**:
```
⎔ Starting local server...
[wrangler:inf] Ready on http://localhost:8787
```

**验证**: 
- 打开浏览器访问: http://localhost:8787/api/health
- 应该看到: `{"status":"ok","timestamp":"...","environment":"development"}`

### Step 2: 启动前端

**打开PowerShell终端2**:

```powershell
cd D:\Code\Public_Opinion\bettafish-frontend
npm run dev
```

**预期输出**:
```
▲ Next.js 16.0.1
- Local:        http://localhost:3000
✓ Ready in X ms
```

**验证**: 
- 打开浏览器访问: http://localhost:3000
- 应该看到BettaFish主界面

### Step 3: 启动Python后端（可选）

**打开PowerShell终端3**（如果需要测试完整流程）:

```powershell
cd D:\Code\Public_Opinion\BettaFish-main
python app.py
```

**预期输出**:
```
启动配置 - HOST: 0.0.0.0, PORT: 5000
Flask服务器已启动，访问地址: http://0.0.0.0:5000
```

---

## 🧪 完整用户流程测试

### 测试1: 打开主界面 ✅

**操作**:
1. 打开浏览器访问: http://localhost:3000
2. 打开开发者工具 (F12)

**验证清单**:
- [ ] 看到"微舆"标题
- [ ] 看到搜索框
- [ ] 看到"配置"按钮
- [ ] 看到"生成报告"按钮
- [ ] 看到主内容区域（左侧）
- [ ] 看到控制台区域（右侧）
- [ ] **Console标签没有CORS错误** ✅
- [ ] **Network标签有API请求**（每2秒的status请求）

**预期结果**:
- ✅ 界面正常显示
- ✅ 没有CORS错误
- ✅ API请求正常（即使后端未运行，也应该有请求，只是可能返回503）

---

### 测试2: 测试配置管理 🔧

**操作**:
1. 点击"配置"按钮
2. 查看配置对话框

**验证清单**:
- [ ] 配置对话框正常打开
- [ ] 看到7个Tab（数据库、Insight、Media、Query、Report、Forum、搜索）
- [ ] 可以切换Tab
- [ ] 输入框可以正常输入
- [ ] 点击"保存配置"按钮

**预期结果**:
- ✅ 配置对话框正常显示
- ✅ 可以输入和保存配置
- ✅ **没有CORS错误** ✅
- ✅ 如果后端未运行，会显示错误提示（这是正常的）

**检查Network标签**:
- [ ] `GET /api/config` 请求成功（200）或显示后端未配置（503）
- [ ] `POST /api/config` 请求没有CORS错误
- [ ] 响应头包含 `Access-Control-Allow-Origin: http://localhost:3000`

---

### 测试3: 测试系统状态轮询 📊

**操作**:
1. 保持页面打开
2. 观察Network标签

**验证清单**:
- [ ] 每2秒有 `GET /api/status` 请求
- [ ] 请求没有CORS错误
- [ ] 响应头包含 `Access-Control-Allow-Origin: http://localhost:3000`
- [ ] 前端能正常显示Engine状态

**预期结果**:
- ✅ 状态轮询正常工作
- ✅ **没有CORS错误** ✅
- ✅ 如果后端未运行，状态显示为"未知"或"错误"（这是正常的）

---

### 测试4: 测试Engine启动/停止 🚀

**操作**:
1. 如果Python后端正在运行
2. 在主界面尝试启动Engine（如果有启动按钮）
3. 或通过配置保存后自动启动

**验证清单**:
- [ ] `POST /api/start/insight` 请求成功
- [ ] `POST /api/start/media` 请求成功
- [ ] `POST /api/start/query` 请求成功
- [ ] 所有请求没有CORS错误
- [ ] 响应头包含 `Access-Control-Allow-Origin: http://localhost:3000`

**预期结果**:
- ✅ Engine启动请求正常
- ✅ **没有CORS错误** ✅
- ✅ 前端能显示Engine状态变化

---

### 测试5: 测试Engine输出获取 📝

**操作**:
1. 如果Engine已启动
2. 观察控制台区域是否显示Engine输出

**验证清单**:
- [ ] `GET /api/output/insight` 请求正常
- [ ] `GET /api/output/media` 请求正常
- [ ] `GET /api/output/query` 请求正常
- [ ] 所有请求没有CORS错误
- [ ] 响应头包含 `Access-Control-Allow-Origin: http://localhost:3000`
- [ ] 前端能正常显示Engine输出

**预期结果**:
- ✅ Engine输出请求正常
- ✅ **没有CORS错误** ✅
- ✅ 前端能实时显示Engine日志

---

### 测试6: 测试搜索功能 🔍

**操作**:
1. 在搜索框输入测试查询（如"测试"）
2. 点击搜索或按Enter

**验证清单**:
- [ ] `POST /api/search` 请求正常
- [ ] 请求没有CORS错误
- [ ] 响应头包含 `Access-Control-Allow-Origin: http://localhost:3000`
- [ ] 前端能显示搜索结果或错误提示

**预期结果**:
- ✅ 搜索请求正常
- ✅ **没有CORS错误** ✅
- ✅ 如果后端未运行，会显示错误提示（这是正常的）

---

### 测试7: 测试报告生成 📄

**操作**:
1. 点击"生成报告"按钮
2. 输入查询内容
3. 点击生成

**验证清单**:
- [ ] `POST /api/report/generate` 请求正常
- [ ] `GET /api/report/status/:taskId` 请求正常
- [ ] 所有请求没有CORS错误
- [ ] 响应头包含 `Access-Control-Allow-Origin: http://localhost:3000`
- [ ] 前端能显示报告生成进度

**预期结果**:
- ✅ 报告生成请求正常
- ✅ **没有CORS错误** ✅
- ✅ 前端能显示报告生成状态

---

## 🔍 CORS验证重点

### 检查点1: 响应头

在Network标签中，检查每个API请求的响应头：

**应该包含**:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### 检查点2: Console错误

在Console标签中，**不应该看到**:
- ❌ `Access to fetch at '...' has been blocked by CORS policy`
- ❌ `No 'Access-Control-Allow-Origin' header is present`
- ❌ `CORS policy: No 'Access-Control-Allow-Origin' header`

**应该看到**:
- ✅ 正常的API请求日志
- ✅ 如果后端未运行，会看到503错误（这是正常的，不是CORS问题）

### 检查点3: OPTIONS预检请求

对于POST/PUT/DELETE请求，浏览器会先发送OPTIONS预检请求：

**验证**:
- [ ] OPTIONS请求返回200状态码
- [ ] OPTIONS响应包含正确的CORS头
- [ ] 实际的POST/PUT/DELETE请求正常执行

---

## 📊 测试结果记录

### 测试环境
- **前端URL**: http://localhost:3000
- **Workers API URL**: http://localhost:8787
- **Python后端URL**: http://localhost:5000 (可选)
- **测试时间**: ___________
- **测试人员**: ___________

### 测试结果

| 测试项 | 状态 | CORS错误 | 备注 |
|--------|------|----------|------|
| 主界面加载 | ⬜ | ⬜ | |
| 配置管理 | ⬜ | ⬜ | |
| 状态轮询 | ⬜ | ⬜ | |
| Engine启动 | ⬜ | ⬜ | |
| Engine输出 | ⬜ | ⬜ | |
| 搜索功能 | ⬜ | ⬜ | |
| 报告生成 | ⬜ | ⬜ | |

**状态说明**:
- ✅ 通过
- ❌ 失败
- ⏸️ 跳过（后端未运行）

---

## 🐛 常见问题排查

### 问题1: 仍然看到CORS错误

**可能原因**:
1. Workers API未正确启动
2. CORS配置未生效
3. 浏览器缓存

**解决方法**:
```powershell
# 1. 重启Workers API
# 在终端1按Ctrl+C停止，然后重新运行 npm run dev

# 2. 清除浏览器缓存
# 按Ctrl+Shift+R强制刷新

# 3. 检查Workers API是否运行
# 访问 http://localhost:8787/api/health
```

### 问题2: 所有请求返回503

**可能原因**:
- Python后端未运行

**解决方法**:
- 这是正常的，如果不需要测试完整流程，可以忽略
- 如果需要测试完整流程，启动Python后端

### 问题3: 前端无法连接Workers API

**可能原因**:
- Workers API未启动
- 端口被占用

**解决方法**:
```powershell
# 检查端口占用
netstat -ano | findstr :8787

# 检查Workers API日志
# 查看终端1的输出
```

---

## ✅ 测试完成检查清单

完成所有测试后，确认：

- [ ] 所有API请求没有CORS错误
- [ ] 所有响应头包含正确的CORS配置
- [ ] 前端能正常显示数据
- [ ] 配置管理功能正常
- [ ] 状态轮询正常
- [ ] Engine管理功能正常（如果后端运行）
- [ ] 搜索功能正常（如果后端运行）
- [ ] 报告生成功能正常（如果后端运行）

---

## 📝 测试报告模板

```
测试日期: ___________
测试环境: 本地开发环境
测试人员: ___________

测试结果总结:
- CORS修复: ✅ 通过 / ❌ 失败
- 前端功能: ✅ 正常 / ❌ 异常
- API连接: ✅ 正常 / ❌ 异常

发现的问题:
1. ___________
2. ___________

建议:
1. ___________
2. ___________
```

---

**最后更新**: 2025-11-11
**状态**: ✅ 测试指南完成，可以开始测试

