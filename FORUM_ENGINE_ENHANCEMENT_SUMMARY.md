# ForumEngine 功能增强总结

## ✅ 已完成的功能

### 1. 后端 API（全部完成）

#### 1.1 统计信息 API
- **端点**: `GET /api/forum/stats`
- **功能**: 
  - ✅ 总消息数量统计
  - ✅ 各 Engine 发言次数（INSIGHT/MEDIA/QUERY）
  - ✅ HOST 发言次数
  - ✅ 系统消息统计
  - ✅ 平均发言长度
  - ✅ 时间分布（按小时）
  - ✅ 最后活动时间

#### 1.2 状态监控 API
- **端点**: `GET /api/forum/status`
- **功能**:
  - ✅ 监控器运行状态
  - ✅ 搜索会话状态
  - ✅ 主持人状态（启用/禁用/生成中）
  - ✅ 缓冲区大小
  - ✅ 最后活动时间

#### 1.3 历史记录查询 API
- **端点**: `GET /api/forum/history`
- **参数**:
  - `page`: 页码（默认 1）
  - `page_size`: 每页数量（默认 50）
  - `engine`: Engine 过滤（INSIGHT/MEDIA/QUERY/HOST）
  - `start_time`: 开始时间（HH:MM:SS）
  - `end_time`: 结束时间（HH:MM:SS）
- **功能**: ✅ 分页查询历史论坛消息

#### 1.4 消息搜索 API
- **端点**: `GET /api/forum/search`
- **参数**:
  - `keyword`: 关键词（必需）
  - `engine`: Engine 过滤（可选）
  - `start_time`: 开始时间（可选）
  - `end_time`: 结束时间（可选）
  - `limit`: 结果数量限制（默认 100）
- **功能**: ✅ 关键词搜索论坛消息，支持高亮显示

#### 1.5 导出功能 API
- **端点**: `GET /api/forum/export`
- **参数**:
  - `format`: 导出格式（json/csv/html，默认 json）
  - `engine`: Engine 过滤（可选）
  - `start_time`: 开始时间（可选）
  - `end_time`: 结束时间（可选）
- **功能**: ✅ 导出论坛数据为 JSON/CSV/HTML 格式

### 2. Flask 前端增强（部分完成）

#### 2.1 UI 按钮（已添加）
- ✅ 统计按钮（`forumStatsBtn`）
- ✅ 搜索按钮（`forumSearchBtn`）
- ✅ 导出按钮（`forumExportBtn`）
- ✅ 样式已更新

#### 2.2 模态窗口（已添加）
- ✅ 统计信息模态窗口（`forumStatsModal`）
- ✅ 搜索模态窗口（`forumSearchModal`）

#### 2.3 JavaScript 功能（需要补充）
需要在 `BettaFish-main/templates/index.html` 的 JavaScript 部分添加以下功能：

1. **统计信息加载函数** (`loadForumStats`)
   - 调用 `/api/forum/stats` 和 `/api/forum/status`
   - 显示运行状态、消息统计、时间分布

2. **搜索功能** (`forumSearchExecuteBtn` 事件监听)
   - 获取搜索关键词和过滤条件
   - 调用 `/api/forum/search`
   - 显示搜索结果（支持高亮）

3. **导出功能** (`forumExportBtn` 事件监听)
   - 提示用户选择导出格式
   - 构建导出 URL
   - 触发下载

## 📋 待完成的工作

### Flask 前端 JavaScript 实现

需要在 `BettaFish-main/templates/index.html` 的 `<script>` 标签内，在 `forumDownloadBtn` 事件监听器之后添加以下代码：

