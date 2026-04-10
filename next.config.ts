import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // Cloudflare Pages部署配置
  images: {
    // 禁用图片优化以兼容Cloudflare
    unoptimized: true,
  },

  // 性能优化配置
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      '@radix-ui/react-icons',
      '@radix-ui/react-avatar',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-progress',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
    ],
  },

  // 响应头配置 - API缓存策略
  headers: async () => [
    {
      source: '/api/plans',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
      ],
    },
    {
      source: '/api/challenges',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=300, stale-while-revalidate=1800' },
      ],
    },
    {
      source: '/api/workout/stats',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=60, stale-while-revalidate=300' },
      ],
    },
    {
      source: '/api/user/achievements',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=60, stale-while-revalidate=300' },
      ],
    },
    {
      source: '/manifest.json',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=86400, immutable' },
      ],
    },
    {
      source: '/sw.js',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
      ],
    },
    {
      source: '/icons/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=86400, immutable' },
      ],
    },
    // 安全头
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],

  // 其他优化
  compress: true,
  poweredByHeader: false,

  // 严格模式
  strict: true,
};

export default withNextIntl(nextConfig);