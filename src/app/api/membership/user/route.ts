// 获取用户会员信息 API

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserTier, getUserLimits, getUserActiveSubscription } from '@/lib/membership';

export const runtime = 'edge';

interface Env {
  DB: D1Database;
}

export async function GET(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const env = process.env as unknown as Env;
  
  if (!env.DB) {
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
  
  try {
    const tier = await getUserTier(env.DB, session.user.id);
    const limits = await getUserLimits(env.DB, session.user.id);
    const subscription = await getUserActiveSubscription(env.DB, session.user.id);
    
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