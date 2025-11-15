# 合并 Main 分支完整指南

## 📋 目标

统一 `main` 分支，确保后端、Workers 和前端三者代码同步，并正确配置 Cloudflare 部署。

## 🔍 当前状态检查

### Step 1: 检查各目录的分支状态

```bash
# 检查根目录
cd D:\Code\Public_Opinion
git branch -a

# 检查前端
cd bettafish-frontend
git branch -a
git status

# 检查 Workers
cd ../bettafish-workers
git branch -a
git status

# 检查后端
cd ../BettaFish-main
git branch -a
git status
```

---

## 🚀 合并方案（Step by Step）

### Phase 1: 准备阶段

#### Step 1.1: 备份当前状态

```bash
# 在根目录创建备份分支
cd D:\Code\Public_Opinion
git checkout -b backup-before-merge-$(date +%Y%m%d)
git push origin backup-before-merge-$(date +%Y%m%d)
```

#### Step 1.2: 确保所有更改已提交

```bash
# 检查是否有未提交的更改
cd bettafish-frontend
git status
# 如果有未提交的更改，先提交
git add .
git commit -m "WIP: Save current changes before merge"

cd ../bettafish-workers
git status
git add .
git commit -m "WIP: Save current changes before merge"

cd ../BettaFish-main
git status
git add .
git commit -m "WIP: Save current changes before merge"
```

---

### Phase 2: 合并到 Main 分支

#### Step 2.1: 切换到 Main 分支并拉取最新代码

```bash
# 根目录
cd D:\Code\Public_Opinion
git checkout main
git pull origin main

# 前端
cd bettafish-frontend
git checkout main
git pull origin main

# Workers
cd ../bettafish-workers
git checkout main
git pull origin main

# 后端
cd ../BettaFish-main
git checkout main
git pull origin main
```

#### Step 2.2: 合并 stable-before-forum 分支到 main

```bash
# 根目录（如果有 stable-before-forum 分支）
cd D:\Code\Public_Opinion
git merge stable-before-forum --no-ff -m "Merge stable-before-forum into main"

# 如果有冲突，解决冲突后：
git add .
git commit -m "Resolve merge conflicts"

# 前端（如果有 stable-before-forum 分支）
cd bettafish-frontend
git merge stable-before-forum --no-ff -m "Merge stable-before-forum into main"

# Workers（如果有 stable-before-forum 分支）
cd ../bettafish-workers
git merge stable-before-forum --no-ff -m "Merge stable-before-forum into main"

# 后端（如果有 stable-before-forum 分支）
cd ../BettaFish-main
git merge stable-before-forum --no-ff -m "Merge stable-before-forum into main"
```

#### Step 2.3: 推送合并后的代码

```bash
# 根目录
cd D:\Code\Public_Opinion
git push origin main

# 前端
cd bettafish-frontend
git push origin main

# Workers
cd ../bettafish-workers
git push origin main

# 后端
cd ../BettaFish-main
git push origin main
```

---

### Phase 3: 配置 Cloudflare Workers

#### Step 3.1: 检查 Workers Git 集成配置

1. **登录 Cloudflare Dashboard**
   - 访问：https://dash.cloudflare.com/
   - 进入 **Workers & Pages**

2. **找到 bettafish-api-prod Worker**
   - 点击进入 Worker 详情页

3. **检查 Git 集成**
   - 点击 **Settings** → **Git Integration**
   - 查看是否已配置 Git 集成
   - 如果已配置，确认分支是否为 `main`

#### Step 3.2: 配置或更新 Git 集成

**如果未配置 Git 集成：**

1. 在 Worker 详情页，点击 **Settings** → **Git Integration**
2. 点击 **Connect to Git**
3. 选择 GitHub 仓库：`keithhegit/public_opinion`
4. 选择分支：`main`
5. 选择根目录：`bettafish-workers`
6. 配置构建命令：
   ```
   npm install
   npm run build
   ```
7. 配置输出目录：`dist`（或根据实际配置）
8. 点击 **Save**

