// Challenges API - 挑战赛系统

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import type { D1Database } from '@/types/database';
import type { Challenge, UserChallenge, ChallengeWithProgress } from '@/types/challenge';

export const runtime = 'edge';

// GET: 获取挑战列表
export async function GET(request: NextRequest) {
  const session = await auth();

  try {
    const { env } = getRequestContext();
    const db = env.DB as D1Database | undefined;

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const now = new Date().toISOString();

    // 构建查询
    let query = `
      SELECT * FROM challenges
      WHERE is_active = 1
      AND end_at > ?
    `;
    const params: string[] = [now];

    if (type && ['daily', 'weekly', 'monthly', 'community'].includes(type)) {
      query += ' AND challenge_type = ?';
      params.push(type);
    }

    query += ' ORDER BY challenge_type, created_at';

    const result = await db
      .prepare(query)
      .bind(...params)
      .all<Challenge>();

    // 如果用户已登录，获取用户参与状态
    let userChallenges: UserChallenge[] = [];
    if (session?.user?.email) {
      const user = await db
        .prepare('SELECT id FROM users WHERE email = ?')
        .bind(session.user.email)
        .first<{ id: string }>();

      if (user) {
        const ucResult = await db
          .prepare('SELECT * FROM user_challenges WHERE user_id = ? AND status = ?')
          .bind(user.id, 'active')
          .all<UserChallenge>();
        userChallenges = ucResult.results;
      }
    }

    // 合并挑战和用户进度
    const challengesWithProgress: ChallengeWithProgress[] = result.results.map(challenge => {
      const userChallenge = userChallenges.find(uc => uc.challenge_id === challenge.id);
      return {
        ...challenge,
        userChallenge,
        is_joined: !!userChallenge,
      };
    });

    return NextResponse.json({
      challenges: challengesWithProgress,
      total: challengesWithProgress.length,
    });
  } catch (error) {
    console.error('[Challenges API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: 创建新挑战（暂时保留，后续可添加管理员权限）
export async function POST(request: NextRequest) {
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

    const body = await request.json() as {
      name: string;
      name_en: string;
      description: string;
      description_en: string;
      icon?: string;
      challenge_type: string;
      goal_type: string;
      goal_value: number;
      reward_points?: number;
      start_at: string;
      end_at: string;
    };

    // 验证必填字段
    if (!body.name || !body.challenge_type || !body.goal_type || !body.goal_value) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db
      .prepare(`
        INSERT INTO challenges
        (id, name, name_en, description, description_en, icon, challenge_type, goal_type, goal_value, reward_points, start_at, end_at, is_active, is_system, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?)
      `)
      .bind(
        id,
        body.name,
        body.name_en || body.name,
        body.description || '',
        body.description_en || body.description || '',
        body.icon || 'target',
        body.challenge_type,
        body.goal_type,
        body.goal_value,
        body.reward_points || 0,
        body.start_at,
        body.end_at,
        now
      )
      .run();

    const challenge = await db
      .prepare('SELECT * FROM challenges WHERE id = ?')
      .bind(id)
      .first<Challenge>();

    return NextResponse.json({ success: true, challenge });
  } catch (error) {
    console.error('[Challenges API] Create error:', error);
    return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 });
  }
}