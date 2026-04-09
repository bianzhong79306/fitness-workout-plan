// 获取用户会员信息 API

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import { getTierById, DEFAULT_TIERS } from '@/types/membership';
import type { D1Database } from '@/types/database';
import type { TierId, TierLimits } from '@/types/membership';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const session = await auth();

  console.log('DEBUG: session =', JSON.stringify(session?.user));

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized', debug: 'no session email' },
      { status: 401 }
    );
  }

  try {
    const { env } = getRequestContext();
    const db = env.DB as D1Database | undefined;

    console.log('DEBUG: db exists =', !!db);

    if (!db) {
      return NextResponse.json({
        tier: 'free',
        limits: DEFAULT_TIERS[0].limits,
        subscription: null,
        debug: 'no db',
      });
    }

    // 通过 email 查找用户
    const user = await db
      .prepare('SELECT id, membership_tier FROM users WHERE email = ?')
      .bind(session.user.email)
      .first<{ id: string; membership_tier: string }>();

    console.log('DEBUG: user =', JSON.stringify(user));

    if (!user) {
      return NextResponse.json({
        tier: 'free',
        limits: DEFAULT_TIERS[0].limits,
        subscription: null,
        debug: 'user not found',
        email: session.user.email,
      });
    }

    // 检查用户的有效订阅
    const subscription = await db
      .prepare(`
        SELECT
          id,
          user_id as userId,
          tier_id as tierId,
          status,
          started_at as startedAt,
          expires_at as expiresAt
        FROM user_subscriptions
        WHERE user_id = ? AND status = 'active'
        AND (expires_at IS NULL OR strftime('%Y-%m-%dT%H:%M:%SZ', expires_at) > strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc'))
        ORDER BY created_at DESC
        LIMIT 1
      `)
      .bind(user.id)
      .first<{ tierId: TierId }>();

    console.log('DEBUG: subscription =', JSON.stringify(subscription));

    // 确定用户等级：订阅优先，其次用户表
    const tierId: TierId = subscription?.tierId || (user.membership_tier as TierId) || 'free';
    const tier = getTierById(tierId);
    const limits: TierLimits = tier?.limits ?? DEFAULT_TIERS[0].limits;

    console.log('DEBUG: final tierId =', tierId);

    return NextResponse.json({
      tier: tierId,
      limits,
      subscription,
      debug: { userId: user.id, userTier: user.membership_tier },
    });
  } catch (error) {
    console.error('Failed to get user membership:', error);
    return NextResponse.json(
      { error: 'Failed to get user membership', debug: String(error) },
      { status: 500 }
    );
  }
}