```javascript
// Forum Engine 统计信息功能
const forumStatsModal = document.getElementById('forumStatsModal');
const forumStatsModalBody = document.getElementById('forumStatsModalBody');
const forumStatsModalClose = document.getElementById('forumStatsModalClose');

document.getElementById('forumStatsBtn').addEventListener('click', function() {
    forumStatsModal.classList.add('active');
    loadForumStats();
});

forumStatsModalClose.addEventListener('click', function() {
    forumStatsModal.classList.remove('active');
});

forumStatsModal.addEventListener('click', function(e) {
    if (e.target === forumStatsModal) {
        forumStatsModal.classList.remove('active');
    }
});

function loadForumStats() {
    forumStatsModalBody.innerHTML = '<div class="forum-log-line">正在加载统计信息...</div>';
    
    Promise.all([
        fetch('/api/forum/stats').then(r => r.json()),
        fetch('/api/forum/status').then(r => r.json())
    ]).then(([statsData, statusData]) => {
        if (statsData.success && statusData.success) {
            const stats = statsData.stats;
            const status = statusData.status;
            
            let html = '<div style="padding: 20px;">';
            
            // 运行状态
            html += '<div style="margin-bottom: 20px; padding: 15px; border: 2px solid #000; background: #f5f5f5;">';
            html += '<h3 style="margin-top: 0;">运行状态</h3>';
            html += `<p><strong>监控状态:</strong> ${status.monitoring ? '运行中' : '已停止'}</p>`;
            html += `<p><strong>搜索会话:</strong> ${status.searching ? '进行中' : '未开始'}</p>`;
            html += `<p><strong>主持人状态:</strong> ${status.host_enabled ? '已启用' : '已禁用'}</p>`;
            html += `<p><strong>主持人生成中:</strong> ${status.host_generating ? '是' : '否'}</p>`;
            html += `<p><strong>缓冲区大小:</strong> ${status.buffer_size} 条消息</p>`;
            html += `<p><strong>最后活动:</strong> ${status.last_activity || '无'}</p>`;
            html += '</div>';
            
            // 消息统计
            html += '<div style="margin-bottom: 20px; padding: 15px; border: 2px solid #000; background: #f5f5f5;">';
            html += '<h3 style="margin-top: 0;">消息统计</h3>';
            html += `<p><strong>总消息数:</strong> ${stats.total_messages}</p>`;
            html += `<p><strong>Insight Engine:</strong> ${stats.engine_counts.INSIGHT} 条</p>`;
            html += `<p><strong>Media Engine:</strong> ${stats.engine_counts.MEDIA} 条</p>`;
            html += `<p><strong>Query Engine:</strong> ${stats.engine_counts.QUERY} 条</p>`;
            html += `<p><strong>Forum Host:</strong> ${stats.host_count} 条</p>`;
            html += `<p><strong>系统消息:</strong> ${stats.system_count} 条</p>`;
            html += `<p><strong>平均长度:</strong> ${stats.avg_length} 字符</p>`;
            html += `<p><strong>总长度:</strong> ${stats.total_length} 字符</p>`;
            html += `<p><strong>最后活动:</strong> ${stats.last_activity || '无'}</p>`;
            html += '</div>';
            
            // 时间分布
            if (Object.keys(stats.hourly_distribution).length > 0) {
                html += '<div style="margin-bottom: 20px; padding: 15px; border: 2px solid #000; background: #f5f5f5;">';
                html += '<h3 style="margin-top: 0;">时间分布（按小时）</h3>';
                const sortedHours = Object.keys(stats.hourly_distribution).sort((a, b) => parseInt(a) - parseInt(b));
                sortedHours.forEach(hour => {
                    const count = stats.hourly_distribution[hour];
                    const barWidth = (count / Math.max(...Object.values(stats.hourly_distribution))) * 100;
                    html += `<div style="margin-bottom: 5px;">`;
                    html += `<span style="display: inline-block; width: 60px;">${hour}:00</span>`;
                    html += `<div style="display: inline-block; width: 200px; height: 20px; background: #ddd; border: 1px solid #000; position: relative;">`;
                    html += `<div style="width: ${barWidth}%; height: 100%; background: #000;"></div>`;
                    html += `</div> <span>${count} 条</span>`;
                    html += `</div>`;
                });
                html += '</div>';
            }
            
            html += '</div>';
            forumStatsModalBody.innerHTML = html;
        } else {
            forumStatsModalBody.innerHTML = '<div class="forum-log-line" style="color: red;">加载失败</div>';
        }
    }).catch(error => {
        console.error('加载Forum统计信息失败:', error);
        forumStatsModalBody.innerHTML = '<div class="forum-log-line" style="color: red;">加载失败: ' + error.message + '</div>';
    });
}

// Forum Engine 搜索功能
const forumSearchModal = document.getElementById('forumSearchModal');
const forumSearchModalClose = document.getElementById('forumSearchModalClose');
const forumSearchResults = document.getElementById('forumSearchResults');
const forumSearchExecuteBtn = document.getElementById('forumSearchExecuteBtn');

document.getElementById('forumSearchBtn').addEventListener('click', function() {
    forumSearchModal.classList.add('active');
});

forumSearchModalClose.addEventListener('click', function() {
    forumSearchModal.classList.remove('active');
});

forumSearchModal.addEventListener('click', function(e) {
    if (e.target === forumSearchModal) {
        forumSearchModal.classList.remove('active');
    }
});

forumSearchExecuteBtn.addEventListener('click', function() {
    const keyword = document.getElementById('forumSearchKeyword').value.trim();
    if (!keyword) {
        alert('请输入搜索关键词');
        return;
    }
    
    const engine = document.getElementById('forumSearchEngine').value;
    const startTime = document.getElementById('forumSearchStartTime').value;
    const endTime = document.getElementById('forumSearchEndTime').value;
    
    forumSearchResults.innerHTML = '<div class="forum-log-line">正在搜索...</div>';
    
    let url = `/api/forum/search?keyword=${encodeURIComponent(keyword)}`;
    if (engine) url += `&engine=${encodeURIComponent(engine)}`;
    if (startTime) url += `&start_time=${encodeURIComponent(startTime)}`;
    if (endTime) url += `&end_time=${encodeURIComponent(endTime)}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.results && data.results.length > 0) {
                    let html = `<div style="margin-bottom: 10px; font-weight: bold;">找到 ${data.total} 条结果</div>`;
                    data.results.forEach(result => {
                        const msgClass = result.type;
                        html += `<div style="margin-bottom: 15px; padding: 10px; border-left: 4px solid ${msgClass === 'host' ? '#ff6b6b' : '#4ecdc4'}; background: #f9f9f9;">`;
                        html += `<div style="font-size: 12px; color: #666; margin-bottom: 5px;">${result.timestamp} - ${result.source}</div>`;
                        html += `<div style="white-space: pre-wrap;">${result.highlighted_content}</div>`;
                        html += `</div>`;
                    });
                    forumSearchResults.innerHTML = html;
                } else {
                    forumSearchResults.innerHTML = '<div class="forum-log-line">未找到匹配的结果</div>';
                }
            } else {
                forumSearchResults.innerHTML = '<div class="forum-log-line" style="color: red;">搜索失败: ' + (data.message || '未知错误') + '</div>';
            }
        })
        .catch(error => {
            console.error('搜索Forum消息失败:', error);
            forumSearchResults.innerHTML = '<div class="forum-log-line" style="color: red;">搜索失败: ' + error.message + '</div>';
        });
});

