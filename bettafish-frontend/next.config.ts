import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 移除 output: 'standalone' - Cloudflare Pages 不需要
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://bettafish-api-prod.keithhe2021.workers.dev',
  },
};

export default nextConfig;
