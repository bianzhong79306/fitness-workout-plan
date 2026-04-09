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

  // 模拟数据（实际应该从API获取）
  const stats = {
    totalWorkouts: 0,
    totalDuration: 0,
    totalSets: 0,
    totalReps: 0,
    currentStreak: 0,
    lastWorkoutDate: null,
  };

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
            <div className="text-3xl font-bold mt-2">{stats.totalDuration}</div>
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