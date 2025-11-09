# BettaFish Frontend (Next.js)

## 技术栈

- **框架**: Next.js 14+ (App Router)
- **UI库**: TailwindCSS + Shadcn/ui
- **状态管理**: Zustand
- **API客户端**: 自定义 Fetch 封装
- **类型**: TypeScript

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 部署到 Cloudflare Pages
npm run deploy
```

## 项目结构

```
app/
├── (auth)/
│   ├── login/
│   └── register/
├── (dashboard)/
│   ├── analysis/
│   └── sentiment/
├── api/              # API 路由（如需要）
├── components/       # 可复用组件
├── lib/             # 工具函数
│   ├── api-client.ts
│   └── utils.ts
└── layout.tsx
```

## 环境变量

创建 `.env.local`:

```env
NEXT_PUBLIC_WORKERS_API_URL=https://bettafish-api.your-domain.workers.dev
```

## 部署到 Cloudflare Pages

1. 连接 GitHub 仓库
2. 构建命令: `npm run build`
3. 输出目录: `.next`
4. 环境变量: 在 Cloudflare Dashboard 中设置

