# BettaFish Frontend

基于Next.js的BettaFish前端应用，迁移自原Flask应用的HTML界面。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.local.example` 到 `.env.local` 并配置：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 设置API地址：

```env
NEXT_PUBLIC_API_URL=http://localhost:8787
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建

```bash
npm run build
```

### 部署到Cloudflare Pages

```bash
npm run build
npx @cloudflare/next-on-pages
wrangler pages deploy .vercel/output/static
```

## 📁 项目结构

```
app/
├── page.tsx              # 主页面
├── layout.tsx            # 布局
└── globals.css           # 全局样式

components/
├── SearchSection.tsx     # 搜索区域
├── MainContent.tsx       # 主内容区域（Engine展示）
└── ConsoleSection.tsx    # 控制台输出区域

lib/
└── api-client.ts         # API客户端封装
```

## 🔧 功能特性

- ✅ 搜索功能
- ✅ Engine管理（启动/停止）
- ✅ 实时状态展示（轮询）
- ✅ 控制台输出
- ✅ 论坛日志展示
- ⏳ 配置管理（待实现）
- ⏳ 报告生成（待实现）

## 📝 开发计划

### Phase 1 (Week 1-2)
- [x] 项目搭建
- [x] 基础组件
- [ ] 配置管理界面
- [ ] 报告生成界面
- [ ] 实时通信优化

## 🔗 相关文档

- [详细实施计划](../DETAILED_IMPLEMENTATION_PLAN.md)
- [更新迁移方案](../UPDATED_MIGRATION_PLAN.md)
