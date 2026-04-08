import { setRequestLocale } from "next-intl/server";
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
import { workoutPlans, fitnessGoalOptions } from "@/data/workout-plans";
import { Dumbbell, Calendar, Clock, ChevronRight } from "lucide-react";

export default function PlansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <PlansPageContent params={params} />;
}

async function PlansPageContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isZh = locale === "zh";

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">
          {isZh ? "训练计划" : "Workout Plans"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {isZh
            ? "找到最适合您健身目标的计划"
            : "Find the perfect plan for your fitness goals"}
        </p>
      </div>

      {/* Goal Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Button variant="outline" size="sm">
          {isZh ? "全部" : "All"}
        </Button>
        {fitnessGoalOptions.map((goal) => (
          <Button key={goal.value} variant="outline" size="sm">
            {isZh ? goal.label : goal.labelEn}
          </Button>
        ))}
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workoutPlans.map((plan) => (
          <Link key={plan.id} href={`/plans/${plan.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
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
                <CardTitle>{isZh ? plan.name : plan.nameEn}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {isZh ? plan.description : plan.descriptionEn}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {plan.durationWeeks} {isZh ? "周" : "weeks"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Dumbbell className="h-4 w-4" />
                    {plan.sessionsPerWeek} {isZh ? "次/周" : "sessions/week"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {isZh
                      ? fitnessGoalOptions.find((g) => g.value === plan.goal)
                          ?.label || plan.goal
                      : fitnessGoalOptions.find((g) => g.value === plan.goal)
                          ?.labelEn || plan.goal}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}