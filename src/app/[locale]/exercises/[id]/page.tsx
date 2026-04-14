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
import { getExerciseById } from "@/data/exercises";
import { ChevronLeft, Check, X, Lightbulb } from "lucide-react";

export default function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  return <ExerciseDetailContent params={params} />;
}

async function ExerciseDetailContent({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const exercise = getExerciseById(id);
  if (!exercise) {
    notFound();
  }

  const isZh = locale === "zh";

  return (
    <div className="container py-8">
      {/* Back Button */}
      <Link href="/exercises">
        <Button variant="ghost" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          {isZh ? "返回动作库" : "Back to Exercises"}
        </Button>
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant={
                  exercise.difficulty === "beginner"
                    ? "secondary"
                    : exercise.difficulty === "intermediate"
                    ? "default"
                    : "destructive"
                }
              >
                {isZh
                  ? exercise.difficulty === "beginner"
                    ? "初级"
                    : exercise.difficulty === "intermediate"
                    ? "中级"
                    : "高级"
                  : exercise.difficulty.charAt(0).toUpperCase() +
                    exercise.difficulty.slice(1)}
              </Badge>
              <Badge variant="outline">
                {isZh
                  ? exercise.type === "strength"
                    ? "力量"
                    : exercise.type === "cardio"
                    ? "有氧"
                    : exercise.type === "stretch"
                    ? "拉伸"
                    : "平衡"
                  : exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold">
              {isZh ? exercise.name : exercise.nameEn}
            </h1>
            <p className="mt-2 text-muted-foreground">{exercise.description}</p>
          </div>

          {/* GIF 动作演示 */}
          {exercise.gifUrl && (
            <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-blue-500/20">
              <img
                src={exercise.gifUrl}
                alt={isZh ? `${exercise.name}动作演示` : `${exercise.nameEn} demonstration`}
                className="w-full h-auto max-h-[400px] object-contain mx-auto"
              />
              <div className="absolute bottom-2 right-2 bg-blue-500/80 text-white text-xs px-2 py-1 rounded-full">
                {isZh ? "动作演示" : "Animation"}
              </div>
            </div>
          )}

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                {isZh ? "动作要点" : "Tips"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {exercise.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <X className="h-5 w-5 text-red-500" />
                {isZh ? "常见错误" : "Common Mistakes"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {exercise.mistakes.map((mistake, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{mistake}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Target Muscles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isZh ? "目标肌群" : "Target Muscles"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {exercise.muscles.map((muscle) => (
                  <Badge key={muscle} variant="secondary">
                    {isZh
                      ? muscle === "chest"
                        ? "胸部"
                        : muscle === "back"
                        ? "背部"
                        : muscle === "shoulders"
                        ? "肩部"
                        : muscle === "arms"
                        ? "手臂"
                        : muscle === "core"
                        ? "核心"
                        : muscle === "legs"
                        ? "腿部"
                        : muscle === "glutes"
                        ? "臀部"
                        : "全身"
                      : muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isZh ? "所需器械" : "Equipment"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">
                {isZh
                  ? exercise.equipment === "none"
                    ? "徒手"
                    : exercise.equipment === "chair"
                    ? "椅子"
                    : exercise.equipment === "wall"
                    ? "墙壁"
                    : exercise.equipment === "doorframe"
                    ? "门框"
                    : exercise.equipment
                  : exercise.equipment === "none"
                  ? "No Equipment"
                  : exercise.equipment.charAt(0).toUpperCase() +
                    exercise.equipment.slice(1)}
              </Badge>
            </CardContent>
          </Card>

          {/* Alternative Exercises */}
          {exercise.alternatives && exercise.alternatives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {isZh ? "替代动作" : "Alternative Exercises"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {exercise.alternatives.map((altId) => (
                    <Link key={altId} href={`/exercises/${altId}`}>
                      <Button variant="ghost" className="w-full justify-start">
                        {altId.replace(/-/g, " ")}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Start Workout CTA */}
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="py-6 text-center">
              <p className="text-sm mb-4">
                {isZh
                  ? "想练习这个动作？"
                  : "Want to practice this exercise?"}
              </p>
              <Link href="/plans">
                <Button className="w-full">
                  {isZh ? "浏览训练计划" : "Browse Plans"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}