# 修复 404 错误 - Tasks API

## 问题描述

前端点击"历史任务"和"新任务"按钮时出现404错误：
- `GET /api/tasks/history?limit=50 404 (Not Found)`
- `POST /api/tasks/clear 404 (Not Found)`

## 根本原因

Cloudflare Workers 没有 `/api/tasks/*` 路由，导致所有任务管理API请求返回404。

## 修复方案

### 1. 添加 Workers 路由（bettafish-workers）

创建了 `src/routes/tasks.ts` 文件，包含以下路由：
- `GET /api/tasks/history` - 获取历史任务列表
- `POST /api/tasks/clear` - 清空当前任务状态
- `GET /api/tasks/:taskId` - 获取任务详细信息
- `GET /api/tasks/:taskId/logs/:appName` - 获取任务日志

### 2. 注册路由（bettafish-workers/src/index.ts）

在 `index.ts` 中导入并注册 tasks 路由：
```typescript
import { tasksRoutes } from './routes/tasks';
app.route('/api/tasks', tasksRoutes);
```

### 3. 改进前端日志清除（bettafish-frontend/app/page.tsx）

增强了页面加载时的日志清除逻辑：
- 立即清除所有引擎输出
- 延迟100ms再次清除（确保清除所有状态）

## 部署步骤

### Workers 部署
```bash
cd bettafish-workers
git add src/routes/tasks.ts src/index.ts
git commit -m "Add tasks API routes to Workers"
git push
# Cloudflare Workers 会自动部署
```

### 前端部署
```bash
cd bettafish-frontend
git add app/page.tsx
git commit -m "Improve log clearing on page load"
git push
# Cloudflare Pages 会自动部署
```

### 后端部署（服务器）
```bash
cd /home/bettafish/Public_Opinion/BettaFish-main
git pull
sudo systemctl restart bettafish
```

## 验证

部署完成后，验证以下功能：
1. ✅ 点击"历史任务"按钮，应该能正常加载任务列表
2. ✅ 点击"新任务"按钮，应该能正常清空状态
3. ✅ 页面刷新后，不应该显示旧日志
4. ✅ 查看历史任务日志，应该能正常显示

## 注意事项

1. Workers 部署通常需要几分钟
2. 前端 Pages 部署通常需要1-2分钟
3. 后端需要手动在服务器上更新并重启服务
4. 如果仍然看到404，检查 Workers 是否已成功部署

