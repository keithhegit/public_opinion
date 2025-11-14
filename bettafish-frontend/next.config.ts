import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 移除 output: 'standalone' - Cloudflare Pages 不需要
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://bettafish-api-prod.keithhe2021.workers.dev',
  },
  
  // 允许外部图片域名
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-c98d5902eedf42f6a9765dfad981fd88.r2.dev',
        pathname: '/**',
      },
    ],
    unoptimized: true, // Cloudflare Pages 需要
  },
};

export default nextConfig;
