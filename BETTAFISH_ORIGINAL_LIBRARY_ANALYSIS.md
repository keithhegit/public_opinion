# BettaFish 原库深度分析报告

## 📋 分析目标

1. **Bocha API 使用情况**：确认原库使用的是 AI Search API 还是 Web Search API
2. **MindSpider 业务逻辑**：理解其工作机制和作用
3. **Docker 支持情况**：评估项目 Docker 化可行性

---

## 1. 🔍 Bocha API 使用情况分析

### 1.1 原库代码证据

#### 代码注释和文档
- **文件**: `BettaFish-main/MediaEngine/tools/search.py`
- **注释**: "此脚本将复杂的 **Bocha AI Search** 功能分解为一系列目标明确、参数极少的独立工具"
- **版本**: 1.1，最后更新: 2025-08-22

#### 测试输出证据（代码中的示例输出）

从 `search.py` 的测试代码（第 349-411 行）可以看到原库的预期输出：

```python
查询: '人工智能对未来教育的影响' | 会话ID: bf43bfe4c7bb4f7b8a3945515d8ab69e
AI摘要: 人工智能对未来教育有着多方面的影响...
找到 10 个网页, 1 张图片, 1 个模态卡。
第一个模态卡类型: video
建议追问: [['人工智能将如何改变未来的教育模式？', ...]]
```

**关键特征**：
- ✅ `conversation_id` - AI Search API 特有
- ✅ `answer` (AI摘要) - AI Search API 特有
- ✅ `follow_ups` (建议追问) - AI Search API 特有
- ✅ `modal_cards` (模态卡) - AI Search API 特有
- ✅ 视频搜索结果 - AI Search API 支持

### 1.2 原库使用的 API 类型

**结论**: 原库使用的是 **AI Search API** (`/v1/ai-search`)

**证据链**：
1. 代码注释明确提到 "Bocha AI Search"
2. 测试输出包含 AI Search API 的所有特性：
   - `conversation_id` (会话ID)
   - `answer` (AI生成的总结)
   - `follow_ups` (AI生成的追问建议)
   - `modal_cards` (结构化数据卡片)
   - 视频搜索结果
3. 代码中的数据结构 `BochaResponse` 包含这些字段，说明是为 AI Search API 设计的

### 1.3 当前代码状态

**已修改为 Web Search API**：
- Endpoint: `https://api.bochaai.com/v1/web-search` ✅
- 请求参数: `query`, `summary`, `count`, `freshness` ✅
- 响应解析: `webPages.value`, `images.value` ✅

**但数据结构仍保留 AI Search API 的字段**：
- `conversation_id` - Web Search API 不支持
- `answer` - Web Search API 不支持（只有 `summary` 文本摘要）
- `follow_ups` - Web Search API 不支持
- `modal_cards` - Web Search API 不支持

### 1.4 业务影响分析

#### 原库设计的功能（AI Search API）

1. **AI 生成的总结** (`answer`)
   - 用途: Media Engine 使用 AI 总结来理解搜索结果
   - 影响: 如果失去，Agent 需要自己分析原始网页内容

2. **追问建议** (`follow_ups`)
   - 用途: 帮助 Agent 进行迭代搜索
   - 影响: 如果失去，Agent 需要自己生成后续查询

3. **模态卡** (`modal_cards`)
   - 用途: 天气、股票、汇率等结构化数据
   - 影响: 如果失去，无法直接获取结构化信息

4. **视频搜索**
   - 用途: 多模态内容分析
   - 影响: 如果失去，只能搜索网页和图片

#### 当前修改后的功能（Web Search API）

1. ✅ **网页搜索** - 支持
2. ✅ **图片搜索** - 支持
3. ✅ **文本摘要** (`summary`) - 支持（但不是 AI 生成的）
4. ❌ **AI 总结** - 不支持
5. ❌ **追问建议** - 不支持
6. ❌ **模态卡** - 不支持
7. ❌ **视频搜索** - 不支持（当前版本）