**如果已配置但分支不是 main：**

1. 在 Git Integration 设置中
2. 修改分支为 `main`
3. 点击 **Save**
4. 系统会自动触发新的部署

#### Step 3.3: 验证 Workers 部署

1. 在 Worker 详情页，点击 **Deployments** 标签
2. 查看最新部署：
   - 应该显示从 `main` 分支部署
   - 部署时间应该是刚才的时间
   - 状态应该是 `Active`

3. **测试 Workers API**
   ```bash
   curl https://bettafish-api-prod.keithhe2021.workers.dev/api/health
   ```

---

### Phase 4: 配置 Cloudflare Pages

#### Step 4.1: 检查 Pages Git 集成配置

1. **在 Cloudflare Dashboard**
   - 进入 **Workers & Pages**
   - 找到 `bettafish-frontend` Pages 项目

2. **检查 Git 集成**
   - 点击项目进入详情页
   - 点击 **Settings** → **Builds & deployments**
   - 查看 **Source** 配置：
     - Repository: 应该是 `keithhegit/public_opinion`
     - Branch: 应该是 `main`
     - Root directory: 应该是 `bettafish-frontend`

#### Step 4.2: 配置或更新 Pages Git 集成

**如果未配置 Git 集成：**

1. 在 Pages 项目详情页
2. 点击 **Connect to Git**
3. 选择 GitHub 仓库：`keithhegit/public_opinion`
4. 选择分支：`main`
5. 配置构建设置：
   - **Framework preset**: `Next.js`
   - **Root directory**: `bettafish-frontend`
   - **Build command**: `npm run build`
   - **Build output directory**: `.next` 或 `out`（根据 Next.js 配置）
   - **Node.js version**: `22` 或 `20`

**如果已配置但分支不是 main：**

1. 在 **Settings** → **Builds & deployments**
2. 点击 **Edit configuration**
3. 修改分支为 `main`
4. 点击 **Save**
5. 系统会自动触发新的构建

#### Step 4.3: 验证 Pages 部署

1. 在 Pages 项目详情页，点击 **Deployments** 标签
2. 查看最新部署：
   - 应该显示从 `main` 分支部署
   - 构建状态应该是 `Success`
   - 部署时间应该是刚才的时间

3. **测试前端**
   - 访问：https://bettafish-frontend.pages.dev
   - 检查页面是否正常加载
   - 检查控制台是否有错误

---

### Phase 5: 更新服务器后端

#### Step 5.1: SSH 到服务器

```bash
ssh bettafish@14.136.93.109
# 或
ssh ubuntu@14.136.93.109
```

#### Step 5.2: 更新后端代码

```bash
# 切换到后端目录
cd /home/bettafish/Public_Opinion/BettaFish-main

# 切换到 main 分支
git checkout main

# 拉取最新代码
git pull origin main

# 检查是否有未提交的更改
git status
```

#### Step 5.3: 安装依赖（如果需要）

```bash
# 激活虚拟环境
source venv/bin/activate

# 检查是否有新的依赖
pip install -r requirements.txt
```

#### Step 5.4: 重启服务

```bash
# 重启 bettafish 服务
sudo systemctl restart bettafish

# 检查服务状态
sudo systemctl status bettafish

# 查看日志
sudo journalctl -u bettafish -n 50 --no-pager
```

#### Step 5.5: 验证后端 API

```bash
# 测试本地 API
curl http://localhost:5000/api/system/status

# 应该返回 JSON 响应
```

---

### Phase 6: 验证完整系统

#### Step 6.1: 测试前端 → Workers → 后端

1. **访问前端**
   - https://bettafish-frontend.pages.dev

2. **测试功能**
   - 点击"历史任务"按钮 → 应该能加载任务列表
   - 点击"新任务"按钮 → 应该能清空状态（不再出现 524 错误）
   - 启动引擎 → 应该能正常启动
   - 执行搜索 → 应该能正常搜索

3. **检查控制台**
   - 打开浏览器开发者工具
   - 查看 Console 标签
   - 不应该有 404、500、524 等错误

