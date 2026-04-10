// User Achievements API - 检查和解锁成就

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

// 成就定义
const ACHIEVEMENT_REQUIREMENTS = {
  'first-workout': { type: 'total_workouts', value: 1 },
  'ten-workouts': { type: 'total_workouts', value: 10 },
  'fifty-workouts': { type: 'total_workouts', value: 50 },
  'hundred-workouts': { type: 'total_workouts', value: 100 },
  'week-warrior': { type: 'streak_days', value: 7 },
  'iron-will': { type: 'streak_days', value: 30 },
  'thousand-sets': { type: 'total_sets', value: 1000 },
  'early-bird': { type: 'early_workout', value: 1 },
  'night-owl': { type: 'late_workout', value: 1 },
  'goal-crusher': { type: 'weekly_goal_streak', value: 4 },
};

interface UserStats {
  totalWorkouts: number;
  streakDays: number;
  totalSets: number;
  hasEarlyWorkout: boolean;
  hasLateWorkout: boolean;
  weeklyGoalStreak: number;
}

// 计算用户统计数据
async function calculateUserStats(db: D1Database, userId: string): Promise<UserStats> {
  // 总训练次数
  const totalWorkoutsResult = await db
    .prepare('SELECT COUNT(*) as count FROM workout_logs WHERE user_id = ?')
    .bind(userId)
    .first<{ count: number }>();
  const totalWorkouts = totalWorkoutsResult?.count || 0;

  // 总组数
  const totalSetsResult = await db
    .prepare('SELECT SUM(total_sets) as total FROM workout_logs WHERE user_id = ?')
    .bind(userId)
    .first<{ total: number }>();
  const totalSets = totalSetsResult?.total || 0;

  // 连续训练天数（streak）
  const streakResult = await db
    .prepare(`
      SELECT DATE(completed_at) as workout_date
      FROM workout_logs
      WHERE user_id = ?
      GROUP BY DATE(completed_at)
      ORDER BY workout_date DESC
      LIMIT 60
    `)
    .bind(userId)
    .all<{ workout_date: string }>();

  let streakDays = 0;
  const today = new Date().toISOString().split('T')[0];
  const workoutDates = streakResult.results.map(r => r.workout_date);

  if (workoutDates.length > 0) {
    // 检查今天或昨天是否有训练
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (workoutDates.includes(today) || workoutDates.includes(yesterday)) {
      // 计算连续天数
      let checkDate = workoutDates.includes(today) ? today : yesterday;
      streakDays = 1;

      for (let i = 1; i < workoutDates.length; i++) {
        const prevDate = new Date(checkDate);
        prevDate.setDate(prevDate.getDate() - 1);
        const prevDateStr = prevDate.toISOString().split('T')[0];

        if (workoutDates.includes(prevDateStr)) {
          streakDays++;
          checkDate = prevDateStr;
        } else {
          break;
        }
      }
    }
  }

  // 检查早起训练（6点前）
  const earlyWorkoutResult = await db
    .prepare(`
      SELECT COUNT(*) as count FROM workout_logs
      WHERE user_id = ?
      AND CAST(strftime('%H', completed_at) AS INTEGER) < 6
    `)
    .bind(userId)
    .first<{ count: number }>();
  const hasEarlyWorkout = (earlyWorkoutResult?.count || 0) > 0;

  // 检查晚训练（10点后，22点）
  const lateWorkoutResult = await db
    .prepare(`
      SELECT COUNT(*) as count FROM workout_logs
      WHERE user_id = ?
      AND CAST(strftime('%H', completed_at) AS INTEGER) >= 22
    `)
    .bind(userId)
    .first<{ count: number }>();
  const hasLateWorkout = (lateWorkoutResult?.count || 0) > 0;

  // 连续完成周目标次数
  const weeklyGoalStreakResult = await db
    .prepare(`
      SELECT week_start, goal_workouts, actual_workouts, goal_met
      FROM weekly_goals
      WHERE user_id = ?
      ORDER BY week_start DESC
      LIMIT 8
    `)
    .bind(userId)
    .all<{ goal_met: boolean }>();

  let weeklyGoalStreak = 0;
  for (const week of weeklyGoalStreakResult.results) {
    if (week.goal_met) {
      weeklyGoalStreak++;
    } else {
      break;
    }
  }

  return {
    totalWorkouts,
    streakDays,
    totalSets,
    hasEarlyWorkout,
    hasLateWorkout,
    weeklyGoalStreak,
  };
}

// 检查并解锁成就
async function checkAndUnlockAchievements(
  db: D1Database,
  userId: string,
  stats: UserStats
): Promise<string[]> {
  const newlyUnlocked: string[] = [];

  // 获取已解锁的成就
  const unlockedResult = await db
    .prepare('SELECT achievement_id FROM user_achievements WHERE user_id = ?')
    .bind(userId)
    .all<{ achievement_id: string }>();
  const unlockedIds = unlockedResult.results.map(r => r.achievement_id);

  // 检查每个成就
  for (const [achievementId, requirement] of Object.entries(ACHIEVEMENT_REQUIREMENTS)) {
    if (unlockedIds.includes(achievementId)) continue;

    let shouldUnlock = false;

    switch (requirement.type) {
      case 'total_workouts':
        shouldUnlock = stats.totalWorkouts >= requirement.value;
        break;
      case 'streak_days':
        shouldUnlock = stats.streakDays >= requirement.value;
        break;
      case 'total_sets':
        shouldUnlock = stats.totalSets >= requirement.value;
        break;
      case 'early_workout':
        shouldUnlock = stats.hasEarlyWorkout;
        break;
      case 'late_workout':
        shouldUnlock = stats.hasLateWorkout;
        break;
      case 'weekly_goal_streak':
        shouldUnlock = stats.weeklyGoalStreak >= requirement.value;
        break;
    }

    if (shouldUnlock) {
      // 解锁成就
      await db
        .prepare(`
          INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
          VALUES (?, ?, datetime('now'))
        `)
        .bind(userId, achievementId)
        .run();

      newlyUnlocked.push(achievementId);
    }
  }

  return newlyUnlocked;
}

// GET: 获取用户统计数据和成就
export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
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

    const stats = await calculateUserStats(db, user.id);
    const unlockedResult = await db
      .prepare(`
        SELECT achievement_id, unlocked_at
        FROM user_achievements
        WHERE user_id = ?
        ORDER BY unlocked_at DESC
      `)
      .bind(user.id)
      .all<{ achievement_id: string; unlocked_at: string }>();

    return NextResponse.json({
      stats,
      unlockedAchievements: unlockedResult.results,
      totalUnlocked: unlockedResult.results.length,
    });
  } catch (error) {
    console.error('[User Achievements API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch user achievements' }, { status: 500 });
  }
}

// POST: 检查并解锁新成就（训练完成后调用）
export async function POST() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
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

    const stats = await calculateUserStats(db, user.id);
    const newlyUnlocked = await checkAndUnlockAchievements(db, user.id, stats);

    return NextResponse.json({
      stats,
      newlyUnlocked,
      totalUnlocked: newlyUnlocked.length,
    });
  } catch (error) {
    console.error('[User Achievements API] Check error:', error);
    return NextResponse.json({ error: 'Failed to check achievements' }, { status: 500 });
  }
}