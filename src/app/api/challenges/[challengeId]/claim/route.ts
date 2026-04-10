// Challenge Claim API - 领取挑战奖励

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

// POST: 领取挑战奖励
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) {
  const { challengeId } = await params;
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { env } = getRequestContext();
    const db = env.DB as D1Database | undefined;

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const user = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(session.user.email)
      .first<{ id: string }>();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 获取用户挑战记录
    const userChallenge = await db
      .prepare(`
        SELECT uc.*, c.reward_points, c.reward_achievement_id, c.name
        FROM user_challenges uc
        JOIN challenges c ON uc.challenge_id = c.id
        WHERE uc.user_id = ? AND uc.challenge_id = ? AND uc.status = 'completed'
      `)
      .bind(user.id, challengeId)
      .first<{
        id: string;
        reward_points: number;
        reward_achievement_id: string | null;
        name: string;
        reward_claimed: boolean;
      }>();

    if (!userChallenge) {
      return NextResponse.json({ error: 'Challenge not completed' }, { status: 400 });
    }

    if (userChallenge.reward_claimed) {
      return NextResponse.json({ error: 'Reward already claimed' }, { status: 400 });
    }

    // 标记奖励已领取
    await db
      .prepare(`
        UPDATE user_challenges
        SET reward_claimed = 1, reward_claimed_at = datetime('now')
        WHERE id = ?
      `)
      .bind(userChallenge.id)
      .run();

    // 如果有关联成就，解锁成就
    if (userChallenge.reward_achievement_id) {
      await db
        .prepare(`
          INSERT OR IGNORE INTO user_achievements (id, user_id, achievement_id, unlocked_at)
          VALUES (?, ?, ?, datetime('now'))
        `)
        .bind(crypto.randomUUID(), user.id, userChallenge.reward_achievement_id)
        .run();
    }

    return NextResponse.json({
      success: true,
      points: userChallenge.reward_points,
      achievementId: userChallenge.reward_achievement_id,
      message: `Claimed ${userChallenge.reward_points} points from ${userChallenge.name}`,
    });
  } catch (error) {
    console.error('[Challenge Claim API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}