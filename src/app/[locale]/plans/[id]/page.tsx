import { setRequestLocale } from "next-intl/server";
export const runtime = "edge";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPlanById, getSessionExercises } from "@/data/workout-plans";
import { getExerciseById } from "@/data/exercises";
import {
  ChevronLeft,
  Calendar,
  Dumbbell,
  Clock,
  Zap,
  ChevronRight,
} from "lucide-react";

export default function PlanDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  return <PlanDetailContent params={params} />;
}

async function PlanDetailContent({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const plan = getPlanById(id);
  if (!plan) {
    notFound();
  }

  const isZh = locale === "zh";

  return (
    <div className="container py-8">
      {/* Back Button */}
      <Link href="/plans">
        <Button variant="ghost" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          {isZh ? "返回计划列表" : "Back to Plans"}
        </Button>
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={plan.isPremium ? "default" : "secondary"}>
                {plan.isPremium
                  ? isZh
                    ? "高级"
                    : "Premium"
                  : isZh
                  ? "免费"
                  : "Free"}
              </Badge>
              <Badge variant="outline">
                {isZh
                  ? plan.difficulty === "beginner"
                    ? "初级"
                    : plan.difficulty === "intermediate"
                    ? "中级"
                    : "高级"
                  : plan.difficulty.charAt(0).toUpperCase() +
                    plan.difficulty.slice(1)}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold">
              {isZh ? plan.name : plan.nameEn}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isZh ? plan.description : plan.descriptionEn}
            </p>
          </div>

          {/* Training Sessions */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              {isZh ? "训练课程" : "Training Sessions"}
            </h2>
            <div className="space-y-4">
              {plan.sessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {isZh ? session.name : session.nameEn}
                        </CardTitle>
                        <CardDescription>
                          {isZh
                            ? `第 ${session.sessionNumber} 次训练`
                            : `Session ${session.sessionNumber}`}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          {session.durationMinutes} {isZh ? "分钟" : "min"}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {session.exercises.map((pe, index) => {
                        const exercise = getExerciseById(pe.exerciseId);
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between py-2 border-b border-border last:border-0"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {index + 1}.
                              </span>
                              <span className="text-sm">
                                {exercise
                                  ? isZh
                                    ? exercise.name
                                    : exercise.nameEn
                                  : pe.exerciseId}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>
                                {pe.sets} {isZh ? "组" : "sets"}
                              </span>
                              {pe.reps && (
                                <span>
                                  × {pe.reps} {isZh ? "次" : "reps"}
                                </span>
                              )}
                              {pe.duration && (
                                <span>
                                  {pe.duration}
                                  {isZh ? "秒" : "s"}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Plan Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isZh ? "计划概述" : "Plan Overview"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{isZh ? "持续时间" : "Duration"}</span>
                </div>
                <span className="font-medium">
                  {plan.durationWeeks} {isZh ? "周" : "weeks"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Dumbbell className="h-4 w-4" />
                  <span className="text-sm">{isZh ? "训练频率" : "Frequency"}</span>
                </div>
                <span className="font-medium">
                  {plan.sessionsPerWeek} {isZh ? "次/周" : "sessions/week"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm">{isZh ? "目标" : "Goal"}</span>
                </div>
                <Badge variant="secondary">
                  {isZh
                    ? plan.goal === "muscle_gain"
                      ? "增肌"
                      : plan.goal === "fat_loss"
                      ? "减脂"
                      : plan.goal === "strength"
                      ? "力量提升"
                      : plan.goal === "endurance"
                      ? "耐力提升"
                      : "综合健身"
                    : plan.goal === "muscle_gain"
                    ? "Muscle Gain"
                    : plan.goal === "fat_loss"
                    ? "Fat Loss"
                    : plan.goal === "strength"
                    ? "Strength"
                    : plan.goal === "endurance"
                    ? "Endurance"
                    : "General Fitness"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Equipment Needed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isZh ? "所需器械" : "Equipment Needed"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {plan.equipment.map((eq) => (
                  <Badge key={eq} variant="outline">
                    {isZh
                      ? eq === "none"
                        ? "徒手"
                        : eq === "chair"
                        ? "椅子"
                        : eq === "wall"
                        ? "墙壁"
                        : eq === "doorframe"
                        ? "门框"
                        : eq
                      : eq === "none"
                      ? "No Equipment"
                      : eq.charAt(0).toUpperCase() + eq.slice(1)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Start Plan CTA */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="py-6">
              <Button className="w-full" size="lg" variant="secondary">
                {isZh ? "开始此计划" : "Start This Plan"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-center text-sm mt-3 text-primary-foreground/80">
                {isZh
                  ? "需要登录以保存进度"
                  : "Sign in required to track progress"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}