### 1.5 关键决策点

**问题**: 原库的业务逻辑是否依赖 AI Search API 的特性？

**分析**:
- Media Engine 的 Agent 可能依赖 `answer` 字段来理解搜索结果
- 如果失去 AI 总结，Agent 需要自己分析原始网页内容，可能影响报告质量
- 模态卡功能在代码中被提及，但可能不是核心功能

**建议**:
1. **短期方案**: 使用 Web Search API（已修改）
   - 解决 401 错误
   - 基本搜索功能可用
   - 需要验证 Agent 是否能正常工作

2. **长期方案**: 确认是否需要 AI Search API
   - 如果业务确实需要 AI 总结和模态卡，需要申请 AI Search API 权限
   - 或者使用其他 API 替代（如 Tavily + LLM 生成总结）

---

## 2. 🕷️ MindSpider 业务逻辑分析

### 2.1 系统概述

**MindSpider** 是一个**智能舆情爬虫系统**，用于构建私有舆情数据库。

**核心价值**:
- 自动发现热点话题
- 从多个平台收集舆情数据
- 为 Insight Engine 提供数据源

### 2.2 架构设计

#### 两步走爬取策略

**第一步: BroadTopicExtraction（话题提取模块）**

```
13个新闻源平台
    ↓
收集热点新闻
    ↓
AI 分析提取话题
    ↓
生成关键词列表
    ↓
保存到数据库 (daily_topics 表)
```

**支持的新闻源**（13个平台）:
1. 微博热搜 (`weibo`)
2. 知乎热榜 (`zhihu`)
3. B站热搜 (`bilibili-hot-search`)
4. 今日头条 (`toutiao`)
5. 抖音热榜 (`douyin`)
6. GitHub趋势 (`github-trending-today`)
7. 酷安热榜 (`coolapk`)
8. 百度贴吧 (`tieba`)
9. 华尔街见闻 (`wallstreetcn`)
10. 澎湃新闻 (`thepaper`)
11. 财联社 (`cls-hot`)
12. 雪球热榜 (`xueqiu`)
13. （可能还有其他）

**数据流**:
- 从 `https://newsnow.busiyi.world` API 获取各平台热点
- 使用 LLM（GLM/Gemini）分析新闻，提取话题和关键词
- 保存到 MySQL 数据库

**第二步: DeepSentimentCrawling（深度爬取模块）**

```
从数据库加载关键词
    ↓
7个社交平台
    ↓
Playwright 浏览器自动化
    ↓
关键词搜索 + 内容爬取
    ↓
解析数据（帖子、评论、互动）
    ↓
保存到数据库
```

**支持的爬取平台**（7个）:
1. 小红书 (`xhs`) - 暂时废弃
2. 抖音 (`dy`)
3. 快手 (`ks`)
4. B站 (`bili`)
5. 微博 (`wb`)
6. 贴吧 (`tieba`)
7. 知乎 (`zhihu`)

### 2.3 技术实现

#### Playwright 的作用

**为什么需要 Playwright**:
1. **登录认证**: 大部分平台需要登录才能访问完整内容
2. **反爬虫对抗**: 使用真实浏览器环境，降低被检测风险
3. **JavaScript 执行**: 某些平台的内容通过 JS 动态加载
4. **登录态保持**: 保存 Cookie 和 Session，避免频繁登录

**技术细节**:
- 使用 Chromium 浏览器
- 支持二维码登录（`qrcode`）
- 支持 Cookie 登录（`cookie`）
- 支持 CDP 模式（Chrome DevTools Protocol）
- 无头模式（`HEADLESS = True`）或可见模式

#### 数据存储

**数据库表结构**:
1. `daily_news` - 每日新闻表
2. `daily_topics` - 每日话题表
3. `topic_news_relation` - 话题新闻关联表
4. `crawling_tasks` - 爬取任务表
5. 平台内容表:
   - `douyin_aweme` - 抖音视频
   - `kuaishou_video` - 快手视频
   - `bilibili_video` - B站视频
   - `weibo_note` - 微博帖子
   - `tieba_note` - 贴吧帖子
   - `zhihu_content` - 知乎内容

