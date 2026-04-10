// Challenge Detail API - 挑战详情

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import type { D1Database } from '@/types/database';
import type { Challenge, UserChallenge } from '@/types/challenge';

export const runtime = 'edge';

// GET: 获取挑战详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) {
  const { challengeId } = await params;
  const session = await auth();

  try {
    const { env } = getRequestContext();
    const db = env.DB as D1Database | undefined;

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const challenge = await db
      .prepare('SELECT * FROM challenges WHERE id = ? AND is_active = 1')
      .bind(challengeId)
      .first<Challenge>();

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    // 获取用户参与状态
    let userChallenge: UserChallenge | null = null;
    if (session?.user?.email) {
      const user = await db
        .prepare('SELECT id FROM users WHERE email = ?')
        .bind(session.user.email)
        .first<{ id: string }>();

      if (user) {
        userChallenge = await db
          .prepare('SELECT * FROM user_challenges WHERE user_id = ? AND challenge_id = ?')
          .bind(user.id, challengeId)
          .first<UserChallenge>();
      }
    }

    // 如果是社区挑战，获取排行榜前10
    let leaderboard: Array<{
      user_id: string;
      user_name: string | null;
      user_avatar: string | null;
      contribution: number;
      rank: number;
    }> = [];

    if (challenge.challenge_type === 'community') {
      const lbResult = await db
        .prepare(`
          SELECT
            cl.user_id,
            u.name as user_name,
            u.image as user_avatar,
            cl.contribution,
            cl.rank
          FROM challenge_leaderboard cl
          LEFT JOIN users u ON cl.user_id = u.id
          WHERE cl.challenge_id = ?
          ORDER BY cl.rank ASC
          LIMIT 10
        `)
        .bind(challengeId)
        .all<{
          user_id: string;
          user_name: string | null;
          user_avatar: string | null;
          contribution: number;
          rank: number;
        }>();
      leaderboard = lbResult.results;
    }

    return NextResponse.json({
      challenge,
      userChallenge,
      isJoined: !!userChallenge,
      leaderboard,
      participantsCount: challenge.participants_count,
    });
  } catch (error) {
    console.error('[Challenge Detail API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}