import { setRequestLocale } from "next-intl/server";
export const runtime = "edge";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell,
  Clock,
  Flame,
  Target,
  Trophy,
  Calendar,
} from "lucide-react";
import { MembershipCard } from "./DashboardClient";
import { getRequestContext } from "@cloudflare/next-on-pages";

// D1Database 类型
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(col?: string): Promise<T | null>;
  all<T = unknown>(col?: string): Promise<{ results: T[] }>;
}

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
}

async function getStats(userId: string): Promise<WorkoutStats> {
  try {
    const { env } = getRequestContext();
    const db = env.DB as D1Database | undefined;
    if (!db) return getEmptyStats();

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalStats = await db
      .prepare(`
        SELECT COUNT(*) as totalWorkouts,
               COALESCE(SUM(duration_seconds), 0) as totalDuration,
               COALESCE(SUM(total_sets), 0) as totalSets,
               COALESCE(SUM(total_reps), 0) as totalReps,
               MAX(started_at) as lastWorkout
        FROM workout_logs WHERE user_id = ? AND completed_at IS NOT NULL
      `)
      .bind(userId)
      .first<{ totalWorkouts: number; totalDuration: number; totalSets: number; totalReps: number; lastWorkout: string | null }>();

    const thisWeek = await db
      .prepare(`SELECT COUNT(*) as count FROM workout_logs WHERE user_id = ? AND completed_at IS NOT NULL AND started_at >= ?`)
      .bind(userId, weekStart.toISOString())
      .first<{ count: number }>();

    const thisMonth = await db
      .prepare(`SELECT COUNT(*) as count FROM workout_logs WHERE user_id = ? AND completed_at IS NOT NULL AND started_at >= ?`)
      .bind(userId, monthStart.toISOString())
      .first<{ count: number }>();

    const streak = await calculateStreak(db, userId);

    return {
      totalWorkouts: totalStats?.totalWorkouts || 0,
      totalDurationMinutes: Math.round((totalStats?.totalDuration || 0) / 60),
      totalSets: totalStats?.totalSets || 0,
      totalReps: totalStats?.totalReps || 0,
      currentStreak: streak.current,
      longestStreak: streak.longest,
      thisWeekWorkouts: thisWeek?.count || 0,
      thisMonthWorkouts: thisMonth?.count || 0,
      averageRating: null,
      lastWorkoutDate: totalStats?.lastWorkout || null,
    };
  } catch {
    return getEmptyStats();
  }
}

function getEmptyStats(): WorkoutStats {
  return { totalWorkouts: 0, totalDurationMinutes: 0, totalSets: 0, totalReps: 0, currentStreak: 0, longestStreak: 0, thisWeekWorkouts: 0, thisMonthWorkouts: 0, averageRating: null, lastWorkoutDate: null };
}

async function calculateStreak(db: D1Database, userId: string): Promise<{ current: number; longest: number }> {
  const datesResult = await db
    .prepare(`SELECT DISTINCT date(started_at) as d FROM workout_logs WHERE user_id = ? AND completed_at IS NOT NULL ORDER BY d DESC LIMIT 365`)
    .bind(userId)
    .all<{ d: string }>();

  if (datesResult.results.length === 0) return { current: 0, longest: 0 };

  const dates = datesResult.results.map(r => r.d);
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let current = 0;
  if (dates[0] === today || dates[0] === yesterday) {
    current = 1;
    for (let i = 1; i < dates.length; i++) {
      const expected = new Date(dates[0]);
      expected.setDate(expected.getDate() - i);
      if (dates[i] === expected.toISOString().split('T')[0]) current++;
      else break;
    }
  }

  let longest = 1, temp = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = Math.floor((new Date(dates[i - 1]).getTime() - new Date(dates[i]).getTime()) / 86400000);
    if (diff === 1) { temp++; longest = Math.max(longest, temp); } else temp = 1;
  }

  return { current, longest: Math.max(longest, current) };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user) {
    redirect(`/${locale}/auth/signin`);
  }

  const isZh = locale === "zh";

  // 从数据库获取真实统计数据
  let stats: WorkoutStats = getEmptyStats();
  if (session.user.email) {
    try {
      const { env } = getRequestContext();
      const db = env.DB as D1Database | undefined;
      if (db) {
        const user = await db.prepare("SELECT id FROM users WHERE email = ?").bind(session.user.email).first<{ id: string }>();
        if (user) stats = await getStats(user.id);
      }
    } catch (e) {
      console.error("Failed to get stats:", e);
    }
  }

  return (
    <div className="container py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {isZh ? "欢迎回来" : "Welcome back"}
          {session.user.name && `, ${session.user.name}`}
        </h1>
        <p className="text-muted-foreground">
          {isZh
            ? "查看您的训练进度和数据"
            : "Track your fitness progress and stats"}
        </p>
      </div>

      {/* Membership Info */}
      <MembershipCard locale={locale} />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                {isZh ? "总训练" : "Workouts"}
              </span>
            </div>
            <div className="text-3xl font-bold mt-2">{stats.totalWorkouts}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {isZh ? `本周 ${stats.thisWeekWorkouts} 次` : `${stats.thisWeekWorkouts} this week`}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                {isZh ? "总时长" : "Minutes"}
              </span>
            </div>
            <div className="text-3xl font-bold mt-2">{stats.totalDurationMinutes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-muted-foreground">
                {isZh ? "连续天数" : "Streak"}
              </span>
            </div>
            <div className="text-3xl font-bold mt-2">{stats.currentStreak}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {isZh ? `最长 ${stats.longestStreak} 天` : `Best: ${stats.longestStreak}`}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              <span className="text-sm text-muted-foreground">
                {isZh ? "总组数" : "Sets"}
              </span>
            </div>
            <div className="text-3xl font-bold mt-2">{stats.totalSets}</div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      {stats.totalWorkouts === 0 && (
        <Card className="bg-primary/10 border-primary/20 mb-8">
          <CardContent className="py-8 text-center">
            <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">
              {isZh ? "开始您的健身之旅" : "Start Your Fitness Journey"}
            </h2>
            <p className="text-muted-foreground mb-4">
              {isZh
                ? "选择一个训练计划，开始您的第一次训练"
                : "Choose a workout plan and start your first workout"}
            </p>
            <a href={`/${locale}/plans`}>
              <Badge variant="default" className="text-sm px-4 py-2">
                {isZh ? "浏览训练计划" : "Browse Plans"}
              </Badge>
            </a>
          </CardContent>
        </Card>
      )}

      {/* Recent Workouts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {isZh ? "最近训练" : "Recent Workouts"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.totalWorkouts === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {isZh
                ? "还没有训练记录。开始您的第一次训练吧！"
                : "No workouts yet. Start your first workout!"}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {isZh ? "加载中..." : "Loading..."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}