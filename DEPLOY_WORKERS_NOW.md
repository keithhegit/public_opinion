# 立即部署 Workers

## 测试结果

✅ `/api/health` - 正常工作（200 OK）  
❌ `/api/tasks/history` - 返回 404（代码未部署）

## 问题

Workers 还没有部署最新的代码。Cloudflare Workers **不会自动从 Git 部署**，需要手动使用 `wrangler deploy` 命令。

## 解决方案：手动部署 Workers

### 方法 1: 使用 Wrangler CLI（推荐）

```bash
# 1. 进入 Workers 目录
cd bettafish-workers

# 2. 确保已登录 Cloudflare
npx wrangler login

# 3. 部署到生产环境
npm run deploy
# 或者
npx wrangler deploy --env production
```

### 方法 2: 使用 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages**
3. 找到 `bettafish-api-prod` Worker
4. 点击 **Deployments** 标签
5. 检查最新部署时间
6. 如果需要，可以：
   - 点击 **Create deployment** 手动触发部署
   - 或者通过 Git 集成（如果已配置）

### 方法 3: 检查 Git 集成（如果有）

如果 Workers 配置了 Git 集成：
1. 在 Cloudflare Dashboard 中检查 Git 集成设置
2. 确认分支是否正确（应该是 `stable-before-forum`）
3. 手动触发部署

## 部署后验证

部署完成后，再次测试以下端点：

```bash
# 1. 健康检查（应该返回 200）
curl https://bettafish-api-prod.keithhe2021.workers.dev/api/health

# 2. 历史任务列表（应该返回 200，不再是 404）
curl https://bettafish-api-prod.keithhe2021.workers.dev/api/tasks/history?limit=10

# 3. 清空任务（POST 请求）
curl -X POST https://bettafish-api-prod.keithhe2021.workers.dev/api/tasks/clear
```

## 快速部署命令

如果已经配置好 Wrangler，可以直接运行：

```bash
cd bettafish-workers
npm run deploy
```

## 注意事项

1. **需要 Wrangler CLI**：确保已安装 `wrangler`（`npm install -g wrangler` 或使用 `npx`）
2. **需要登录**：首次部署需要 `wrangler login` 登录 Cloudflare 账号
3. **环境变量**：确保 `wrangler.toml` 中的环境变量已正确配置
4. **部署时间**：部署通常需要 30 秒到 2 分钟

## 部署完成后

部署成功后：
1. 等待 1-2 分钟让 Workers 完全生效
2. 刷新前端页面
3. 测试"历史任务"和"新任务"按钮
4. 应该不再出现 404 错误

