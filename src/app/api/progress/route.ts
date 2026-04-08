import { auth } from "@/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";

export const runtime = "edge";

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
      .first();

    if (!user) {
      return NextResponse.json({ stats: null });
    }

    // 获取总训练次数
    const totalWorkoutsResult = await db
      .prepare("SELECT COUNT(*) as count FROM workout_logs WHERE user_id = ?")
      .bind(user.id)
      .first();

    // 获取总训练时长
    const totalDurationResult = await db
      .prepare(
        "SELECT COALESCE(SUM(duration_seconds), 0) as total FROM workout_logs WHERE user_id = ?"
      )
      .bind(user.id)
      .first();

    // 获取总组数和次数
    const totalsResult = await db
      .prepare(
        "SELECT COALESCE(SUM(total_sets), 0) as sets, COALESCE(SUM(total_reps), 0) as reps FROM workout_logs WHERE user_id = ?"
      )
      .bind(user.id)
      .first();

    // 获取最近训练日期
    const lastWorkoutResult = await db
      .prepare(
        "SELECT MAX(started_at) as last_date FROM workout_logs WHERE user_id = ?"
      )
      .bind(user.id)
      .first();

    // 计算连续训练天数（简化版）
    const recentWorkouts = await db
      .prepare(
        "SELECT DATE(started_at) as workout_date FROM workout_logs WHERE user_id = ? AND started_at >= date('now', '-30 days') GROUP BY DATE(started_at) ORDER BY workout_date DESC"
      )
      .bind(user.id)
      .all();

    let currentStreak = 0;
    const today = new Date().toISOString().split("T")[0];
    const dates = recentWorkouts.results.map((r: any) => r.workout_date);

    if (dates.length > 0) {
      let checkDate = new Date(today);
      for (let i = 0; i < dates.length; i++) {
        const dateStr = checkDate.toISOString().split("T")[0];
        if (dates.includes(dateStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (i === 0) {
          // 今天没练，检查昨天
          checkDate.setDate(checkDate.getDate() - 1);
          const yesterdayStr = checkDate.toISOString().split("T")[0];
          if (dates.includes(yesterdayStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }

    const stats = {
      totalWorkouts: (totalWorkoutsResult as any)?.count || 0,
      totalDuration: Math.floor(((totalDurationResult as any)?.total || 0) / 60),
      totalSets: (totalsResult as any)?.sets || 0,
      totalReps: (totalsResult as any)?.reps || 0,
      currentStreak,
      longestStreak: currentStreak, // 简化版
      lastWorkoutDate: (lastWorkoutResult as any)?.last_date || null,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Get progress stats error:", error);
    return NextResponse.json({ stats: null });
  }
}