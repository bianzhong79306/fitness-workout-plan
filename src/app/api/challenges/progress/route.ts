// Challenge Progress API - 挑战进度更新（内部调用）

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import type { D1Database } from '@/types/database';
import type { Challenge, UserChallenge } from '@/types/challenge';

export const runtime = 'edge';

interface WorkoutData {
  durationSeconds: number;
  totalSets: number;
  completedAt: string;
}

interface ChallengeProgressResult {
  challengeId: string;
  challengeName: string;
  progress: number;
  completed: boolean;
}

// POST: 更新用户挑战进度
export async function POST(request: NextRequest) {
  try {
    const { env } = getRequestContext();
    const db = env.DB as D1Database | undefined;

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json() as {
      userId: string;
      workoutData: WorkoutData;
    };

    if (!body.userId || !body.workoutData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { userId, workoutData } = body;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // 获取用户当前参与的活跃挑战
    const userChallenges = await db
      .prepare(`
        SELECT uc.*, c.name, c.name_en, c.challenge_type, c.goal_type, c.goal_value
        FROM user_challenges uc
        JOIN challenges c ON uc.challenge_id = c.id
        WHERE uc.user_id = ? AND uc.status = 'active' AND c.is_active = 1
      `)
      .bind(userId)
      .all<{
        id: string;
        challenge_id: string;
        current_progress: number;
        target_progress: number;
        challenge_type: string;
        goal_type: string;
        goal_value: number;
        name: string;
        name_en: string;
      }>();

    const results: ChallengeProgressResult[] = [];

    for (const uc of userChallenges.results) {
      let newProgress = uc.current_progress;
      let completed = false;

      // 根据挑战类型计算进度
      switch (uc.goal_type) {
        case 'workouts': {
          // 计算训练次数
          let startDate: string;
          switch (uc.challenge_type) {
            case 'daily':
              startDate = today;
              break;
            case 'weekly':
              startDate = weekStart.toISOString().split('T')[0];
              break;
            case 'monthly':
              startDate = monthStart.toISOString().split('T')[0];
              break;
            default:
              startDate = '1970-01-01';
          }

          const countResult = await db
            .prepare(`
              SELECT COUNT(*) as count FROM workout_logs
              WHERE user_id = ? AND date(completed_at) >= ?
            `)
            .bind(userId, startDate)
            .first<{ count: number }>();

          newProgress = countResult?.count || 0;
          break;
        }

        case 'streak_days': {
          // 计算本月训练天数
          const daysResult = await db
            .prepare(`
              SELECT COUNT(DISTINCT date(completed_at)) as days
              FROM workout_logs
              WHERE user_id = ? AND date(completed_at) >= ?
            `)
            .bind(userId, monthStart.toISOString().split('T')[0])
            .first<{ days: number }>();

          newProgress = daysResult?.days || 0;
          break;
        }

        case 'community_total': {
          // 社区挑战：用户贡献增加1
          newProgress = uc.current_progress + 1;

          // 更新排行榜
          await db
            .prepare(`
              INSERT INTO challenge_leaderboard (id, challenge_id, user_id, contribution, updated_at)
              VALUES (?, ?, ?, 1, datetime('now'))
              ON CONFLICT(challenge_id, user_id) DO UPDATE SET
                contribution = contribution + 1,
                updated_at = datetime('now')
            `)
            .bind(crypto.randomUUID(), uc.challenge_id, userId)
            .run();

          // 检查社区总进度
          const totalResult = await db
            .prepare('SELECT SUM(contribution) as total FROM challenge_leaderboard WHERE challenge_id = ?')
            .bind(uc.challenge_id)
            .first<{ total: number }>();

          newProgress = totalResult?.total || 0;
          break;
        }

        case 'duration': {
          // 计算总时长（分钟）
          const durationResult = await db
            .prepare(`
              SELECT SUM(duration_seconds) as total
              FROM workout_logs
              WHERE user_id = ? AND date(completed_at) >= ?
            `)
            .bind(userId, weekStart.toISOString().split('T')[0])
            .first<{ total: number }>();

          newProgress = Math.floor((durationResult?.total || 0) / 60);
          break;
        }

        case 'sets': {
          // 计算总组数
          const setsResult = await db
            .prepare(`
              SELECT SUM(total_sets) as total
              FROM workout_logs
              WHERE user_id = ? AND date(completed_at) >= ?
            `)
            .bind(userId, weekStart.toISOString().split('T')[0])
            .first<{ total: number }>();

          newProgress = setsResult?.total || 0;
          break;
        }
      }

      // 检查是否完成
      completed = newProgress >= uc.target_progress;

      // 更新用户挑战进度
      if (completed && uc.goal_type !== 'community_total') {
        await db
          .prepare(`
            UPDATE user_challenges
            SET current_progress = ?, status = 'completed', completed_at = datetime('now'), last_progress_at = datetime('now')
            WHERE id = ?
          `)
          .bind(newProgress, uc.id)
          .run();

        // 更新完成人数
        await db
          .prepare('UPDATE challenges SET completions_count = completions_count + 1 WHERE id = ?')
          .bind(uc.challenge_id)
          .run();
      } else {
        await db
          .prepare(`
            UPDATE user_challenges
            SET current_progress = ?, last_progress_at = datetime('now')
            WHERE id = ?
          `)
          .bind(newProgress, uc.id)
          .run();
      }

      results.push({
        challengeId: uc.challenge_id,
        challengeName: uc.name,
        progress: newProgress,
        completed,
      });
    }

    // 更新社区挑战排行榜排名
    for (const result of results) {
      if (result.challengeId.startsWith('community')) {
        await updateLeaderboardRanks(db, result.challengeId);
      }
    }

    const completedChallenges = results.filter(r => r.completed);

    return NextResponse.json({
      success: true,
      updated: results.length,
      completedChallenges,
    });
  } catch (error) {
    console.error('[Challenge Progress API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 更新排行榜排名
async function updateLeaderboardRanks(db: D1Database, challengeId: string) {
  const entries = await db
    .prepare(`
      SELECT id, contribution FROM challenge_leaderboard
      WHERE challenge_id = ?
      ORDER BY contribution DESC
    `)
    .bind(challengeId)
    .all<{ id: string; contribution: number }>();

  for (let i = 0; i < entries.results.length; i++) {
    await db
      .prepare('UPDATE challenge_leaderboard SET rank = ? WHERE id = ?')
      .bind(i + 1, entries.results[i].id)
      .run();
  }
}