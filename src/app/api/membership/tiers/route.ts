// 获取会员等级配置 API

import { NextRequest, NextResponse } from 'next/server';
import { getAllTiers } from '@/lib/membership';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  // 尝试获取 D1 数据库绑定
  const env = process.env as unknown as { DB?: D1Database };

  if (!env.DB) {
    // 没有 D1 绑定，返回默认配置（只有 Free 和 Pro）
    return NextResponse.json({
      tiers: [
        {
          id: 'free',
          name: 'Free',
          nameZh: '免费用户',
          priceMonthly: 0,
          priceYearly: 0,
          features: [
            { key: 'basic_plans', name: 'Basic Plans', nameZh: '基础训练计划', included: true },
            { key: 'basic_timer', name: 'Basic Timer', nameZh: '基础计时器', included: true },
            { key: 'progress_tracking', name: 'Progress Tracking', nameZh: '进度追踪', included: true },
            { key: 'ai_generation', name: 'AI Plan Generation', nameZh: 'AI智能生成', included: false },
            { key: 'premium_plans', name: 'Premium Plans', nameZh: '高级计划', included: false },
            { key: 'data_export', name: 'Data Export', nameZh: '数据导出', included: false },
          ],
          limits: {
            plansPerMonth: 3,
            aiGenerationsPerDay: 1,
            customPlans: 1,
            progressHistory: 30,
            bodyMetricsRecords: 50,
            canAccessPremiumPlans: false,
            canExportData: false,
            canSyncWearable: false,
            priority: 0,
          },
          isActive: true,
        },
        {
          id: 'pro',
          name: 'Pro',
          nameZh: '专业会员',
          priceMonthly: 1.99,
          priceYearly: 12.99,
          features: [
            { key: 'basic_plans', name: 'Basic Plans', nameZh: '基础训练计划', included: true },
            { key: 'basic_timer', name: 'Basic Timer', nameZh: '基础计时器', included: true },
            { key: 'progress_tracking', name: 'Progress Tracking', nameZh: '进度追踪', included: true },
            { key: 'ai_generation', name: 'AI Plan Generation', nameZh: 'AI智能生成（无限）', included: true, highlight: true },
            { key: 'premium_plans', name: 'Premium Plans', nameZh: '高级计划', included: true },
            { key: 'data_export', name: 'Data Export', nameZh: '数据导出', included: true },
          ],
          limits: {
            plansPerMonth: -1,
            aiGenerationsPerDay: -1,
            customPlans: -1,
            progressHistory: -1,
            bodyMetricsRecords: -1,
            canAccessPremiumPlans: true,
            canExportData: true,
            canSyncWearable: true,
            priority: 1,
          },
          isActive: true,
        },
      ],
    });
  }

  try {
    const tiers = await getAllTiers(env.DB);
    return NextResponse.json({ tiers });
  } catch (error) {
    console.error('Failed to get membership tiers:', error);
    return NextResponse.json(
      { error: 'Failed to get membership tiers' },
      { status: 500 }
    );
  }
}