#### Step 6.2: 测试 API 端点

```bash
# 测试 Workers API
curl https://bettafish-api-prod.keithhe2021.workers.dev/api/system/status

# 测试历史任务 API
curl https://bettafish-api-prod.keithhe2021.workers.dev/api/tasks/history

# 测试清空任务 API
curl -X POST https://bettafish-api-prod.keithhe2021.workers.dev/api/tasks/clear \
  -H "Content-Type: application/json"
```

---

## 🔧 故障排查

### 问题 1: Git 合并冲突

**症状**: `git merge` 时出现冲突

**解决**:
```bash
# 查看冲突文件
git status

# 手动解决冲突
# 编辑冲突文件，删除冲突标记（<<<<<<, ======, >>>>>>）
# 保留需要的代码

# 标记冲突已解决
git add <冲突文件>

# 完成合并
git commit -m "Resolve merge conflicts"
```

### 问题 2: Workers 部署失败

**症状**: Cloudflare Workers 部署失败

**排查**:
1. 检查 Workers 日志
2. 检查构建命令是否正确
3. 检查 `wrangler.toml` 配置
4. 检查环境变量是否配置

**解决**:
```bash
# 在本地测试构建
cd bettafish-workers
npm install
npm run build

# 如果构建成功，手动部署
npm run deploy
```

### 问题 3: Pages 构建失败

**症状**: Cloudflare Pages 构建失败

**排查**:
1. 查看构建日志
2. 检查 `package.json` 和 `package-lock.json` 是否同步
3. 检查 Next.js 配置

**解决**:
```bash
# 在本地测试构建
cd bettafish-frontend
npm install
npm run build

# 如果构建成功，推送代码触发重新构建
git push origin main
```

### 问题 4: 后端服务无法启动

**症状**: `systemctl status bettafish` 显示失败

**排查**:
```bash
# 查看详细日志
sudo journalctl -u bettafish -n 100 --no-pager

# 检查 Python 依赖
cd /home/bettafish/Public_Opinion/BettaFish-main
source venv/bin/activate
python -c "import flask; print(flask.__version__)"
```

---

## ✅ 完成检查清单

- [ ] 所有代码已合并到 `main` 分支
- [ ] 所有代码已推送到远程仓库
- [ ] Cloudflare Workers Git 集成已配置为 `main` 分支
- [ ] Cloudflare Pages Git 集成已配置为 `main` 分支
- [ ] Workers 已成功部署
- [ ] Pages 已成功构建和部署
- [ ] 服务器后端已更新到 `main` 分支
- [ ] 后端服务已重启并正常运行
- [ ] 前端可以正常访问
- [ ] "历史任务"按钮可以正常工作
- [ ] "新任务"按钮可以正常工作（不再出现 524 错误）
- [ ] 搜索功能可以正常工作

---

## 📝 后续维护

### 日常开发流程

1. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **开发完成后合并到 main**
   ```bash
   git checkout main
   git merge feature/your-feature-name
   git push origin main
   ```

3. **自动部署**
   - Workers 和 Pages 会自动从 `main` 分支部署
   - 后端需要手动在服务器上 `git pull` 和重启服务

### 紧急修复流程

1. **直接在 main 分支修复**
   ```bash
   git checkout main
   # 修复代码
   git add .
   git commit -m "Hotfix: 修复描述"
   git push origin main
   ```

2. **手动触发部署（如果需要）**
   - Workers: 在 Cloudflare Dashboard 中手动触发部署
   - Pages: 在 Cloudflare Dashboard 中手动触发构建
   - 后端: 在服务器上 `git pull` 和重启服务

---

## 🎯 总结

完成以上步骤后，整个系统应该：
- ✅ 所有代码统一在 `main` 分支
- ✅ Cloudflare Workers 自动从 `main` 分支部署
- ✅ Cloudflare Pages 自动从 `main` 分支构建和部署
- ✅ 后端服务器使用 `main` 分支代码
- ✅ 所有功能正常工作，不再出现分支不一致的问题