### 2.4 业务价值

#### 在 BettaFish 系统中的作用

**数据源提供**:
- Insight Engine 可以从 MindSpider 的数据库查询舆情数据
- 提供私有数据源，不依赖外部 API

**工作流程**:
```
用户查询
    ↓
Insight Engine
    ↓
查询 MindSpider 数据库
    ↓
分析舆情趋势
    ↓
生成报告
```

**优势**:
- ✅ 数据可控
- ✅ 历史数据积累
- ✅ 多平台数据整合
- ✅ 实时热点追踪

### 2.5 使用场景

**典型工作流**:
1. **每日自动运行**:
   ```bash
   python MindSpider/main.py --complete
   ```
   - 自动收集今日热点
   - 自动提取话题
   - 自动爬取各平台内容

2. **手动触发**:
   ```bash
   # 只提取话题
   python MindSpider/main.py --broad-topic
   
   # 只爬取特定平台
   python MindSpider/main.py --deep-sentiment --platforms bili dy
   ```

3. **测试模式**:
   ```bash
   python MindSpider/main.py --complete --test
   ```

### 2.6 依赖关系

**Playwright 安装**:
- 需要安装 Playwright 浏览器驱动
- 命令: `playwright install chromium`
- 在 Dockerfile 中已包含（第 46 行）

**数据库依赖**:
- MySQL 或 PostgreSQL
- 需要配置数据库连接信息

**API 依赖**:
- LLM API（用于话题提取）
- 当前使用 GLM API（已迁移）

---

## 3. 🐳 Docker 支持情况

### 3.1 现有 Docker 配置

#### Dockerfile 分析

**文件位置**: `BettaFish-main/Dockerfile`

**关键配置**:
```dockerfile
FROM python:3.11-slim

# 安装系统依赖
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    # ... 其他依赖

# 安装 Playwright
RUN python -m playwright install chromium --with-deps

# 暴露端口
EXPOSE 5000 8501 8502 8503

# 启动命令
CMD ["python", "app.py"]
```

**特点**:
- ✅ 基于 Python 3.11
- ✅ 已包含 Playwright 安装
- ✅ 已配置必要的系统依赖
- ✅ 使用 uv 进行包管理（更快）

#### docker-compose.yml 分析

**文件位置**: `BettaFish-main/docker-compose.yml`

**服务配置**:
1. **bettafish 服务**:
   - 镜像: `ghcr.io/666ghj/bettafish:latest`
   - 环境变量: 从 `.env` 文件加载
   - 端口映射: 5000, 8501, 8502, 8503
   - 数据卷: logs, reports 目录

2. **db 服务** (PostgreSQL):
   - 镜像: `postgres:15`
   - 数据持久化: `./db_data`

### 3.2 Docker 化可行性

#### ✅ 完全支持 Docker

**证据**:
1. ✅ 已有完整的 Dockerfile
2. ✅ 已有 docker-compose.yml
3. ✅ 原库 GitHub 提供 Docker 镜像: `ghcr.io/666ghj/bettafish:latest`
4. ✅ 已包含 Playwright 安装
5. ✅ 已配置所有必要的系统依赖

#### 需要注意的事项

**1. Playwright 浏览器**:
- ✅ 已在 Dockerfile 中安装 Chromium
- ⚠️ 镜像大小会增加（Playwright 浏览器约 200MB+）

**2. 环境变量**:
- ✅ 支持从 `.env` 文件加载
- ⚠️ 需要确保所有 API Keys 都配置在 `.env` 中

**3. 数据持久化**:
- ✅ 日志目录已挂载
- ✅ 报告目录已挂载
- ⚠️ 数据库数据需要挂载（已有配置）

