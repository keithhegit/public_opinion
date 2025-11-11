# API Keys 申请指引

本文档提供 BettaFish 系统中所需 API Keys 的申请指引。

## 1. KEYWORD_OPTIMIZER_API_KEY（关键词优化器）

### 作用
- **功能**：将 Agent 生成的搜索查询优化为更适合舆情数据库查询的关键词
- **示例**：将"武汉大学舆情管理 未来展望"优化为"武大"、"武汉大学"、"学校管理"等网民常用词汇
- **重要性**：**优化功能**，非核心功能。如果未配置，系统会使用简单的关键词提取方案，搜索效果可能稍差，但不影响系统运行

### 申请地址
**硅基流动 (SiliconFlow)**
- 官网：https://cloud.siliconflow.cn/
- 申请地址：https://cloud.siliconflow.cn/

### 配置信息
- **API Key 环境变量名**：`KEYWORD_OPTIMIZER_API_KEY`
- **Base URL**：`https://api.siliconflow.cn/v1`
- **模型名称**：`Qwen/Qwen3-30B-A3B-Instruct-2507`

### 申请步骤
1. 访问 https://cloud.siliconflow.cn/
2. 注册/登录账号
3. 在控制台中找到 API Key 管理
4. 创建新的 API Key
5. 复制 API Key 到 Railway 环境变量

### 注意事项
- 这是**可选配置**，如果未设置，系统仍可运行，但关键词优化功能会被禁用
- 系统会使用备用方案（简单的关键词提取）替代

---

## 2. BOCHA_WEB_SEARCH_API_KEY（Bocha 多模态搜索）

### 作用
- **功能**：Media Engine 的核心搜索工具，用于多模态搜索（网页、图片、视频等）
- **重要性**：**核心功能**，Media Engine 完全依赖它进行搜索
- **影响**：如果未配置，Media Engine 将无法进行搜索，会返回空结果

### 申请地址
**Bocha AI（博查）**
- 官网：https://open.bochaai.com/
- 申请地址：https://open.bochaai.com/

### 配置信息
- **API Key 环境变量名**：`BOCHA_WEB_SEARCH_API_KEY` 或 `BOCHA_API_KEY`
- **Base URL**：`https://api.bochaai.com/v1/ai-search`

### 申请步骤
1. 访问 https://open.bochaai.com/
2. 注册/登录账号
3. 在控制台中找到 API Key 管理
4. 创建新的 API Key
5. 复制 API Key 到 Railway 环境变量

### 注意事项
- 这是**必需配置**，如果未设置，Media Engine 无法进行搜索
- 系统会在缺少 API Key 时返回空结果，但不会阻止 Engine 启动

---

## 3. 在 Railway 中配置

### 步骤
1. 登录 Railway Dashboard
2. 选择你的项目（`authentic-growth`）
3. 进入 **Variables** 标签
4. 添加以下环境变量：

```
KEYWORD_OPTIMIZER_API_KEY=你的硅基流动API密钥
BOCHA_WEB_SEARCH_API_KEY=你的Bocha API密钥
```

### 或者使用 Shared Variables
1. 进入项目设置 → **Shared Variables**
2. 添加变量：
   - `KEYWORD_OPTIMIZER_API_KEY`
   - `BOCHA_WEB_SEARCH_API_KEY`
3. 在服务级别的 Variables 中引用：
   - `KEYWORD_OPTIMIZER_API_KEY` = `${{KEYWORD_OPTIMIZER_API_KEY}}`
   - `BOCHA_WEB_SEARCH_API_KEY` = `${{BOCHA_WEB_SEARCH_API_KEY}}`

---

## 4. 功能影响总结

| API Key | 功能 | 重要性 | 未配置的影响 |
|---------|------|--------|--------------|
| `KEYWORD_OPTIMIZER_API_KEY` | 关键词优化 | 优化功能 | 使用简单关键词提取，效果稍差 |
| `BOCHA_WEB_SEARCH_API_KEY` | 多模态搜索 | **核心功能** | Media Engine 无法搜索，返回空结果 |

---

## 5. 测试配置

配置完成后，重新部署服务，然后：

1. **测试 Insight Engine**：
   - 如果 `KEYWORD_OPTIMIZER_API_KEY` 未配置，会看到警告日志，但搜索仍可进行
   - 如果已配置，搜索关键词会被优化

2. **测试 Media Engine**：
   - 如果 `BOCHA_WEB_SEARCH_API_KEY` 未配置，搜索会返回空结果
   - 如果已配置，可以正常进行多模态搜索

---

## 6. 相关链接

- **硅基流动 (SiliconFlow)**：https://cloud.siliconflow.cn/
- **Bocha AI（博查）**：https://open.bochaai.com/
- **Railway Dashboard**：https://railway.app/

