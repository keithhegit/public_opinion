# Report Engine 启动问题诊断指南

## 🔍 诊断步骤

### 1. 查看 Railway 日志

在 Railway Dashboard 中：
1. 进入你的项目
2. 点击 **Deployments** 标签
3. 查看最新部署的日志
4. 搜索以下关键词：
   - `Report Engine`
   - `initialize_report_engine`
   - `ReportAgent`
   - `ValueError`
   - `Exception`

### 2. 检查关键日志信息

查找以下日志行，它们会告诉你问题所在：

#### ✅ 正常启动应该看到：
```
开始初始化 Report Engine...
从主配置读取 - API_KEY存在: True
从主配置读取 - BASE_URL: https://aihubmix.com/v1
从主配置读取 - MODEL_NAME: gemini-2.5-pro
Report Engine配置创建完成 - API_KEY存在: True
正在创建 ReportAgent 实例...
Report Engine初始化成功
使用模型: gemini-2.5-pro
使用Base URL: https://aihubmix.com/v1
ReportAgent 实例创建成功并验证通过
```

#### ❌ 如果 API Key 未配置，会看到：
```
Report Engine API Key 未配置，请在 config.py 或环境变量中设置 REPORT_ENGINE_API_KEY
主配置中的 REPORT_ENGINE_API_KEY 值: None
环境变量 REPORT_ENGINE_API_KEY: 未设置
```

#### ❌ 如果 Model Name 未配置，会看到：
```
Report Engine Model Name 未配置，请在 config.py 或环境变量中设置 REPORT_ENGINE_MODEL_NAME
主配置中的 REPORT_ENGINE_MODEL_NAME 值: None
环境变量 REPORT_ENGINE_MODEL_NAME: 未设置
```

#### ❌ 如果 LLM 客户端初始化失败，会看到：
```
创建 ReportAgent 时发生 ValueError: Report Engine LLM API key is required.
或
创建 ReportAgent 时发生异常: [具体错误信息]
```

### 3. 检查 Railway 环境变量

在 Railway Dashboard → Variables 中确认以下变量已设置：

```bash
REPORT_ENGINE_API_KEY=你的Gemini_API_Key
REPORT_ENGINE_BASE_URL=https://aihubmix.com/v1  # 可选，有默认值
REPORT_ENGINE_MODEL_NAME=gemini-2.5-pro  # 可选，有默认值
```

### 4. 测试 API 端点

部署完成后，可以通过以下方式测试：

#### 测试启动 Report Engine：
```bash
curl -X POST https://你的Railway后端URL.railway.app/api/start/report
```

#### 检查状态：
```bash
curl https://你的Railway后端URL.railway.app/api/status
```

应该返回：
```json
{
  "report": {
    "status": "running",
    "port": null,
    "output_lines": 0
  }
}
```

## 🐛 常见问题

### 问题 1: API Key 未配置

**症状**：日志显示 `API_KEY存在: False`

**解决方案**：
1. 在 Railway Variables 中设置 `REPORT_ENGINE_API_KEY`
2. 重新部署

### 问题 2: Model Name 未配置

**症状**：日志显示 `MODEL_NAME` 为 None 或空

**解决方案**：
1. 在 Railway Variables 中设置 `REPORT_ENGINE_MODEL_NAME=gemini-2.5-pro`
2. 或确认 `config.py` 中的默认值正确

### 问题 3: LLM 客户端初始化失败

**症状**：日志显示 `ValueError: Report Engine LLM API key is required.`

**可能原因**：
- API Key 虽然设置了，但值为空字符串
- 配置传递过程中丢失

**解决方案**：
1. 检查环境变量值是否正确（没有多余空格）
2. 查看日志中的 `API_KEY长度` 信息

### 问题 4: ReportAgent 创建失败

**症状**：日志显示创建 ReportAgent 时抛出异常

**可能原因**：
- LLM 客户端初始化失败
- 节点初始化失败
- 文件系统权限问题

**解决方案**：
1. 查看完整的异常堆栈
2. 检查 Railway 容器的文件系统权限
3. 确认所有依赖已正确安装

## 📋 验证清单

部署完成后，请检查：

- [ ] Railway 日志中没有错误信息
- [ ] 看到 "Report Engine初始化成功" 日志
- [ ] `/api/status` 返回 `report.status: "running"`
- [ ] 前端显示 Report Engine 状态为 "已启动"

## 🔧 如果仍然无法启动

请提供以下信息：

1. **Railway 日志**：从 "开始初始化 Report Engine" 到错误发生的完整日志
2. **环境变量**：确认 `REPORT_ENGINE_API_KEY` 已设置（可以隐藏实际值）
3. **API 响应**：`/api/start/report` 的响应内容
4. **状态响应**：`/api/status` 中 `report` 部分的内容

这些信息将帮助我准确定位问题。

