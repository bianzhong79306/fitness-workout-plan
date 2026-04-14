// 训练计划列表客户端组件

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
import { Dumbbell, Calendar, Zap, Target, Trophy, Clock, Flame, ChevronRight } from "lucide-react";

export default function PlansClient({ locale: initialLocale }: { locale: string }) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const isZh = initialLocale === "zh";

  // 筛选逻辑
  const filteredPlans = selectedGoal
    ? workoutPlans.filter((plan) => plan.goal === selectedGoal)
    : workoutPlans;

  // 目标图标映射
  const goalIcons: Record<string, typeof Target> = {
    'strength': Target,
    'muscle': Dumbbell,
    'fat_loss': Flame,
    'general': Zap,
  };

  return (
    <div className="min-h-screen">
      {/* 活力Hero区域 */}
      <section className="relative py-20 overflow-hidden">
        {/* 渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500" />
        
        {/* 动态网格 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        
        {/* 光晕装饰 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-300/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Trophy className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium">{isZh ? "专业训练体系" : "Professional Training System"}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 drop-shadow-lg">
            {isZh ? "训练计划" : "Workout Plans"}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-medium">
            {isZh ? "找到最适合您健身目标的计划" : "Find the perfect plan for your fitness goals"}
          </p>
          
          {/* 统计徽章 */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="font-bold">{workoutPlans.length}</span>
              <span className="ml-1 text-white/80">{isZh ? "个计划" : "Plans"}</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Flame className="w-4 h-4 inline mr-1" />
              <span className="font-bold">AI</span>
              <span className="ml-1 text-white/80">{isZh ? "智能生成" : "Powered"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Goal Filters - 活力按钮 */}
      <section className="py-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant={selectedGoal === null ? "default" : "outline"}
              size="lg"
              onClick={() => setSelectedGoal(null)}
              className={selectedGoal === null ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl" : "rounded-full font-medium"}
            >
              {isZh ? "全部" : "All"}
            </Button>
            {fitnessGoalOptions.map((goal) => {
              const Icon = goalIcons[goal.value] || Target;
              return (
                <Button
                  key={goal.value}
                  variant={selectedGoal === goal.value ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedGoal(goal.value)}
                  className={selectedGoal === goal.value ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg" : "rounded-full font-medium"}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {isZh ? goal.label : goal.labelEn}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Plans Grid - 活力卡片 */}
      <section className="py-12 bg-white dark:bg-slate-800">
        <div className="container">
          {selectedGoal && (
            <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
              {isZh
                ? `找到 ${filteredPlans.length} 个计划`
                : `${filteredPlans.length} plans found`}
            </p>
          )}
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <Link key={plan.id} href={`/plans/${plan.id}`}>
                <Card className="h-full hover:shadow-xl transition-all cursor-pointer group border-2 hover:border-purple-500/50">
                  {/* 渐变顶部装饰 */}
                  <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-t-lg" />
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={plan.isPremium ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-gradient-to-r from-green-400 to-emerald-500 text-white"}>
                        {plan.isPremium
                          ? isZh ? "高级" : "Premium"
                          : isZh ? "免费" : "Free"}
                      </Badge>
                      <Badge variant="outline" className="border-purple-500/20 text-purple-700 dark:text-purple-400">
                        {isZh
                          ? plan.difficulty === "beginner"
                            ? "初级"
                            : plan.difficulty === "intermediate"
                            ? "中级"
                            : "高级"
                          : plan.difficulty.charAt(0).toUpperCase() + plan.difficulty.slice(1)}
                      </Badge>
                    </div>
                    <CardTitle className="group-hover:text-purple-600 transition-colors">
                      {isZh ? plan.name : plan.nameEn}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-slate-600 dark:text-slate-400">
                      {isZh ? plan.description : plan.descriptionEn}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-full">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">{plan.durationWeeks}</span>
                        <span>{isZh ? "周" : "wk"}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded-full">
                        <Dumbbell className="h-4 w-4 text-pink-500" />
                        <span className="font-medium">{plan.sessionsPerWeek}</span>
                        <span>{isZh ? "次" : "ses"}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-400">
                        {isZh
                          ? fitnessGoalOptions.find((g) => g.value === plan.goal)?.label || plan.goal
                          : fitnessGoalOptions.find((g) => g.value === plan.goal)?.labelEn || plan.goal}
                      </Badge>
                      <ChevronRight className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* No results */}
      <section className="py-12 bg-white dark:bg-slate-800">
        {filteredPlans.length === 0 && (
          <div className="container text-center">
            <div className="max-w-md mx-auto p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50">
              <Dumbbell className="w-12 h-12 mx-auto mb-4 text-purple-500 opacity-50" />
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {isZh ? "没有找到符合条件的计划" : "No plans match your criteria"}
              </p>
              <Button
                onClick={() => setSelectedGoal(null)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full"
              >
                {isZh ? "查看全部计划" : "View all plans"}
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}