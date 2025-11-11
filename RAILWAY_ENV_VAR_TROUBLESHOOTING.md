# Railway 环境变量问题排查

## 问题诊断结果

从 `/api/report/debug` 端点返回的结果显示：
- `"all_report_related_env_vars":{}` - **没有任何 REPORT 或 ENGINE 相关的环境变量**
- `"REPORT_ENGINE_API_KEY_in_env":false` - 环境变量不在 `os.environ` 中
- `"all_env_var_keys"` 只显示了 Railway 自动设置的环境变量（如 `RAILWAY_*`, `PORT`, `PYTHON_*` 等）

## 根本原因

**Railway 的环境变量没有传递到容器中！**

## 可能的原因

### 1. 环境变量作用域错误（最可能）

Railway 有两种环境变量作用域：
- **项目级别（Project-level）**：所有服务共享
- **服务级别（Service-level）**：只对特定服务生效

**检查步骤：**
1. 进入 Railway Dashboard
2. 点击你的项目（不是服务）
3. 查看是否有 "Variables" 标签
4. 如果有，这些是项目级别的变量，可能不会传递到服务

**解决方案：**
- 确保环境变量是在**服务级别**设置的
- 进入 `publicopinion-production` 服务 → Variables 标签
- 确认变量在那里设置

### 2. 服务没有重新部署

环境变量设置后，需要重新部署服务才能生效。

**解决方案：**
1. 进入 Railway Dashboard
2. 选择 `publicopinion-production` 服务
3. 点击 **Deployments** 标签
4. 点击最新的部署
5. 点击 **Redeploy** 按钮

### 3. 环境变量名称或值有问题

**检查步骤：**
1. 确认变量名完全匹配：`REPORT_ENGINE_API_KEY`（区分大小写）
2. 确认值不是空字符串
3. 确认值没有多余的空格或换行符

## 验证步骤

### Step 1: 确认环境变量在服务级别

1. Railway Dashboard → 选择 `publicopinion-production` 服务（不是项目）
2. 点击 **Variables** 标签
3. 确认以下变量存在：
   - `REPORT_ENGINE_API_KEY`
   - `INSIGHT_ENGINE_API_KEY`
   - `MEDIA_ENGINE_API_KEY`
   - `QUERY_ENGINE_API_KEY`

### Step 2: 手动触发重新部署

1. Railway Dashboard → `publicopinion-production` 服务
2. **Deployments** 标签
3. 点击最新的部署
4. 点击 **Redeploy**

### Step 3: 等待部署完成

等待 2-3 分钟，然后再次运行诊断：

```bash
curl https://publicopinion-production.up.railway.app/api/report/debug
```

这次应该能看到 `"all_report_related_env_vars"` 中有值了。

## 解决方案：在服务级别引用 Shared Variables

Railway 的 Shared Variables 需要被服务显式引用才能使用。

### 步骤：

1. **进入服务级别的 Variables**
   - Railway Dashboard → 选择 `publicopinion-production` 服务（不是项目）
   - 点击 **Variables** 标签

2. **添加变量并引用 Shared Variables**
   
   对于每个 API Key，添加变量时：
   - **Variable Name**: `REPORT_ENGINE_API_KEY`
   - **Value**: `${{REPORT_ENGINE_API_KEY}}` （使用 `${{}}` 语法引用 Shared Variable）
   - 点击 **Add**

   重复此步骤添加：
   - `INSIGHT_ENGINE_API_KEY` = `${{INSIGHT_ENGINE_API_KEY}}`
   - `MEDIA_ENGINE_API_KEY` = `${{MEDIA_ENGINE_API_KEY}}`
   - `QUERY_ENGINE_API_KEY` = `${{QUERY_ENGINE_API_KEY}}`
   - `REPORT_ENGINE_API_KEY` = `${{REPORT_ENGINE_API_KEY}}`

3. **重新部署**
   - 部署会自动触发
   - 或手动触发：Deployments → 最新部署 → Redeploy

4. **验证**
   ```bash
   curl https://publicopinion-production.up.railway.app/api/report/debug
   ```
   
   这次应该能看到 `"all_report_related_env_vars"` 中有值了。

## 临时解决方案

如果上述方法仍然不工作，可以通过前端 UI 配置：

1. 打开前端配置界面
2. 输入 `REPORT_ENGINE_API_KEY` 的值
3. 保存配置（会写入 `.env` 文件）
4. 重启服务

**注意：** 这种方式需要重启服务才能生效，且配置保存在 `.env` 文件中。

## 为什么其他 Engine 能工作？

可能的原因：
1. 其他 Engine 的 API Key 是通过前端 UI 配置的（保存在 `.env` 文件中）
2. 或者它们的配置方式不同

让我们检查一下其他 Engine 是如何读取配置的。

