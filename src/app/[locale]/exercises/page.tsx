import { setRequestLocale } from "next-intl/server";
export const runtime = "edge";
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
import { exercises } from "@/data/exercises";
import { muscleGroupOptions } from "@/types/exercise";
import { Dumbbell, Clock, ChevronRight } from "lucide-react";

export default function ExercisesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <ExercisesPageContent params={params} />;
}

async function ExercisesPageContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isZh = locale === "zh";

  // 按肌群分组
  const groupedExercises = muscleGroupOptions.map((group) => ({
    ...group,
    exercises: exercises.filter((e) => e.muscles.includes(group.value)),
  }));

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">
          {isZh ? "动作库" : "Exercise Library"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {isZh
            ? `共 ${exercises.length} 个训练动作`
            : `${exercises.length} exercises available`}
        </p>
      </div>

      {/* Exercise Groups */}
      <div className="space-y-12">
        {groupedExercises.map((group) => (
          <section key={group.value}>
            <div className="flex items-center gap-2 mb-6">
              <Dumbbell className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">
                {isZh ? group.label : group.labelEn}
              </h2>
              <Badge variant="secondary">{group.exercises.length}</Badge>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.exercises.slice(0, 6).map((exercise) => (
                <Link key={exercise.id} href={`/exercises/${exercise.id}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {isZh ? exercise.name : exercise.nameEn}
                        </CardTitle>
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
                      </div>
                      <CardDescription className="line-clamp-2">
                        {exercise.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {exercise.type === "cardio" && (
                          <Clock className="h-3 w-3" />
                        )}
                        {isZh
                          ? exercise.equipment === "none"
                            ? "徒手"
                            : exercise.equipment === "chair"
                            ? "椅子"
                            : exercise.equipment === "wall"
                            ? "墙壁"
                            : exercise.equipment
                          : exercise.equipment === "none"
                          ? "No equipment"
                          : exercise.equipment.charAt(0).toUpperCase() +
                            exercise.equipment.slice(1)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            {group.exercises.length > 6 && (
              <div className="mt-4 text-center">
                <Button variant="ghost">
                  {isZh
                    ? `查看全部 ${group.exercises.length} 个动作`
                    : `View all ${group.exercises.length} exercises`}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}