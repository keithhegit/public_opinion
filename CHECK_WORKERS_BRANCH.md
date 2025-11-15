# 检查 Workers 分支配置

## 当前状态

✅ **本地代码**：在 `stable-before-forum` 分支，已包含 tasks 路由  
✅ **已部署**：使用 `wrangler deploy` 已成功部署  
❓ **问题**：后端返回 404，可能是后端未更新

## 可能的问题

### 1. Cloudflare Workers Git 集成

如果 Cloudflare Workers 配置了 Git 集成（自动部署），可能会：
- 从 `main` 分支自动部署
- 覆盖手动部署的代码

### 2. 检查方法

#### 方法 1: 检查 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages**
3. 找到 `bettafish-api-prod` Worker
4. 检查：
   - **Settings** → **Git Integration**
   - 查看是否配置了 Git 集成
   - 如果配置了，查看是哪个分支（可能是 `main`）

#### 方法 2: 检查部署历史

1. 在 Worker 详情页
2. 点击 **Deployments** 标签
3. 查看最新部署：
   - 部署时间
   - 部署来源（Git 还是手动）
   - 版本 ID（应该匹配我们刚才部署的：`245fac35-51ae-4596-afb2-9964b7ce713c`）

## 解决方案

### 如果配置了 Git 集成（从 main 分支）

**选项 1: 合并到 main 分支**
```bash
# 切换到 main 分支
git checkout main

# 合并 stable-before-forum 的更改
git merge stable-before-forum

# 推送
git push origin main

# Git 集成会自动部署
```

**选项 2: 修改 Git 集成配置**
1. 在 Cloudflare Dashboard 中
2. 修改 Git 集成的分支为 `stable-before-forum`
3. 或者禁用 Git 集成，使用手动部署

**选项 3: 继续使用手动部署**
- 每次更新后运行 `npm run deploy`
- 确保 Git 集成不会覆盖

### 如果后端返回 404

即使 Workers 已正确部署，如果后端 Flask 应用还没有更新，也会返回 404。

需要在服务器上更新后端：
```bash
cd /home/bettafish/Public_Opinion/BettaFish-main
git pull
sudo systemctl restart bettafish
```

## 验证步骤

1. **检查 Workers 部署版本**
   - 在 Cloudflare Dashboard 查看最新部署
   - 确认版本 ID 是 `245fac35-51ae-4596-afb2-9964b7ce713c`

2. **测试 Workers 路由**
   - `GET /api/health` - 应该返回 200
   - `GET /api/tasks/history` - 如果 Workers 正确，会转发到后端；如果后端未更新，会返回后端 404

3. **更新后端**
   - 在服务器上拉取最新代码
   - 重启服务
   - 再次测试

## 当前错误分析

错误信息：
```
"Failed to fetch tasks history"
"details": "<!doctype html>...404 Not Found..."
```

这说明：
- ✅ Workers 路由正常工作（能转发请求到后端）
- ❌ 后端 Flask 应用返回 404（说明后端还没有 `/api/tasks/history` 端点）

**结论**：Workers 已正确部署，问题在后端未更新。

