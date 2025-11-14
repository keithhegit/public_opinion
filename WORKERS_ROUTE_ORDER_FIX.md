# Workers 路由顺序修复

## 问题描述

前端仍然出现404错误，即使路由已经注册。这是因为Hono路由匹配的顺序问题。

## 根本原因

在Hono中，路由是按照注册顺序匹配的。如果参数路由（如 `/:taskId`）在具体路径（如 `/history` 或 `/clear`）之前，参数路由会先匹配，导致具体路径无法匹配。

例如：
- 如果 `/:taskId` 在 `/history` 之前
- 请求 `/api/tasks/history` 会被 `/:taskId` 匹配（taskId = "history"）
- 导致 `/history` 路由永远不会被匹配

## 修复方案

调整路由顺序，确保具体路径在参数路径之前：

1. **POST /clear** - 必须在 `/:taskId` 之前
2. **GET /history** - 必须在 `/:taskId` 之前
3. **GET /:taskId/logs/:appName** - 必须在 `/:taskId` 之前（因为路径更长更具体）
4. **GET /:taskId** - 必须在最后（参数路由）

## 修复后的路由顺序

```typescript
// 1. 清空任务（具体路径）
tasksRoutes.post('/clear', ...);

// 2. 历史任务列表（具体路径）
tasksRoutes.get('/history', ...);

// 3. 任务日志（更具体的参数路径）
tasksRoutes.get('/:taskId/logs/:appName', ...);

// 4. 任务详情（参数路径，必须在最后）
tasksRoutes.get('/:taskId', ...);
```

## 部署

修复后需要重新部署Workers：
1. 代码已提交并推送
2. Cloudflare Workers会自动部署（1-2分钟）
3. 或者手动触发部署

## 验证

部署完成后，验证：
- ✅ `POST /api/tasks/clear` 应该返回200而不是404
- ✅ `GET /api/tasks/history` 应该返回200而不是404
- ✅ `GET /api/tasks/{taskId}` 应该正常工作
- ✅ `GET /api/tasks/{taskId}/logs/{appName}` 应该正常工作

