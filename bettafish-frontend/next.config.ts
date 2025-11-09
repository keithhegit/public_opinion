import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://bettafish-api-prod.keithhe2021.workers.dev',
  },
};

export default nextConfig;
