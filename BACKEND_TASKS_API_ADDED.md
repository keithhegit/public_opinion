# 后端任务管理API已添加

## 问题诊断

从服务器日志看，后端服务已成功重启，但**缺少任务管理API端点**。

检查发现 `BettaFish-main/app.py` 文件中没有 `/api/tasks/*` 相关的路由定义。

## 已添加的功能

### 1. 任务存储目录和索引
- `TASKS_DIR`: 历史任务存储目录 (`tasks_history/`)
- `TASKS_INDEX_FILE`: 任务索引文件 (`tasks_history/tasks_index.json`)

### 2. 任务管理函数
- `load_tasks_index()`: 加载任务索引
- `save_tasks_index()`: 保存任务索引
- `save_task_to_index()`: 保存新任务到索引
- `archive_task_log()`: 归档任务日志

### 3. API端点
- `GET /api/tasks/history`: 获取历史任务列表
- `GET /api/tasks/<task_id>/logs/<app_name>`: 获取指定任务的日志
- `GET /api/tasks/<task_id>`: 获取任务详细信息
- `POST /api/tasks/clear`: 清空当前任务状态

### 4. 任务执行流程改进
- 新任务开始时清空旧日志（保留启动日志）
- 任务完成/失败时自动归档日志
- 使用 `unified_task_id` 关联跨引擎任务

## 下一步

在服务器上执行：

```bash
cd /home/bettafish/Public_Opinion/BettaFish-main
git pull
sudo systemctl restart bettafish
```

然后测试前端功能：
1. 点击"历史任务"按钮 - 应该能正常加载
2. 点击"新任务"按钮 - 应该能正常清空状态

