# 前端日志清理问题修复总结

## 问题描述

用户报告前端在F5强刷后仍然显示上一次任务的日志，无法清除旧日志。从截图看，前端仍然显示旧的IndentationError错误。

## 根本原因

1. **前端状态管理问题**：页面刷新时，轮询系统状态会保留旧的 `output`
2. **后端日志累积问题**：后端返回整个日志文件内容，日志文件是累积的（追加模式）
3. **前端轮询逻辑问题**：没有检测新任务开始的标记，无法区分新旧任务

## 修复方案

### 前端修复（bettafish-frontend/app/page.tsx）

#### 1. 页面加载时清除所有日志
```typescript
// 页面加载时清除旧日志（只在首次加载时执行）
useEffect(() => {
  setEngines({
    insight: { status: 'stopped', output: '' },
    media: { status: 'stopped', output: '' },
    query: { status: 'stopped', output: '' },
    report: { status: 'stopped', output: '' },
  });
  setForumLog('');
}, []);
```

#### 2. 智能检测新任务开始
- 检测后端日志中的新任务标记（`========== 新任务开始:` 或 `========== 开始执行搜索:`）
- 通过内容hash比较，检测是否是新任务
- 如果检测到新任务，清空旧日志并显示新日志

#### 3. 引擎状态管理优化
- 引擎状态变为 `stopped` 或 `starting` 时，清空其输出
- 避免在状态更新时保留旧输出

### 后端修复（BettaFish-main/app.py）

#### 新任务开始时清空旧日志
```python
# 新任务开始前，清空旧日志文件（只保留引擎启动时的日志）
log_file_path = LOG_DIR / f"{app_name}.log"
if log_file_path.exists():
    # 读取现有日志，保留引擎启动相关的日志行
    startup_lines = [
        line for line in existing_lines 
        if any(keyword in line for keyword in ['已启动', '启动成功', 'Engine', 'Streamlit', 'Running on'])
    ]
    
    # 写入保留的启动日志 + 新任务标记
    with open(log_file_path, 'w', encoding='utf-8') as f:
        f.writelines(startup_lines)
        f.write(f"[{datetime.now().strftime('%H:%M:%S')}] ========== 新任务开始: {query} ==========\n")
```

**优势**：
- 保留引擎启动日志（便于调试）
- 清除旧任务日志（避免混淆）
- 添加新任务标记（前端可检测）

## 修复效果

### 修复前
1. ❌ F5刷新后仍显示旧日志
2. ❌ 新任务开始时，旧日志仍然存在
3. ❌ 无法区分新旧任务日志

### 修复后
1. ✅ F5刷新后自动清除所有日志
2. ✅ 新任务开始时，后端自动清空旧日志（保留启动日志）
3. ✅ 前端智能检测新任务标记，自动清空旧日志
4. ✅ 引擎停止时自动清空输出

## 测试建议

1. **测试F5刷新**：
   - 执行一次搜索，查看日志
   - 按F5刷新页面
   - 验证日志是否被清除

2. **测试新任务开始**：
   - 执行一次搜索，查看日志
   - 执行第二次搜索
   - 验证第一次搜索的日志是否被清除，只显示第二次搜索的日志

3. **测试引擎停止**：
   - 启动引擎，查看日志
   - 停止引擎
   - 验证日志是否被清除

## 提交信息

- **前端**：`Fix: Clear old logs on page refresh and new task start`
- **后端**：`Fix: Clear old logs when new task starts, keep only startup logs`

## 相关文件

- `bettafish-frontend/app/page.tsx` - 前端状态管理和日志轮询逻辑
- `BettaFish-main/app.py` - 后端日志管理和新任务处理逻辑
- `FRONTEND_LOG_CLEAR_FIX.md` - 详细修复文档

