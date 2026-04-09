"use client";

import { useState } from "react";
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
import { workoutPlans } from "@/data/workout-plans";
import { fitnessGoalOptions } from "@/types/plan";
import { Dumbbell, Calendar, Clock } from "lucide-react";

interface PlansPageProps {
  params: Promise<{ locale: string }>;
}

export default function PlansPage({ params }: PlansPageProps) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [locale, setLocale] = useState<string>("en");

  // 解析 params
  params.then((p) => setLocale(p.locale));

  const isZh = locale === "zh";

  // 筛选逻辑
  const filteredPlans = selectedGoal
    ? workoutPlans.filter((plan) => plan.goal === selectedGoal)
    : workoutPlans;

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
        <Button
          variant={selectedGoal === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedGoal(null)}
        >
          {isZh ? "全部" : "All"}
        </Button>
        {fitnessGoalOptions.map((goal) => (
          <Button
            key={goal.value}
            variant={selectedGoal === goal.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedGoal(goal.value)}
          >
            {isZh ? goal.label : goal.labelEn}
          </Button>
        ))}
      </div>

      {/* Results count */}
      {selectedGoal && (
        <p className="text-center text-muted-foreground mb-6">
          {isZh
            ? `找到 ${filteredPlans.length} 个计划`
            : `${filteredPlans.length} plans found`}
        </p>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
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

      {/* No results */}
      {filteredPlans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {isZh
              ? "没有找到符合条件的计划"
              : "No plans match your criteria"}
          </p>
          <Button
            variant="link"
            onClick={() => setSelectedGoal(null)}
            className="mt-2"
          >
            {isZh ? "查看全部计划" : "View all plans"}
          </Button>
        </div>
      )}
    </div>
  );
}