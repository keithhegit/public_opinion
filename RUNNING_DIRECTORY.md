# BettaFish 运行目录说明

## 📁 项目根目录

**当前工作目录**: `D:\Code\Public_Opinion`

这是所有操作的**根目录**，所有命令都应该在这个目录下执行。

## 📂 目录结构

```
D:\Code\Public_Opinion\          ← 项目根目录（运行目录）
├── bettafish-frontend\          ← 前端项目目录
├── bettafish-workers\           ← Workers API项目目录
├── BettaFish-main\              ← 原库代码目录
├── bettafish\                   ← 初步评估文档目录
├── example-workers\              ← 示例代码目录
├── start-test.ps1               ← 测试启动脚本
├── deploy.ps1                   ← 部署脚本
└── README.md                    ← 主README
```

## 🚀 运行命令的位置

### 在项目根目录运行（D:\Code\Public_Opinion）

**启动脚本**:
```powershell
# 当前目录应该是: D:\Code\Public_Opinion
.\start-test.ps1
```

**部署脚本**:
```powershell
# 当前目录应该是: D:\Code\Public_Opinion
.\deploy.ps1
```

### 进入子目录运行

**Workers API**:
```powershell
# 从根目录进入
cd bettafish-workers
npm run dev

# 或使用绝对路径
cd D:\Code\Public_Opinion\bettafish-workers
npm run dev
```

**前端**:
```powershell
# 从根目录进入
cd bettafish-frontend
npm run dev

# 或使用绝对路径
cd D:\Code\Public_Opinion\bettafish-frontend
npm run dev
```

## ✅ 验证当前目录

运行以下命令确认你在正确的目录：

```powershell
# 检查当前目录
Get-Location
# 应该显示: D:\Code\Public_Opinion

# 检查关键文件是否存在
Test-Path "start-test.ps1"        # 应该返回 True
Test-Path "bettafish-workers"     # 应该返回 True
Test-Path "bettafish-frontend"    # 应该返回 True
```

## 🎯 快速测试命令

### 方法1: 使用启动脚本（在根目录）

```powershell
# 确保在根目录
cd D:\Code\Public_Opinion

# 运行启动脚本
.\start-test.ps1
```

### 方法2: 手动启动（分别进入子目录）

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

## 📝 重要提示

1. **所有脚本**（start-test.ps1, deploy.ps1）应该在**根目录**运行
2. **npm命令**（npm run dev）应该在**对应的**子目录**运行
3. **相对路径**都是相对于根目录 `D:\Code\Public_Opinion`

## 🔍 如果目录不对

**切换到正确目录**:
```powershell
cd D:\Code\Public_Opinion
```

**验证**:
```powershell
# 应该能看到这些文件/目录
ls start-test.ps1
ls bettafish-workers
ls bettafish-frontend
```

---

**当前运行目录**: `D:\Code\Public_Opinion` ✅

