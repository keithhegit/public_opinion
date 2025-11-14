# ForumEngine 功能增强计划

## 📋 当前功能状态

### ✅ 已实现
1. **日志监控和记录**：实时监控三个 Engine 的日志，提取总结内容
2. **论坛主持人**：使用 Qwen3-235B 生成主持人发言，引导讨论
3. **日志查看**：Flask 前端模态窗口查看日志
4. **日志下载**：下载 forum.log 文件
5. **实时推送**：SocketIO 实时推送论坛消息

### 🔄 需要补充的功能

## 1. 后端 API 增强

### 1.1 统计信息 API
- **端点**: `GET /api/forum/stats`
- **功能**: 
  - 总消息数量
  - 各 Engine 发言次数（INSIGHT/MEDIA/QUERY）
  - HOST 发言次数
  - 时间分布（按小时/按天）
  - 最近活动时间
  - 平均发言长度

### 1.2 历史记录查询 API
- **端点**: `GET /api/forum/history`
- **参数**:
  - `start_time`: 开始时间（可选）
  - `end_time`: 结束时间（可选）
  - `engine`: Engine 类型过滤（可选，INSIGHT/MEDIA/QUERY/HOST）
  - `page`: 页码（可选，默认 1）
  - `page_size`: 每页数量（可选，默认 50）
- **功能**: 分页查询历史论坛消息

### 1.3 状态监控 API
- **端点**: `GET /api/forum/status`
- **功能**:
  - 监控器运行状态（running/stopped）
  - 主持人状态（enabled/disabled/generating）
  - 当前搜索会话状态（is_searching）
  - 最近活动时间
  - 缓冲区状态（agent_speeches_buffer 长度）

### 1.4 消息搜索 API
- **端点**: `GET /api/forum/search`
- **参数**:
  - `keyword`: 关键词（必需）
  - `engine`: Engine 过滤（可选）
  - `start_time`: 开始时间（可选）
  - `end_time`: 结束时间（可选）
  - `limit`: 结果数量限制（可选，默认 100）
- **功能**: 关键词搜索论坛消息

### 1.5 导出功能 API
- **端点**: `GET /api/forum/export`
- **参数**:
  - `format`: 导出格式（json/csv/html，默认 json）
  - `start_time`: 开始时间（可选）
  - `end_time`: 结束时间（可选）
  - `engine`: Engine 过滤（可选）
- **功能**: 导出论坛数据为不同格式

## 2. Flask 前端增强

### 2.1 统计面板
- 在 Forum Engine 按钮区域添加统计信息显示
- 显示：总消息数、各 Engine 发言次数、HOST 发言次数
- 实时更新统计信息

### 2.2 时间线可视化
- 在论坛聊天区域添加时间线视图
- 显示消息的时间分布
- 支持按时间筛选

### 2.3 参与度图表
- 使用 Chart.js 或类似库绘制参与度图表
- 显示各 Engine 的发言频率
- 显示 HOST 发言频率

### 2.4 高级搜索界面
- 添加搜索框和过滤选项
- 支持关键词搜索、Engine 过滤、时间范围选择

### 2.5 导出功能界面
- 添加导出按钮
- 支持选择导出格式（JSON/CSV/HTML）
- 支持选择时间范围和 Engine 过滤

## 3. Next.js 前端实现

### 3.1 ForumEngine 组件
- 创建 `ForumEngine.tsx` 组件
- 实现日志查看、统计、搜索、导出功能
- 与后端 API 集成

### 3.2 API 客户端更新
- 在 `api-client.ts` 中添加 ForumEngine 相关 API 方法

## 4. 实现优先级

### 高优先级（核心功能）
1. ✅ 统计信息 API
2. ✅ 状态监控 API
3. ✅ Flask 前端统计面板
4. ✅ Next.js 前端基础功能

### 中优先级（增强功能）
5. ✅ 历史记录查询 API
6. ✅ 消息搜索 API
7. ✅ Flask 前端高级搜索
8. ✅ Next.js 前端完整功能

### 低优先级（优化功能）
9. ✅ 导出功能 API
10. ✅ 时间线可视化
11. ✅ 参与度图表

