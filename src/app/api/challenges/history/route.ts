// Challenges History API - 挑战历史

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import type { D1Database } from '@/types/database';
import type { Challenge, UserChallenge, ChallengeWithProgress } from '@/types/challenge';

export const runtime = 'edge';

// GET: 获取用户的挑战历史
export async function GET(request: NextRequest) {
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

    // 获取用户
    const user = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(session.user.email)
      .first<{ id: string }>();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'completed' | 'expired' | 'all'

    // 查询用户的挑战记录
    let query = `
      SELECT
        uc.*,
        c.name,
        c.name_en,
        c.description,
        c.description_en,
        c.icon,
        c.challenge_type,
        c.goal_type,
        c.goal_value,
        c.reward_points,
        c.reward_achievement_id,
        c.start_at as challenge_start_at,
        c.end_at as challenge_end_at
      FROM user_challenges uc
      JOIN challenges c ON uc.challenge_id = c.id
      WHERE uc.user_id = ?
    `;
    const params: string[] = [user.id];

    if (status === 'completed') {
      query += ' AND uc.status = ?';
      params.push('completed');
    } else if (status === 'expired') {
      query += ' AND uc.status = ?';
      params.push('expired');
    }

    query += ' ORDER BY uc.joined_at DESC';

    const result = await db
      .prepare(query)
      .bind(...params)
      .all<{
        id: string;
        user_id: string;
        challenge_id: string;
        status: string;
        current_progress: number;
        target_progress: number;
        joined_at: string;
        completed_at: string | null;
        reward_claimed: boolean;
        reward_claimed_at: string | null;
        name: string;
        name_en: string;
        description: string;
        description_en: string;
        icon: string;
        challenge_type: string;
        goal_type: string;
        goal_value: number;
        reward_points: number;
        reward_achievement_id: string | null;
        challenge_start_at: string;
        challenge_end_at: string;
      }>();

    // 转换为 ChallengeWithProgress 格式
    const history: ChallengeWithProgress[] = result.results.map(row => ({
      id: row.challenge_id,
      name: row.name,
      name_en: row.name_en,
      description: row.description,
      description_en: row.description_en,
      icon: row.icon,
      challenge_type: row.challenge_type as 'daily' | 'weekly' | 'monthly' | 'community',
      goal_type: row.goal_type as 'workouts' | 'duration' | 'sets' | 'streak_days' | 'community_total',
      goal_value: row.goal_value,
      reward_points: row.reward_points,
      reward_achievement_id: row.reward_achievement_id,
      start_at: row.challenge_start_at,
      end_at: row.challenge_end_at,
      is_active: false, // 历史挑战不再活跃
      is_system: false,
      participants_count: 0,
      completions_count: 0,
      created_at: row.joined_at,
      userChallenge: {
        id: row.id,
        user_id: row.user_id,
        challenge_id: row.challenge_id,
        status: row.status as 'active' | 'completed' | 'expired',
        current_progress: row.current_progress,
        target_progress: row.target_progress,
        joined_at: row.joined_at,
        completed_at: row.completed_at,
        last_progress_at: null,
        reward_claimed: row.reward_claimed,
        reward_claimed_at: row.reward_claimed_at,
      },
      is_joined: true,
    }));

    // 统计数据
    const stats = {
      total: result.results.length,
      completed: result.results.filter(r => r.status === 'completed').length,
      expired: result.results.filter(r => r.status === 'expired').length,
      totalPointsEarned: result.results.filter(r => r.reward_claimed).reduce((sum, r) => sum + (r.reward_points || 0), 0),
    };

    return NextResponse.json({
      history,
      stats,
    });
  } catch (error) {
    console.error('[Challenges History API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}