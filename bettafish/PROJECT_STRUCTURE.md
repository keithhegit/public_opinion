# 项目结构说明

## 📁 文件组织

```
Public_Opinion/
├── README.md                          # 项目主README
├── SUMMARY.md                         # 方案总结
├── CLOUDFLARE_MIGRATION_ASSESSMENT.md # 详细评估报告
├── IMPLEMENTATION_GUIDE.md            # 实施指南
├── PROJECT_STRUCTURE.md               # 本文件
│
├── example-workers/                   # Cloudflare Workers 示例代码
│   ├── src/
│   │   ├── index.ts                  # 主入口文件
│   │   ├── routes/                   # 路由模块
│   │   │   ├── auth.ts               # 认证路由
│   │   │   ├── analysis.ts           # 分析任务路由
│   │   │   ├── sentiment.ts          # 情感分析路由
│   │   │   └── data.ts               # 数据搜索路由
│   │   ├── services/                 # 服务层
│   │   │   ├── openai.ts             # OpenAI API 服务
│   │   │   └── sentiment.ts          # 情感分析服务
│   │   └── utils/                    # 工具函数
│   │       ├── jwt.ts                # JWT Token 处理
│   │       ├── password.ts           # 密码加密
│   │       └── cache.ts              # 缓存工具
│   ├── wrangler.toml                 # Workers 配置文件
│   ├── package.json                  # 依赖配置
│   └── schema.sql                    # 数据库Schema
│
└── example-frontend/                  # Next.js 前端示例
    └── README.md                      # 前端说明文档
```

## 📄 文档说明

### 核心文档

1. **README.md**
   - 项目总览
   - 快速开始指南
   - 方案对比
   - 相关资源链接

2. **SUMMARY.md**
   - 评估结果总结
   - 推荐方案说明
   - 关键决策点
   - 实施时间线
   - 检查清单

3. **CLOUDFLARE_MIGRATION_ASSESSMENT.md**
   - 详细的技术栈分析
   - Cloudflare平台限制说明
   - 三种迁移方案详细对比
   - 技术选型建议
   - 成本估算

4. **IMPLEMENTATION_GUIDE.md**
   - 详细的实施步骤
   - 数据模型设计
   - 核心功能实现示例
   - 性能优化建议
   - 安全考虑
   - 常见问题解答

5. **PROJECT_STRUCTURE.md** (本文件)
   - 项目结构说明
   - 文件用途说明
   - 使用指南

## 🔧 代码文件说明

### Workers API (`example-workers/`)

#### 主入口 (`src/index.ts`)
- Hono 应用初始化
- 中间件配置（CORS、日志、JSON格式化）
- 路由注册
- 错误处理

#### 路由模块 (`src/routes/`)

**auth.ts** - 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息

**analysis.ts** - 分析任务
- `POST /api/analysis/create` - 创建分析任务
- `GET /api/analysis/list` - 获取任务列表
- `GET /api/analysis/:id` - 获取任务详情

**sentiment.ts** - 情感分析
- `POST /api/sentiment/analyze` - 单文本情感分析
- `POST /api/sentiment/analyze/batch` - 批量情感分析

**data.ts** - 数据搜索
- `GET /api/data/search` - 搜索数据

#### 服务层 (`src/services/`)

**openai.ts** - OpenAI API 封装
- `callOpenAI()` - 调用 OpenAI API

**sentiment.ts** - 情感分析服务
- `analyzeSentiment()` - 情感分析主函数
- `simpleSentimentAnalysis()` - 简单关键词匹配（备用）

#### 工具函数 (`src/utils/`)

**jwt.ts** - JWT Token 处理
- `signJWT()` - 生成 Token
- `verifyJWT()` - 验证 Token

**password.ts** - 密码处理
- `hashPassword()` - 密码加密
- `verifyPassword()` - 密码验证

**cache.ts** - 缓存工具
- `getCachedData()` - 获取缓存
- `setCachedData()` - 设置缓存
- `deleteCachedData()` - 删除缓存

### 配置文件

**wrangler.toml** - Workers 配置
- 环境变量配置
- KV 命名空间绑定
- D1 数据库绑定
- 部署配置

**package.json** - 依赖管理
- Hono 框架
- JWT 库 (jose)
- TypeScript 类型定义

**schema.sql** - 数据库结构
- 用户表
- 分析任务表
- 情感分析结果表
- 索引定义

## 🎯 使用指南

### 1. 阅读顺序

**第一步**: 阅读 `README.md` 了解项目概况

**第二步**: 阅读 `SUMMARY.md` 了解推荐方案

**第三步**: 阅读 `CLOUDFLARE_MIGRATION_ASSESSMENT.md` 了解详细评估

**第四步**: 阅读 `IMPLEMENTATION_GUIDE.md` 了解实施细节

**第五步**: 查看 `example-workers/` 中的示例代码

### 2. 代码使用

#### 直接使用示例代码
```bash
# 复制示例代码到新项目
cp -r example-workers my-bettafish-workers
cd my-bettafish-workers

# 安装依赖
npm install

# 配置 wrangler.toml
# 更新 KV 和 D1 的 ID

# 部署
npm run deploy
```

#### 自定义开发
- 参考示例代码结构
- 根据需求修改路由和服务
- 扩展数据库Schema
- 添加新的功能模块

### 3. 配置说明

#### 环境变量设置
```bash
# 使用 Wrangler Secrets
wrangler secret put OPENAI_API_KEY
wrangler secret put JWT_SECRET
```

#### 数据库初始化
```bash
# 创建数据库
wrangler d1 create bettafish-db

# 执行迁移
wrangler d1 execute bettafish-db --file=./schema.sql
```

#### KV 命名空间创建
```bash
# 创建生产环境
wrangler kv:namespace create "BETTAFISH_CACHE"

# 创建预览环境
wrangler kv:namespace create "BETTAFISH_CACHE" --preview
```

## 🔄 扩展建议

### 添加新功能

1. **创建新路由**
   - 在 `src/routes/` 创建新文件
   - 在 `src/index.ts` 注册路由

2. **添加新服务**
   - 在 `src/services/` 创建服务文件
   - 实现业务逻辑

3. **扩展数据库**
   - 更新 `schema.sql`
   - 执行迁移脚本

### 性能优化

1. **缓存策略**
   - 在 `src/utils/cache.ts` 优化缓存逻辑
   - 根据数据特性设置TTL

2. **数据库优化**
   - 添加合适的索引
   - 优化查询语句

3. **API优化**
   - 实现请求去重
   - 使用流式响应

## 📝 注意事项

1. **类型安全**
   - 所有代码使用 TypeScript
   - 定义清晰的接口类型

2. **错误处理**
   - 统一错误处理格式
   - 记录错误日志

3. **安全性**
   - 使用 Secrets 存储敏感信息
   - 实现认证和授权
   - 验证输入数据

4. **测试**
   - 编写单元测试
   - 进行集成测试
   - 性能测试

## 🚀 下一步

1. **熟悉代码结构**
   - 阅读示例代码
   - 理解架构设计

2. **配置环境**
   - 创建 Cloudflare 资源
   - 配置开发环境

3. **开始开发**
   - 根据需求修改代码
   - 添加新功能
   - 测试和部署

---

**提示**: 建议先完整阅读所有文档，再开始代码实施。

