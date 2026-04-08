import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { workoutPlans, getFreePlans } from "@/data/workout-plans";
import { exercises } from "@/data/exercises";
import { Dumbbell, Timer, BarChart3, Zap, ChevronRight } from "lucide-react";

const features = [
  {
    icon: Dumbbell,
    title: "Personalized Plans",
    titleZh: "个性化计划",
    description: "Custom workout plans tailored to your goals and fitness level",
    descriptionZh: "根据您的目标和健身水平定制的训练计划",
  },
  {
    icon: Zap,
    title: "100+ Exercises",
    titleZh: "100+ 动作",
    description: "Comprehensive exercise library with detailed instructions",
    descriptionZh: "包含详细说明的全面动作库",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    titleZh: "进度追踪",
    description: "Track your workouts and monitor your progress over time",
    descriptionZh: "记录训练并监控您的进步",
  },
  {
    icon: Timer,
    title: "Workout Timers",
    titleZh: "训练计时器",
    description: "Built-in timers for HIIT, Tabata, and rest periods",
    descriptionZh: "内置HIIT、Tabata和休息计时器",
  },
];

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const paramsPromise = params;
  // 使用 async/await 处理 params
  return <HomePageContent params={paramsPromise} />;
}

async function HomePageContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isZh = locale === "zh";
  const freePlans = getFreePlans().slice(0, 4);
  const totalExercises = exercises.length;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/10 to-background">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl whitespace-pre-line">
              {isZh
                ? "改变身体，\n改变生活"
                : "Transform Your Body,\nTransform Your Life"}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              {isZh
                ? "个性化训练计划、专业指导和进度追踪 - 尽在掌握"
                : "Personalized workout plans, expert guidance, and progress tracking - all in one place."}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/plans">
                <Button size="lg" className="w-full sm:w-auto">
                  {isZh ? "免费开始" : "Start Free"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/exercises">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  {isZh ? "浏览动作库" : "Browse Exercises"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{totalExercises}+</div>
              <div className="text-sm text-muted-foreground">
                {isZh ? "训练动作" : "Exercises"}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">10</div>
              <div className="text-sm text-muted-foreground">
                {isZh ? "训练计划" : "Workout Plans"}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">
                {isZh ? "免费使用" : "Free to Use"}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">
                {isZh ? "随时训练" : "Train Anytime"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">
              {isZh ? "为什么选择 FitPlan Pro？" : "Why Choose FitPlan Pro?"}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {isZh
                ? "实现健身目标所需的一切"
                : "Everything you need to achieve your fitness goals"}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">
                    {isZh ? feature.titleZh : feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {isZh ? feature.descriptionZh : feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Plans Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">
                {isZh ? "热门训练计划" : "Popular Workout Plans"}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {isZh
                  ? "选择适合您的训练计划，开始健身之旅"
                  : "Choose a plan that fits your goals"}
              </p>
            </div>
            <Link href="/plans" className="hidden md:block">
              <Button variant="outline">
                {isZh ? "查看全部" : "View All"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {freePlans.map((plan) => (
              <Link key={plan.id} href={`/plans/${plan.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
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
                    <CardTitle className="mt-3">
                      {isZh ? plan.name : plan.nameEn}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {isZh ? plan.description : plan.descriptionEn}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {plan.durationWeeks} {isZh ? "周" : "weeks"}
                      </span>
                      <span>
                        {plan.sessionsPerWeek} {isZh ? "次/周" : "sessions/week"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/plans">
              <Button variant="outline">
                {isZh ? "查看全部计划" : "View All Plans"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold">
                {isZh ? "准备好开始了吗？" : "Ready to Get Started?"}
              </h2>
              <p className="mt-4 text-primary-foreground/80">
                {isZh
                  ? "加入我们，开始您的健身之旅"
                  : "Join us and start your fitness journey today"}
              </p>
              <Link href="/plans" className="inline-block mt-6">
                <Button size="lg" variant="secondary">
                  {isZh ? "浏览训练计划" : "Browse Workout Plans"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}