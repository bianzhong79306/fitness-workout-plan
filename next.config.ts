import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages部署配置
  experimental: {
    // 允许使用Edge Runtime
  },
  images: {
    // 禁用图片优化以兼容Cloudflare
    unoptimized: true,
  },
};

export default nextConfig;