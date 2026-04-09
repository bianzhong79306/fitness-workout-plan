// 获取用户会员信息 API

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import { getUserTier, getUserLimits, getUserActiveSubscription } from '@/lib/membership';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // 尝试获取 Cloudflare D1 数据库绑定
    const { env } = getRequestContext();
    const db = env.DB as D1Database | undefined;

    if (!db) {
      // 没有 D1 绑定，返回默认免费用户信息
      return NextResponse.json({
        tier: 'free',
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
        subscription: null,
      });
    }

    const tier = await getUserTier(db, session.user.id);
    const limits = await getUserLimits(db, session.user.id);
    const subscription = await getUserActiveSubscription(db, session.user.id);

    return NextResponse.json({
      tier,
      limits,
      subscription,
    });
  } catch (error) {
    console.error('Failed to get user membership:', error);
    return NextResponse.json(
      { error: 'Failed to get user membership' },
      { status: 500 }
    );
  }
}