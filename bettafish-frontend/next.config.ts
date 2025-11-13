import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 对于 Cloudflare Pages，不需要设置 output
  // output: 'standalone' 是用于 Node.js 部署的
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://bettafish-api-prod.keithhe2021.workers.dev',
    // LLM API Keys from environment variables
    NEXT_PUBLIC_INSIGHT_ENGINE_API_KEY: process.env.NEXT_PUBLIC_INSIGHT_ENGINE_API_KEY || '',
    NEXT_PUBLIC_MEDIA_ENGINE_API_KEY: process.env.NEXT_PUBLIC_MEDIA_ENGINE_API_KEY || '',
    NEXT_PUBLIC_QUERY_ENGINE_API_KEY: process.env.NEXT_PUBLIC_QUERY_ENGINE_API_KEY || '',
    NEXT_PUBLIC_REPORT_ENGINE_API_KEY: process.env.NEXT_PUBLIC_REPORT_ENGINE_API_KEY || '',
  },
};

export default nextConfig;
