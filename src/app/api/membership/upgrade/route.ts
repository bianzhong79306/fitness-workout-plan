// 升级用户会员等级 API（管理员功能）

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createSubscription, updateUserTier } from '@/lib/membership';
import type { D1Database } from '@/types/database';
import type { TierId } from '@/types/membership';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const env = process.env as unknown as { DB?: D1Database };

  if (!env.DB) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json() as { tier?: string };
    const tierId = (body.tier || 'premium') as TierId;

    // 验证 tier 是否有效
    const validTiers: TierId[] = ['free', 'pro', 'premium'];
    if (!validTiers.includes(tierId)) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      );
    }

    // 创建永久订阅记录（expires_at 设为 100年后，表示永久）
    const permanentExpiresAt = new Date();
    permanentExpiresAt.setFullYear(permanentExpiresAt.getFullYear() + 100);

    await createSubscription(env.DB, {
      userId: session.user.id,
      tierId,
      status: 'active',
      startedAt: new Date().toISOString(),
      expiresAt: permanentExpiresAt.toISOString(),
    });

    // 同时更新用户表的会员等级
    await updateUserTier(env.DB, session.user.id, tierId);

    return NextResponse.json({
      success: true,
      tier: tierId,
      message: `Successfully upgraded to ${tierId} tier permanently`,
    });
  } catch (error) {
    console.error('Failed to upgrade membership:', error);
    return NextResponse.json(
      { error: 'Failed to upgrade membership' },
      { status: 500 }
    );
  }
}