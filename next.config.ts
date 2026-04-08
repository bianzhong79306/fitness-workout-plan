import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // Cloudflare Pages部署配置
  images: {
    // 禁用图片优化以兼容Cloudflare
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);