**4. MindSpider 登录状态**:
- ⚠️ Playwright 的登录状态保存在 `browser_data/` 目录
- ⚠️ 需要确保该目录被持久化，否则每次重启需要重新登录

**5. 端口配置**:
- ✅ Flask: 5000
- ✅ Streamlit (Insight): 8501
- ✅ Streamlit (Media): 8502
- ✅ Streamlit (Query): 8503

### 3.3 Docker 部署建议

#### 方案 1: 使用现有 Dockerfile（推荐）

**优点**:
- ✅ 原库已提供，经过测试
- ✅ 包含所有依赖
- ✅ 可以直接使用

**步骤**:
```bash
# 1. 构建镜像
docker build -t bettafish:latest .

# 2. 使用 docker-compose
docker-compose up -d
```

#### 方案 2: 自定义 Dockerfile

如果需要优化或定制：
- 可以基于现有 Dockerfile 修改
- 添加额外的系统依赖
- 优化镜像大小

#### 方案 3: 多阶段构建（可选）

如果需要减小镜像大小：
- 构建阶段: 安装所有依赖
- 运行阶段: 只保留运行时文件

---

## 4. 📊 综合分析

### 4.1 Bocha API 决策建议

#### 当前情况

**原库设计**: AI Search API
- 支持 AI 总结
- 支持模态卡
- 支持视频搜索

**当前修改**: Web Search API
- 只支持网页和图片搜索
- 不支持 AI 总结
- 不支持模态卡

#### 建议

**方案 A: 保持 Web Search API（当前）**
- ✅ 解决 401 错误
- ✅ API Key 可以正常使用
- ⚠️ 需要验证 Media Engine 是否能正常工作
- ⚠️ 可能影响报告质量（失去 AI 总结）

**方案 B: 恢复 AI Search API**
- ✅ 保留所有功能
- ❌ 需要确认 API Key 是否有权限
- ❌ 如果无权限，需要申请

**方案 C: 混合方案**
- 基础搜索使用 Web Search API
- AI 总结使用 LLM（GLM）生成
- 模态卡功能暂时禁用

**推荐**: **先使用方案 A，测试 Media Engine 功能，如果报告质量下降，再考虑方案 B 或 C**

### 4.2 MindSpider 重要性评估

**核心作用**:
- 🔴 **高重要性**: 为 Insight Engine 提供数据源
- 🔴 **可选但推荐**: 如果不需要私有数据库，可以禁用

**使用建议**:
- 如果只需要基本搜索功能，可以暂时不启用 MindSpider
- 如果需要深度舆情分析，建议启用 MindSpider 构建私有数据库

### 4.3 Docker 部署建议

**完全支持 Docker** ✅

**部署步骤**:
1. 准备 `.env` 文件（包含所有 API Keys）
2. 运行 `docker-compose up -d`
3. 访问 `http://localhost:5000`

**注意事项**:
- 确保 MindSpider 的 `browser_data/` 目录被持久化
- 首次运行需要登录各平台（如果启用 MindSpider）

---

## 5. 🎯 总结

### Bocha API
- **原库使用**: AI Search API (`/v1/ai-search`)
- **当前修改**: Web Search API (`/v1/web-search`)
- **建议**: 先测试当前修改，根据业务需求决定是否恢复 AI Search API

### MindSpider
- **作用**: 智能舆情爬虫，构建私有数据库
- **技术**: Playwright + LLM + MySQL
- **重要性**: 高（为 Insight Engine 提供数据源）
- **Playwright 用途**: 浏览器自动化，登录认证，内容爬取

### Docker
- **支持情况**: ✅ 完全支持
- **已有配置**: Dockerfile + docker-compose.yml
- **建议**: 可以直接使用现有配置部署

---

**下一步行动**:
1. 测试当前 Web Search API 修改是否满足业务需求
2. 如果功能不足，考虑恢复 AI Search API 或使用混合方案
3. 准备 Docker 部署环境变量
4. 测试 Docker 部署

