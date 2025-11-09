# 🚀 BettaFish 如何运行

## 📍 运行目录

**项目根目录**: `D:\Code\Public_Opinion`

这是所有操作的**基础目录**。

## 🎯 快速开始

### 方法1: 使用启动脚本（最简单）

**在项目根目录运行**:
```powershell
# 确保在: D:\Code\Public_Opinion
.\start-test.ps1
```

### 方法2: 手动启动

**打开2个PowerShell终端**:

**终端1 - Workers API**:
```powershell
cd D:\Code\Public_Opinion\bettafish-workers
npm run dev
```

**终端2 - 前端**:
```powershell
cd D:\Code\Public_Opinion\bettafish-frontend
npm run dev
```

## 📂 目录说明

```
D:\Code\Public_Opinion\              ← 项目根目录（运行脚本的目录）
│
├── start-test.ps1                   ← 在这里运行: .\start-test.ps1
├── deploy.ps1                       ← 在这里运行: .\deploy.ps1
│
├── bettafish-workers\               ← 进入这里运行: npm run dev
│   ├── src\
│   ├── package.json
│   └── wrangler.toml
│
└── bettafish-frontend\              ← 进入这里运行: npm run dev
    ├── app\
    ├── components\
    ├── package.json
    └── .env.local
```

## ✅ 验证你在正确目录

运行以下命令：

```powershell
# 查看当前目录
Get-Location

# 应该显示: D:\Code\Public_Opinion

# 检查关键文件
ls start-test.ps1
ls bettafish-workers
ls bettafish-frontend
```

如果这些文件都存在，说明你在正确的目录。

## 🚀 开始测试

### Step 1: 确认目录

```powershell
# 切换到项目根目录（如果不在）
cd D:\Code\Public_Opinion
```

### Step 2: 启动服务

**选项A - 使用脚本**:
```powershell
.\start-test.ps1
```

**选项B - 手动启动**:

打开**第一个终端**:
```powershell
cd D:\Code\Public_Opinion\bettafish-workers
npm run dev
```

打开**第二个终端**:
```powershell
cd D:\Code\Public_Opinion\bettafish-frontend
npm run dev
```

### Step 3: 验证

- Workers API: http://localhost:8787/api/health
- 前端: http://localhost:3000

---

**记住**: 
- 脚本在**根目录**运行: `D:\Code\Public_Opinion`
- npm命令在**子目录**运行: `bettafish-workers` 或 `bettafish-frontend`

