# BettaFish Workers API Gateway

Cloudflare Workers API网关，作为前端和Python后端之间的中间层。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境

1. 登录Cloudflare
```bash
wrangler login
```

2. 创建资源
```bash
# 创建D1数据库
wrangler d1 create bettafish-db

# 创建KV命名空间
wrangler kv:namespace create "BETTAFISH_CACHE"
wrangler kv:namespace create "BETTAFISH_CACHE" --preview
```

3. 更新 `wrangler.toml` 中的ID

4. 设置环境变量（使用secrets）
```bash
wrangler secret put BACKEND_TOKEN
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:8787

### 部署

```bash
# 开发环境
npm run deploy:dev

# 生产环境
npm run deploy
```

## 📁 项目结构

```
src/
├── index.ts              # 主入口
├── routes/               # 路由模块
│   ├── status.ts        # 系统状态
│   ├── engines.ts       # Engine管理
│   ├── search.ts        # 搜索接口
│   ├── config.ts        # 配置管理
│   ├── forum.ts         # 论坛管理
│   └── report.ts        # 报告生成
└── utils/
    └── cache.ts          # 缓存工具
```

## 🔧 API路由

- `GET /api/status` - 系统状态
- `POST /api/start/:app` - 启动Engine
- `POST /api/stop/:app` - 停止Engine
- `GET /api/output/:app` - 获取Engine输出
- `POST /api/search` - 搜索接口
- `GET /api/config` - 获取配置
- `POST /api/config` - 更新配置
- `GET /api/forum/log` - 获取论坛日志
- `POST /api/forum/start` - 启动论坛
- `POST /api/forum/stop` - 停止论坛
- `POST /api/report/generate` - 生成报告
- `GET /api/report/status/:id` - 报告状态
- `GET /api/report/result/:id` - 报告结果
- `GET /api/report/check` - 检查引擎就绪

## 📝 注意事项

- 需要Python后端运行才能完整工作
- 配置 `BACKEND_URL` 指向Python后端
- 使用KV缓存减少后端压力
- 生产环境使用secrets存储敏感信息

