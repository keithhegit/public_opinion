# 前端缓存和 Insight Engine 问题修复

## 🔍 问题分析

### 问题 1: 前端刷新后仍显示上次搜索任务状态

**症状**：
- 使用 F5、Shift+F5、Ctrl+F5 刷新页面后，仍然显示上次搜索任务的状态
- 报告生成界面显示之前的任务信息

**根本原因**：
1. 页面加载时，`loadReportInterface()` 会从后端获取 `/api/report/status`
2. 如果后端还有 `current_task`（已完成或出错的任务），会通过 `renderReportInterface()` 恢复显示
3. 前端没有在页面加载时清除已完成/出错的任务状态

**修复方案**：
1. ✅ 在 `performSearch()` 中清除后端已完成/出错的任务
2. ✅ 在 `renderReportInterface()` 中只显示运行中或等待中的任务，不显示已完成/出错的任务

### 问题 2: Insight Engine 无法执行

**症状**：
- Insight Engine 启动失败
- 错误信息：`User location is not supported for the API use.`

**根本原因**：
- Insight Engine 配置使用的是 Gemini API
- 服务器位置（香港）不支持 Gemini API 的地理位置限制

**日志证据**：
```
2025-11-12 17:21:22.437 | ERROR | InsightEngine.llms.base:stream_invoke:147 - 流式请求失败: Error code: 400 - [{'error': {'code': 400, 'message': 'User location is not supported for the API use.', 'status': 'FAILED_PRECONDITION'}}]
```

**修复方案**：
- 需要将 Insight Engine 的 API 配置改为支持香港位置的 API（如 GLM API）
- 检查 `.env` 文件中的 `INSIGHT_ENGINE_API_KEY`、`INSIGHT_ENGINE_BASE_URL` 和 `INSIGHT_ENGINE_MODEL_NAME`

---

## ✅ 已实施的修复

### 1. 前端缓存问题修复

**文件**: `BettaFish-main/templates/index.html`

#### 修复 1: 执行搜索时清除旧任务

在 `performSearch()` 函数中添加了清除后端旧任务的逻辑：

```javascript
// 清除后端可能存在的旧任务（如果已完成或出错）
fetch('/api/report/status')
    .then(response => response.json())
    .then(data => {
        if (data.success && data.current_task) {
            const task = data.current_task;
            // 如果任务已完成或出错，清除它
            if (task.status === 'completed' || task.status === 'error') {
                fetch(`/api/report/cancel/${task.task_id}`, { method: 'POST' })
                    .catch(err => console.log('清除旧任务失败（可能已不存在）:', err));
            }
        }
    })
    .catch(err => console.log('检查报告任务状态失败:', err));
```

#### 修复 2: 页面加载时不显示已完成/出错的任务

在 `renderReportInterface()` 函数中修改了任务显示逻辑：

```javascript
// 如果有当前任务，显示任务状态（但只显示运行中的任务，已完成或出错的任务不显示）
if (statusData.current_task) {
    const task = statusData.current_task;
    // 只显示运行中或等待中的任务，已完成或出错的任务不自动显示（避免页面刷新后显示旧任务）
    if (task.status === 'running' || task.status === 'pending') {
        const taskArea = document.getElementById('taskProgressArea');
        if (taskArea) {
            taskArea.innerHTML = renderTaskStatus(task);
            // 如果任务正在运行，恢复轮询
            if (task.status === 'running' && task.task_id) {
                reportTaskId = task.task_id;
                startProgressPolling(task.task_id);
            }
        }
    }
}
```

---

### 2. Insight Engine 配置检查

**问题**: Insight Engine 使用 Gemini API，但服务器位置不支持

**需要检查的配置**（在 `.env` 文件中）：

```env
# Insight Engine 配置
INSIGHT_ENGINE_API_KEY=你的GLM_API_Key  # 应该使用 GLM API Key，不是 Gemini
INSIGHT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/  # GLM API 端点
INSIGHT_ENGINE_MODEL_NAME=glm-4.6  # GLM 模型名称
```

**当前配置可能的问题**：
- `INSIGHT_ENGINE_API_KEY` 可能是 Gemini API Key
- `INSIGHT_ENGINE_BASE_URL` 可能是 Gemini API 端点
- `INSIGHT_ENGINE_MODEL_NAME` 可能是 `gemini-2.5-pro`

**建议配置**（使用 GLM API，支持香港位置）：
```env
INSIGHT_ENGINE_API_KEY=你的GLM_API_Key
INSIGHT_ENGINE_BASE_URL=https://api.z.ai/api/paas/v4/
INSIGHT_ENGINE_MODEL_NAME=glm-4.6
```

---

## 🧪 测试步骤

### 测试前端缓存修复

1. **执行一次搜索任务**
   - 输入搜索查询
   - 等待任务完成或出错

2. **刷新页面**（F5、Shift+F5 或 Ctrl+F5）
   - 应该不再显示之前的任务状态
   - 报告预览区域应该显示初始状态

3. **执行新的搜索**
   - 输入新的搜索查询
   - 确认旧任务已被清除
   - 新任务正常启动

### 测试 Insight Engine 修复

1. **检查配置**
   ```bash
   # 在服务器上检查 .env 文件
   cat /home/bettafish/Public_Opinion/BettaFish-main/.env | grep INSIGHT_ENGINE
   ```

2. **更新配置**（如果需要）
   ```bash
   # 使用 nano 编辑 .env 文件
   nano /home/bettafish/Public_Opinion/BettaFish-main/.env
   ```

3. **重启服务**
   ```bash
   sudo systemctl restart bettafish
   ```

4. **测试 Insight Engine**
   - 启动 Insight Engine
   - 执行搜索任务
   - 确认不再有地理位置限制错误

---

## 📝 后续建议

### 1. 添加清除任务端点

可以考虑添加一个专门的端点来清除所有已完成/出错的任务：

```python
@app.route('/api/report/clear', methods=['POST'])
def clear_completed_tasks():
    """清除所有已完成或出错的任务"""
    global current_task
    with task_lock:
        if current_task and current_task.status in ["completed", "error"]:
            current_task = None
            return jsonify({'success': True, 'message': '已清除旧任务'})
    return jsonify({'success': True, 'message': '没有需要清除的任务'})
```

### 2. 前端添加清除按钮

在报告界面添加一个"清除任务"按钮，允许用户手动清除已完成的任务。

### 3. 配置验证

添加配置验证逻辑，确保 Insight Engine 使用支持服务器位置的 API。

---

## ⚠️ 注意事项

1. **前端缓存修复**：
   - 已完成的任务不会在页面刷新后自动显示
   - 如果用户需要查看已完成的任务，需要手动触发报告生成或查看历史记录

2. **Insight Engine 配置**：
   - 确保使用支持香港位置的 API（GLM）
   - 不要使用 Gemini API（除非服务器位置支持）

3. **任务状态**：
   - 运行中的任务会在页面刷新后恢复显示（这是预期的行为）
   - 已完成或出错的任务不会自动显示（避免混淆）

---

**修复完成时间**: 2025-11-13

