// 训练统计 API

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

interface WorkoutStats {
  totalWorkouts: number;
  totalDurationMinutes: number;
  totalSets: number;
  totalReps: number;
  currentStreak: number;
  longestStreak: number;
  thisWeekWorkouts: number;
  thisMonthWorkouts: number;
  averageRating: number | null;
  lastWorkoutDate: string | null;
  weeklyGoal: number;
  completionRate: number;
  weeklyData: Array<{
    week: string;
    workouts: number;
    duration: number;
  }>;
}

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
      .prepare('SELECT id, weekly_workout_goal FROM users WHERE email = ?')
      .bind(session.user.email)
      .first<{ id: string; weekly_workout_goal: number | null }>();

    if (!user) {
      return NextResponse.json(getEmptyStats());
    }

    // 计算统计数据
    const stats = await calculateStats(db, user.id, user.weekly_workout_goal ?? 3);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('[Workout Stats] Error:', error);
    return NextResponse.json(getEmptyStats());
  }
}

function getEmptyStats(): WorkoutStats {
  return {
    totalWorkouts: 0,
    totalDurationMinutes: 0,
    totalSets: 0,
    totalReps: 0,
    currentStreak: 0,
    longestStreak: 0,
    thisWeekWorkouts: 0,
    thisMonthWorkouts: 0,
    averageRating: null,
    lastWorkoutDate: null,
    weeklyGoal: 3,
    completionRate: 0,
    weeklyData: [],
  };
}

async function calculateStats(db: D1Database, userId: string, weeklyGoal: number): Promise<WorkoutStats> {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // 总体统计
  const totalStats = await db
    .prepare(`
      SELECT
        COUNT(*) as totalWorkouts,
        SUM(duration_seconds) as totalDuration,
        SUM(total_sets) as totalSets,
        SUM(total_reps) as totalReps,
        AVG(rating) as avgRating,
        MAX(started_at) as lastWorkout
      FROM workout_logs
      WHERE user_id = ? AND completed_at IS NOT NULL
    `)
    .bind(userId)
    .first<{
      totalWorkouts: number;
      totalDuration: number | null;
      totalSets: number | null;
      totalReps: number | null;
      avgRating: number | null;
      lastWorkout: string | null;
    }>();

  // 本周训练次数
  const thisWeekResult = await db
    .prepare(`
      SELECT COUNT(*) as count
      FROM workout_logs
      WHERE user_id = ?
      AND completed_at IS NOT NULL
      AND started_at >= ?
    `)
    .bind(userId, weekStart.toISOString())
    .first<{ count: number }>();

  // 本月训练次数
  const thisMonthResult = await db
    .prepare(`
      SELECT COUNT(*) as count
      FROM workout_logs
      WHERE user_id = ?
      AND completed_at IS NOT NULL
      AND started_at >= ?
    `)
    .bind(userId, monthStart.toISOString())
    .first<{ count: number }>();

  // 计算连续训练天数
  const streakData = await calculateStreak(db, userId);

  // 获取最近8周的每周数据
  const weeklyData = await getWeeklyData(db, userId);

  // 计算本周完成率
  const thisWeekWorkouts = thisWeekResult?.count || 0;
  const completionRate = weeklyGoal > 0
    ? Math.min(100, Math.round((thisWeekWorkouts / weeklyGoal) * 100))
    : 0;

  return {
    totalWorkouts: totalStats?.totalWorkouts || 0,
    totalDurationMinutes: Math.round((totalStats?.totalDuration || 0) / 60),
    totalSets: totalStats?.totalSets || 0,
    totalReps: totalStats?.totalReps || 0,
    currentStreak: streakData.current,
    longestStreak: streakData.longest,
    thisWeekWorkouts,
    thisMonthWorkouts: thisMonthResult?.count || 0,
    averageRating: totalStats?.avgRating || null,
    lastWorkoutDate: totalStats?.lastWorkout || null,
    weeklyGoal,
    completionRate,
    weeklyData,
  };
}

async function calculateStreak(db: D1Database, userId: string): Promise<{ current: number; longest: number }> {
  // 获取所有训练日期（按天分组）
  const datesResult = await db
    .prepare(`
      SELECT DISTINCT date(started_at) as workout_date
      FROM workout_logs
      WHERE user_id = ? AND completed_at IS NOT NULL
      ORDER BY workout_date DESC
      LIMIT 365
    `)
    .bind(userId)
    .all<{ workout_date: string }>();

  if (datesResult.results.length === 0) {
    return { current: 0, longest: 0 };
  }

  const dates = datesResult.results.map(r => r.workout_date);

  // 计算当前连续天数
  let currentStreak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // 检查今天或昨天是否有训练
  if (dates[0] === today || dates[0] === yesterday) {
    currentStreak = 1;
    let checkDate = dates[0] === today ? yesterday : new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

    for (let i = 1; i < dates.length; i++) {
      const expectedDate = new Date(dates[0]);
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];

      if (dates[i] === expectedDateStr) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // 计算最长连续天数
  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / 86400000);

    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return { current: currentStreak, longest: Math.max(longestStreak, currentStreak) };
}

async function getWeeklyData(db: D1Database, userId: string): Promise<Array<{ week: string; workouts: number; duration: number }>> {
  const eightWeeksAgo = new Date();
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

  const result = await db
    .prepare(`
      SELECT 
        strftime('%Y-%W', started_at) as week,
        COUNT(*) as workouts,
        SUM(duration_seconds) as duration
      FROM workout_logs
      WHERE user_id = ?
      AND completed_at IS NOT NULL
      AND started_at >= ?
      GROUP BY strftime('%Y-%W', started_at)
      ORDER BY week DESC
      LIMIT 8
    `)
    .bind(userId, eightWeeksAgo.toISOString())
    .all<{ week: string; workouts: number; duration: number | null }>();

  return result.results.map(r => ({
    week: r.week,
    workouts: r.workouts,
    duration: Math.round((r.duration || 0) / 60),
  }));
}