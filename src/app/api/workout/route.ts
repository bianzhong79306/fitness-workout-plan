import { auth } from "@/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";
import type { D1Database } from "@/types/database";

export const runtime = "edge";

// 成就定义
const ACHIEVEMENT_REQUIREMENTS: Record<string, { type: string; value: number }> = {
  'first-workout': { type: 'total_workouts', value: 1 },
  'ten-workouts': { type: 'total_workouts', value: 10 },
  'fifty-workouts': { type: 'total_workouts', value: 50 },
  'hundred-workouts': { type: 'total_workouts', value: 100 },
  'week-warrior': { type: 'streak_days', value: 7 },
  'iron-will': { type: 'streak_days', value: 30 },
  'thousand-sets': { type: 'total_sets', value: 1000 },
  'early-bird': { type: 'early_workout', value: 1 },
  'night-owl': { type: 'late_workout', value: 1 },
};

// 检查并解锁成就
async function checkAchievements(db: D1Database, userId: string, completedAt: string): Promise<string[]> {
  const newlyUnlocked: string[] = [];

  // 获取已解锁成就
  const unlockedResult = await db
    .prepare('SELECT achievement_id FROM user_achievements WHERE user_id = ?')
    .bind(userId)
    .all<{ achievement_id: string }>();
  const unlockedIds = unlockedResult.results.map(r => r.achievement_id);

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

  // 计算连续天数
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
  const workoutDates = streakResult.results.map(r => r.workout_date);
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (workoutDates.length > 0 && (workoutDates.includes(today) || workoutDates.includes(yesterday))) {
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

  // 检查时间成就
  const workoutHour = parseInt(completedAt.split('T')[1]?.split(':')[0] || '12', 10);
  const isEarlyWorkout = workoutHour < 6;
  const isLateWorkout = workoutHour >= 22;

  // 检查每个成就
  for (const [achievementId, requirement] of Object.entries(ACHIEVEMENT_REQUIREMENTS)) {
    if (unlockedIds.includes(achievementId)) continue;

    let shouldUnlock = false;
    switch (requirement.type) {
      case 'total_workouts':
        shouldUnlock = totalWorkouts >= requirement.value;
        break;
      case 'streak_days':
        shouldUnlock = streakDays >= requirement.value;
        break;
      case 'total_sets':
        shouldUnlock = totalSets >= requirement.value;
        break;
      case 'early_workout':
        shouldUnlock = isEarlyWorkout;
        break;
      case 'late_workout':
        shouldUnlock = isLateWorkout;
        break;
    }

    if (shouldUnlock) {
      await db
        .prepare('INSERT INTO user_achievements (user_id, achievement_id, unlocked_at) VALUES (?, ?, datetime("now"))')
        .bind(userId, achievementId)
        .run();
      newlyUnlocked.push(achievementId);
    }
  }

  return newlyUnlocked;
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const ctx = getRequestContext();
    const db = (ctx.env as any).DB as D1Database;

    // 获取用户
    const user = await db
      .prepare("SELECT id FROM users WHERE email = ?")
      .bind(session.user.email)
      .first<{ id: string }>();

    if (!user) {
      return NextResponse.json({ logs: [] });
    }

    // 获取训练记录
    const result = await db
      .prepare(
        "SELECT * FROM workout_logs WHERE user_id = ? ORDER BY started_at DESC LIMIT 30"
      )
      .bind(user.id)
      .all();

    return NextResponse.json({ logs: result.results });
  } catch (error) {
    console.error("Get workout logs error:", error);
    return NextResponse.json({ logs: [] });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json() as {
      sessionId?: string;
      planId?: string;
      startedAt?: string;
      completedAt?: string;
      durationSeconds?: number;
      exercises?: unknown[];
      totalSets?: number;
      totalReps?: number;
      rating?: number;
    };
    const ctx = getRequestContext();
    const db = (ctx.env as any).DB as D1Database;

    // 获取用户
    const user = await db
      .prepare("SELECT id FROM users WHERE email = ?")
      .bind(session.user.email)
      .first<{ id: string }>();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const completedAt = body.completedAt || now;

    await db
      .prepare(
        `INSERT INTO workout_logs
        (id, user_id, session_id, plan_id, started_at, completed_at, duration_seconds, exercises_json, total_sets, total_reps, rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        user.id,
        body.sessionId || null,
        body.planId || null,
        body.startedAt || now,
        completedAt,
        body.durationSeconds || 0,
        JSON.stringify(body.exercises || []),
        body.totalSets || 0,
        body.totalReps || 0,
        body.rating || null
      )
      .run();

    // 检查成就
    let newlyUnlocked: string[] = [];
    try {
      newlyUnlocked = await checkAchievements(db, user.id, completedAt);
    } catch (e) {
      console.error("Achievement check error:", e);
    }

    // 更新挑战进度
    let completedChallenges: Array<{ challengeId: string; challengeName: string }> = [];
    try {
      const progressResponse = await fetch(new URL('/api/challenges/progress', request.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          workoutData: {
            durationSeconds: body.durationSeconds || 0,
            totalSets: body.totalSets || 0,
            completedAt,
          },
        }),
      });

      if (progressResponse.ok) {
        const progressData = await progressResponse.json() as { completedChallenges: Array<{ challengeId: string; challengeName: string }> };
        completedChallenges = progressData.completedChallenges || [];
      }
    } catch (e) {
      console.error("Challenge progress update error:", e);
    }

    return NextResponse.json({ success: true, id, newlyUnlocked, completedChallenges });
  } catch (error) {
    console.error("Create workout log error:", error);
    return NextResponse.json(
      { error: "Failed to create workout log" },
      { status: 500 }
    );
  }
}