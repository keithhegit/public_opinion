# 🔧 Railway ModuleNotFoundError 修复指南

## 问题

Railway 部署时出现 `ModuleNotFoundError: No module named 'config'` 错误。

错误发生在 `MindSpider/main.py` 第 19 行：
```python
from config import settings
```

## 根本原因

`MindSpider` 子目录中的代码试图导入项目根目录的 `config.py` 模块，但 Python 的模块搜索路径（`sys.path`）不包含项目根目录 `/app`。

## ✅ 已完成的修复

### 1. 在 Dockerfile 中设置 PYTHONPATH

添加了 `PYTHONPATH=/app` 环境变量，确保 Python 能找到项目根目录的模块：

```dockerfile
ENV PYTHONPATH=/app
```

### 2. 修复 MindSpider/main.py 中的路径设置

改进了 `sys.path` 的设置逻辑：
- 从 `MindSpider` 目录正确计算项目根目录
- 使用 `sys.path.insert(0, ...)` 确保优先级

## 🚀 下一步

### Step 1: 提交修复代码

```bash
git add BettaFish-main/Dockerfile BettaFish-main/MindSpider/main.py RAILWAY_MODULE_NOT_FOUND_FIX.md
git commit -m "Fix ModuleNotFoundError: set PYTHONPATH and fix import paths"
git push
```

### Step 2: 等待 Railway 重新部署

Railway 会自动检测到 GitHub 更新并重新部署。

### Step 3: 检查部署日志

1. 打开 Railway Dashboard
2. 进入 **Deployments** 标签
3. 查看最新的部署日志
4. 确认不再出现 `ModuleNotFoundError`

## 📋 验证清单

- [ ] `PYTHONPATH=/app` 已添加到 Dockerfile
- [ ] `MindSpider/main.py` 中的路径设置已修复
- [ ] 代码已推送到 GitHub
- [ ] Railway 开始重新部署
- [ ] 部署日志中没有 `ModuleNotFoundError`
- [ ] 应用成功启动

## ⚠️ 注意事项

1. **PYTHONPATH**: 设置为 `/app`（Docker 容器中的工作目录）
2. **路径计算**: `MindSpider/main.py` 需要从 `MindSpider` 目录回到项目根目录
3. **其他模块**: 如果还有其他模块出现类似问题，也需要检查它们的导入路径

## 🔍 如果仍然有问题

### 检查其他文件的导入

如果还有其他文件出现 `ModuleNotFoundError`，检查它们的导入方式：

1. **相对导入**（推荐）:
   ```python
   from ..config import settings  # 从父目录导入
   ```

2. **绝对导入**（需要 PYTHONPATH）:
   ```python
   from config import settings  # 需要 PYTHONPATH=/app
   ```

3. **动态添加路径**:
   ```python
   import sys
   from pathlib import Path
   sys.path.insert(0, str(Path(__file__).parent.parent))
   from config import settings
   ```

---

**现在提交代码并等待 Railway 重新部署！** 🚀

