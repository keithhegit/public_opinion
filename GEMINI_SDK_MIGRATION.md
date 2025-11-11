# Gemini SDK 迁移方案

## 当前问题

Report Engine 无法启动，主要原因是 Railway 环境变量 `REPORT_ENGINE_API_KEY` 无法读取。

## 两个解决方案

### 方案 A：修复环境变量读取（推荐，快速）

**优点：**
- ✅ 改动最小
- ✅ 其他 3 个 Engine 已经验证可行
- ✅ 保持代码一致性

**步骤：**
1. 确认 Railway Dashboard → Variables 中已设置 `REPORT_ENGINE_API_KEY`
2. 确认值不为空字符串
3. 等待部署完成后查看新的诊断日志

**如果环境变量已正确设置但仍无法读取，可能是 Pydantic Settings 的问题，需要进一步排查。**

---

### 方案 B：迁移到 Gemini SDK（更稳定，但需要修改代码）

**优点：**
- ✅ 使用官方 SDK，更稳定
- ✅ 不需要 OpenAI 兼容端点
- ✅ 更符合 Google 官方推荐
- ✅ 可能更容易读取环境变量（直接使用 `os.environ`）

**缺点：**
- ❌ 需要修改 Report Engine 的代码
- ❌ 需要安装 `google-generativeai` 包
- ❌ 如果其他 Engine 也要迁移，工作量较大

**已创建的文件：**
- `BettaFish-main/ReportEngine/llms/gemini_client.py` - Gemini SDK 客户端

**迁移步骤：**

1. **修改 `ReportEngine/agent.py`**：
   ```python
   # 从
   from .llms.base import LLMClient
   
   # 改为
   from .llms.gemini_client import GeminiLLMClient as LLMClient
   ```

2. **修改 `ReportEngine/utils/config.py`**：
   - 移除 `REPORT_ENGINE_BASE_URL`（Gemini SDK 不需要）
   - 只保留 `REPORT_ENGINE_API_KEY` 和 `REPORT_ENGINE_MODEL_NAME`

3. **更新 `config.py`**：
   - 移除 `REPORT_ENGINE_BASE_URL` 的默认值

4. **部署并测试**

---

## 我的建议

**先尝试方案 A**，因为：
1. 其他 Engine 已经成功启动，说明 OpenAI SDK + 兼容端点是可行的
2. 主要问题是环境变量读取，不是 SDK 选择
3. 如果环境变量问题解决了，就不需要迁移 SDK

**如果方案 A 失败，再使用方案 B**。

---

## 如何选择？

### 选择方案 A 如果：
- 你想快速解决问题
- 你确认 Railway 环境变量已正确设置
- 你想保持代码一致性

### 选择方案 B 如果：
- 方案 A 无法解决环境变量读取问题
- 你想使用官方推荐的 SDK
- 你愿意修改代码

---

## 下一步

请告诉我你想使用哪个方案，我会帮你实现！