// Forum Engine 导出功能
document.getElementById('forumExportBtn').addEventListener('click', function() {
    const format = prompt('选择导出格式:\n1. JSON\n2. CSV\n3. HTML\n\n请输入 1、2 或 3:', '1');
    if (!format) return;
    
    const formatMap = {'1': 'json', '2': 'csv', '3': 'html'};
    const exportFormat = formatMap[format];
    if (!exportFormat) {
        alert('无效的格式选择');
        return;
    }
    
    const engine = prompt('过滤 Engine (可选，留空表示全部):\nINSIGHT / MEDIA / QUERY / HOST', '');
    const startTime = prompt('开始时间 (可选，格式: HH:MM:SS，留空表示全部)', '');
    const endTime = prompt('结束时间 (可选，格式: HH:MM:SS，留空表示全部)', '');
    
    let url = `/api/forum/export?format=${exportFormat}`;
    if (engine) url += `&engine=${encodeURIComponent(engine)}`;
    if (startTime) url += `&start_time=${encodeURIComponent(startTime)}`;
    if (endTime) url += `&end_time=${encodeURIComponent(endTime)}`;
    
    window.location.href = url;
});
```

## 🎯 下一步

1. **完成 Flask 前端 JavaScript**：将上述代码添加到 `index.html` 的 `<script>` 标签中
2. **Next.js 前端实现**：在 `bettafish-frontend` 中实现相同的功能
3. **测试**：测试所有新功能是否正常工作

## 📝 注意事项

- 所有后端 API 已实现并测试通过
- Flask 前端的 UI 元素（按钮、模态窗口）已添加
- 需要补充 JavaScript 功能代码
- Next.js 前端需要单独实现（待完成）

