// 获取用户会员信息 API

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import { getTierById, DEFAULT_TIERS } from '@/types/membership';
import type { D1Database } from '@/types/database';
import type { TierId, TierLimits } from '@/types/membership';

export const runtime = 'edge';

/**
 * 获取用户会员信息
 *
 * 查找逻辑：
 * 1. 通过 email 查找用户
 * 2. 如果没找到，尝试用 session ID 查找
 * 3. 检查用户的有效订阅
 * 4. 返回最高权限等级
 */
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { env } = getRequestContext();
    const db = env.DB as D1Database | undefined;

    if (!db) {
      console.error('[Membership] D1 database not configured');
      return NextResponse.json({
        tier: 'free',
        limits: DEFAULT_TIERS[0].limits,
        subscription: null,
      });
    }

    // 1. 通过 email 查找用户
    let user = await db
      .prepare('SELECT id, membership_tier FROM users WHERE email = ?')
      .bind(session.user.email)
      .first<{ id: string; membership_tier: string }>();

    // 2. 如果没找到，尝试用 session ID 查找
    if (!user && session.user.id) {
      user = await db
        .prepare('SELECT id, membership_tier FROM users WHERE id = ?')
        .bind(session.user.id)
        .first<{ id: string; membership_tier: string }>();
    }

    // 3. 检查订阅（无论用户是否找到都检查，因为可能通过 session ID 有订阅）
    let subscription = null;
    const userIdToCheck = user?.id || session.user.id;

    if (userIdToCheck) {
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
        .bind(userIdToCheck)
        .first<{ tierId: TierId }>();
    }

    // 4. 确定用户等级（订阅优先，其次用户表）
    const tierId: TierId = subscription?.tierId || (user?.membership_tier as TierId) || 'free';
    const tier = getTierById(tierId);
    const limits: TierLimits = tier?.limits ?? DEFAULT_TIERS[0].limits;

    return NextResponse.json({
      tier: tierId,
      limits,
      subscription,
    });
  } catch (error) {
    console.error('[Membership] Failed to get user membership:', error);
    return NextResponse.json(
      { error: 'Failed to get user membership' },
      { status: 500 }
    );
  }
}