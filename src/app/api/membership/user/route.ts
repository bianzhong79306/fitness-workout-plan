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

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized', debug: 'no session email' },
      { status: 401 }
    );
  }

  try {
    const { env } = getRequestContext();
    const db = env.DB as D1Database | undefined;

    if (!db) {
      return NextResponse.json({
        tier: 'free',
        limits: DEFAULT_TIERS[0].limits,
        subscription: null,
        debug: 'no db',
      });
    }

    // 先通过 email 查找用户
    let user = await db
      .prepare('SELECT id, membership_tier FROM users WHERE email = ?')
      .bind(session.user.email)
      .first<{ id: string; membership_tier: string }>();

    // 如果没找到，尝试用 session ID 查找
    if (!user && session.user.id) {
      user = await db
        .prepare('SELECT id, membership_tier FROM users WHERE id = ?')
        .bind(session.user.id)
        .first<{ id: string; membership_tier: string }>();
    }

    // 如果还是没有，检查订阅表是否有该 session ID 的记录
    let subscription = null;
    if (!user && session.user.id) {
      subscription = await db
        .prepare(`
          SELECT tier_id as tierId FROM user_subscriptions
          WHERE user_id = ? AND status = 'active'
          AND (expires_at IS NULL OR strftime('%Y-%m-%dT%H:%M:%SZ', expires_at) > strftime('%Y-%m-%dT%H:%M:%SZ', 'now', 'utc'))
          LIMIT 1
        `)
        .bind(session.user.id)
        .first<{ tierId: TierId }>();
    }

    if (!user && !subscription) {
      return NextResponse.json({
        tier: 'free',
        limits: DEFAULT_TIERS[0].limits,
        subscription: null,
        debug: 'user not found',
        email: session.user.email,
        sessionId: session.user.id,
      });
    }

    // 检查用户的有效订阅
    if (user && !subscription) {
      subscription = await db
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
    }

    // 确定用户等级
    const tierId: TierId = subscription?.tierId || (user?.membership_tier as TierId) || 'free';
    const tier = getTierById(tierId);
    const limits: TierLimits = tier?.limits ?? DEFAULT_TIERS[0].limits;

    return NextResponse.json({
      tier: tierId,
      limits,
      subscription,
      debug: { userId: user?.id, sessionId: session.user.id, userTier: user?.membership_tier, subTier: subscription?.tierId },
    });
  } catch (error) {
    console.error('Failed to get user membership:', error);
    return NextResponse.json(
      { error: 'Failed to get user membership', debug: String(error) },
      { status: 500 }
    );
  }
}