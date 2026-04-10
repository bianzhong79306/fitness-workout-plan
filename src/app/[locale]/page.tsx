import { setRequestLocale } from "next-intl/server";
export const runtime = "edge";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { workoutPlans, getFreePlans } from "@/data/workout-plans";
import { exercises } from "@/data/exercises";
import {
  Dumbbell, Timer, BarChart3, Zap, ChevronRight, Play, Sparkles, Check,
  Calendar, Target, Trophy, Medal, Crown, Users, Star, Shield, Globe,
  Gift, CalendarDays, Flame, Sunrise, Moon, Sliders, RefreshCw
} from "lucide-react";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const paramsPromise = params;
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
  const allPlans = workoutPlans.slice(0, 4);
  const totalExercises = exercises.length;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-accent/10 rounded-full blur-3xl" />

        <div className="container relative z-10 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left">
              <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
                <Sparkles className="w-3 h-3 mr-1" />
                {isZh ? "AI 智能训练" : "AI-Powered Training"}
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {isZh ? "科学健身，" : "Smart Fitness, "}
                <span className="text-primary">
                  {isZh ? "智能定制" : "Tailored for You"}
                </span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl">
                {isZh
                  ? "AI 驱动的个性化训练计划，专业动作库，让每次训练都有价值"
                  : "AI-powered personalized workout plans, professional exercise library, making every workout count"}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/plans">
                  <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/25">
                    <Play className="w-4 h-4" />
                    {isZh ? "免费开始训练" : "Start Training Free"}
                  </Button>
                </Link>
                <Link href="/ai-plan">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-primary/30 hover:bg-primary/5">
                    <Sparkles className="w-4 h-4" />
                    {isZh ? "AI 智能生成" : "AI Plan Generator"}
                  </Button>
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-accent" />
                  {isZh ? "无需器械" : "No Equipment Needed"}
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-accent" />
                  {isZh ? "随时随地" : "Train Anytime"}
                </span>
              </div>
            </div>

            {/* Right - Visual Element */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                {/* Central Visual */}
                <div className="w-72 h-72 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="w-56 h-56 rounded-full bg-background flex items-center justify-center shadow-xl">
                    <div className="text-center">
                      <Dumbbell className="w-16 h-16 text-primary mx-auto mb-4" />
                      <div className="text-4xl font-bold">{totalExercises}+</div>
                      <div className="text-sm text-muted-foreground">
                        {isZh ? "专业动作" : "Exercises"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <Card className="absolute -top-4 -right-4 p-3 shadow-lg border-primary/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">10</div>
                      <div className="text-xs text-muted-foreground">
                        {isZh ? "训练计划" : "Plans"}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="absolute -bottom-4 -left-4 p-3 shadow-lg border-accent/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">AI</div>
                      <div className="text-xs text-muted-foreground">
                        {isZh ? "智能生成" : "Powered"}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">{totalExercises}+</div>
              <div className="text-sm text-muted-foreground mt-1">
                {isZh ? "专业动作" : "Exercises"}
              </div>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div className="text-3xl font-bold">10</div>
              <div className="text-sm text-muted-foreground mt-1">
                {isZh ? "训练计划" : "Workout Plans"}
              </div>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">8</div>
              <div className="text-sm text-muted-foreground mt-1">
                {isZh ? "免费计划" : "Free Plans"}
              </div>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <div className="text-3xl font-bold">AI</div>
              <div className="text-sm text-muted-foreground mt-1">
                {isZh ? "智能生成" : "Powered"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Feature Highlight */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Sparkles className="w-3 h-3 mr-1" />
                {isZh ? "核心功能" : "Core Features"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {isZh
                  ? "AI 为你量身定制训练计划"
                  : "AI Creates Your Perfect Workout Plan"}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg">
                {isZh
                  ? "根据你的健身目标、训练水平、可用时间和器械条件，智能生成最适合你的专属训练计划"
                  : "Based on your fitness goals, level, available time, and equipment, our AI creates a personalized workout plan tailored specifically for you"}
              </p>

              <div className="space-y-4">
                {[
                  { icon: Target, text: isZh ? "精准目标匹配 - 增肌/减脂/力量/耐力" : "Precise Goal Matching - Muscle/Fat Loss/Strength/Endurance" },
                  { icon: Sliders, text: isZh ? "灵活参数配置 - 天数/时长/器械" : "Flexible Configuration - Days/Duration/Equipment" },
                  { icon: RefreshCw, text: isZh ? "动态调整优化 - 根据进度实时优化" : "Dynamic Optimization - Adjusts based on progress" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link href="/ai-plan" className="inline-block mt-8">
                <Button size="lg" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  {isZh ? "体验 AI 生成" : "Try AI Generator"}
                </Button>
              </Link>
            </div>

            {/* Visual - Mock AI Interface */}
            <div className="relative">
              <Card className="p-6 shadow-xl border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">{isZh ? "AI 计划生成器" : "AI Plan Generator"}</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">{isZh ? "增肌塑形" : "Muscle Gain"}</Badge>
                    <Badge variant="outline">{isZh ? "中级" : "Intermediate"}</Badge>
                    <Badge variant="outline">{isZh ? "哑铃" : "Dumbbell"}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">4</span> {isZh ? "次/周 · " : "sessions/week · "}
                    <span className="font-medium text-foreground">45</span> {isZh ? "分钟" : "minutes"}
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="text-sm font-medium mb-3">
                    {isZh ? "生成结果预览" : "Generated Plan Preview"}
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: isZh ? "哑铃推举" : "Dumbbell Press", sets: "4x12" },
                      { name: isZh ? "哑铃划船" : "Dumbbell Row", sets: "4x12" },
                      { name: isZh ? "哑铃深蹲" : "Goblet Squat", sets: "4x15" },
                    ].map((ex, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{ex.name}</span>
                        <Badge variant="secondary" className="text-xs">{ex.sets}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="absolute -z-10 inset-0 bg-primary/5 rounded-3xl blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {isZh ? "全方位健身解决方案" : "Complete Fitness Solution"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {isZh
                ? "从训练计划到进度追踪，从计时器到社区挑战，满足你所有健身需求"
                : "From workout plans to progress tracking, timers to challenges, everything you need"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Dumbbell,
                title: isZh ? `${totalExercises}+ 动作库` : `${totalExercises}+ Exercise Library`,
                desc: isZh ? "覆盖全身各肌群，含详细动作说明和要点提示" : "Full body coverage with detailed instructions and tips",
                color: "primary",
              },
              {
                icon: CalendarDays,
                title: isZh ? "10 个训练计划" : "10 Workout Plans",
                desc: isZh ? "从初级到高级，涵盖增肌、减脂、力量等多个目标" : "Beginner to advanced, covering all fitness goals",
                color: "accent",
              },
              {
                icon: Timer,
                title: isZh ? "专业计时器" : "Professional Timers",
                desc: isZh ? "HIIT、Tabata、倒计时多种模式，精准把控训练节奏" : "HIIT, Tabata, countdown modes for precise timing",
                color: "primary",
              },
              {
                icon: Trophy,
                title: isZh ? "成就系统" : "Achievement System",
                desc: isZh ? "解锁徽章，积累积分，记录每一次进步" : "Unlock badges, earn points, track every achievement",
                color: "accent",
              },
              {
                icon: Target,
                title: isZh ? "挑战赛" : "Challenges",
                desc: isZh ? "每日/每周/社区挑战，与他人一起突破极限" : "Daily/weekly/community challenges to push limits",
                color: "primary",
              },
              {
                icon: BarChart3,
                title: isZh ? "进度追踪" : "Progress Tracking",
                desc: isZh ? "训练历史、身体数据、日历视图全面记录成长轨迹" : "Workout history, body metrics, calendar view",
                color: "accent",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="p-6 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color === 'primary' ? 'bg-primary/10 group-hover:bg-primary/20' : 'bg-accent/10 group-hover:bg-accent/20'} flex items-center justify-center mb-4 transition-colors`}>
                  <feature.icon className={`w-6 h-6 ${feature.color === 'primary' ? 'text-primary' : 'text-accent'}`} />
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Preview */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Crown className="w-3 h-3 mr-1" />
              {isZh ? "会员计划" : "Membership Plans"}
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              {isZh ? "选择适合你的会员等级" : "Choose Your Membership Level"}
            </h2>
            <p className="text-muted-foreground">
              {isZh
                ? "从免费开始，随时升级解锁更多功能"
                : "Start free, upgrade anytime for more features"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free */}
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold mb-2">{isZh ? "免费" : "Free"}</div>
              <div className="text-muted-foreground mb-4">
                {isZh ? "基础功能" : "Basic Features"}
              </div>
              <ul className="text-sm space-y-3 mb-6 text-left">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent flex-shrink-0" />
                  {isZh ? "8个免费计划" : "8 Free Plans"}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent flex-shrink-0" />
                  {isZh ? "进度追踪" : "Progress Tracking"}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent flex-shrink-0" />
                  {isZh ? "成就系统" : "Achievement System"}
                </li>
              </ul>
              <Link href="/auth/signin">
                <Button variant="outline" className="w-full">
                  {isZh ? "免费开始" : "Start Free"}
                </Button>
              </Link>
            </Card>

            {/* Pro */}
            <Card className="text-center p-6 border-primary shadow-lg relative hover:shadow-xl transition-shadow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {isZh ? "推荐" : "Recommended"}
                </Badge>
              </div>
              <div className="text-2xl font-bold mb-2">{isZh ? "专业会员" : "Pro"}</div>
              <div className="text-primary font-bold text-xl mb-4">
                $9.99<span className="text-sm text-muted-foreground font-normal">/mo</span>
              </div>
              <ul className="text-sm space-y-3 mb-6 text-left">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent flex-shrink-0" />
                  {isZh ? "AI 智能生成" : "AI Plan Generator"}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent flex-shrink-0" />
                  {isZh ? "全部训练计划" : "All Workout Plans"}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent flex-shrink-0" />
                  {isZh ? "挑战赛系统" : "Challenge System"}
                </li>
              </ul>
              <Link href="/pricing">
                <Button className="w-full">
                  {isZh ? "立即升级" : "Upgrade Now"}
                </Button>
              </Link>
            </Card>

            {/* Premium */}
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold mb-2">{isZh ? "高级会员" : "Premium"}</div>
              <div className="font-bold text-xl mb-4">
                $19.99<span className="text-sm text-muted-foreground font-normal">/mo</span>
              </div>
              <ul className="text-sm space-y-3 mb-6 text-left">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent flex-shrink-0" />
                  {isZh ? "无限 AI 生成" : "Unlimited AI"}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent flex-shrink-0" />
                  {isZh ? "数据导出" : "Data Export"}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent flex-shrink-0" />
                  {isZh ? "优先支持" : "Priority Support"}
                </li>
              </ul>
              <Link href="/pricing">
                <Button variant="outline" className="w-full">
                  {isZh ? "了解更多" : "Learn More"}
                </Button>
              </Link>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/pricing">
              <Button variant="ghost" className="gap-1">
                {isZh ? "查看完整对比" : "View Full Comparison"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Workout Plans Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <Badge className="mb-4">{isZh ? "精选计划" : "Featured Plans"}</Badge>
              <h2 className="text-3xl font-bold mb-2">
                {isZh ? "热门训练计划" : "Popular Workout Plans"}
              </h2>
              <p className="text-muted-foreground">
                {isZh
                  ? "专业设计的训练计划，满足不同健身目标"
                  : "Professionally designed plans for different fitness goals"}
              </p>
            </div>
            <Link href="/plans">
              <Button variant="outline" className="gap-2">
                {isZh ? "查看全部" : "View All"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allPlans.map((plan) => (
              <Link key={plan.id} href={`/plans/${plan.id}`}>
                <Card className="h-full hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer group overflow-hidden">
                  {/* Goal Color Bar */}
                  <div className={`h-1.5 ${
                    plan.goal === 'muscle_gain' ? 'bg-primary' :
                    plan.goal === 'fat_loss' ? 'bg-accent' :
                    plan.goal === 'strength' ? 'bg-orange-500' :
                    'bg-muted-foreground'
                  }`} />

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={plan.isPremium ? "default" : "secondary"}>
                        {plan.isPremium
                          ? (isZh ? "高级" : "Premium")
                          : (isZh ? "免费" : "Free")}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {plan.goal === 'muscle_gain' ? (isZh ? "增肌" : "Muscle") :
                         plan.goal === 'fat_loss' ? (isZh ? "减脂" : "Fat Loss") :
                         plan.goal === 'strength' ? (isZh ? "力量" : "Strength") :
                         (isZh ? "综合" : "General")}
                      </Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors text-lg">
                      {isZh ? plan.name : plan.nameEn}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {isZh ? plan.description : plan.descriptionEn}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {plan.durationWeeks} {isZh ? "周" : "wks"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Dumbbell className="w-4 h-4" />
                        {plan.sessionsPerWeek} {isZh ? "次/周" : "/wk"}
                      </span>
                    </div>

                    {/* Difficulty Indicator */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {isZh ? "难度：" : "Level:"}
                      </span>
                      <Progress
                        value={
                          plan.difficulty === 'beginner' ? 33 :
                          plan.difficulty === 'intermediate' ? 66 : 100
                        }
                        className="h-1.5 flex-1"
                      />
                      <span className="text-xs font-medium">
                        {plan.difficulty === 'beginner' ? (isZh ? "初级" : "Beg") :
                         plan.difficulty === 'intermediate' ? (isZh ? "中级" : "Int") :
                         (isZh ? "高级" : "Adv")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Premium Plans Callout */}
          <div className="mt-8 text-center">
            <Alert className="max-w-2xl mx-auto border-primary/20 bg-primary/5">
              <Crown className="w-4 h-4 text-primary" />
              <AlertDescription>
                {isZh
                  ? "升级会员解锁 2 个高级计划，获得更多训练选择"
                  : "Upgrade to access 2 premium plans with more training options"}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      {/* Challenges & Achievements Preview */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Challenges Preview */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">
                  {isZh ? "挑战赛系统" : "Challenge System"}
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  { type: "daily", name: isZh ? "每日挑战" : "Daily Challenge", desc: isZh ? "每天完成指定训练任务" : "Complete daily workout tasks", icon: Zap, points: 10 },
                  { type: "weekly", name: isZh ? "每周挑战" : "Weekly Challenge", desc: isZh ? "一周内达成训练目标" : "Achieve weekly workout goals", icon: Calendar, points: 50 },
                  { type: "community", name: isZh ? "社区挑战" : "Community Challenge", desc: isZh ? "与大家一起突破极限" : "Push limits together", icon: Users, points: 20 },
                ].map((challenge, i) => (
                  <Card key={i} className="p-4 flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <challenge.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{challenge.name}</div>
                      <p className="text-sm text-muted-foreground">{challenge.desc}</p>
                    </div>
                    <Badge variant="secondary" className="flex-shrink-0">
                      +{challenge.points} {isZh ? "积分" : "pts"}
                    </Badge>
                  </Card>
                ))}
              </div>

              <Link href="/dashboard" className="inline-block mt-6">
                <Button variant="outline" className="gap-2">
                  {isZh ? "参与挑战" : "Join Challenges"}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Achievements Preview */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-bold">
                  {isZh ? "成就系统" : "Achievement System"}
                </h2>
              </div>

              <Card className="p-6">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: Dumbbell, name: isZh ? "首次训练" : "First Workout", unlocked: true },
                    { icon: Flame, name: isZh ? "周连续" : "Week Streak", unlocked: true },
                    { icon: Medal, name: isZh ? "月度坚持" : "Monthly", unlocked: false },
                    { icon: Sunrise, name: isZh ? "早起鸟" : "Early Bird", unlocked: false },
                    { icon: Moon, name: isZh ? "夜猫子" : "Night Owl", unlocked: true },
                    { icon: Crown, name: isZh ? "钢铁意志" : "Iron Will", unlocked: false },
                  ].map((achievement, i) => (
                    <div
                      key={i}
                      className={`text-center p-3 rounded-lg transition-colors ${
                        achievement.unlocked
                          ? 'bg-accent/10 border border-accent/30'
                          : 'bg-muted/50 opacity-50'
                      }`}
                    >
                      <achievement.icon className={`w-6 h-6 mx-auto mb-2 ${
                        achievement.unlocked ? 'text-accent' : 'text-muted-foreground'
                      }`} />
                      <span className="text-xs">{achievement.name}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm">
                    <span className="text-accent font-bold">150</span>
                    <span className="text-muted-foreground ml-1">
                      {isZh ? "总积分" : "Total Points"}
                    </span>
                  </div>
                  <Badge variant="secondary">3/6 {isZh ? "已解锁" : "unlocked"}</Badge>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {isZh ? "用户真实反馈" : "Real User Stories"}
            </h2>
            <p className="text-muted-foreground">
              {isZh
                ? "看看其他用户如何通过 FitPlan Pro 实现健身目标"
                : "See how others achieved their fitness goals with FitPlan Pro"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                avatar: "J",
                name: isZh ? "张明" : "John M.",
                role: isZh ? "上班族" : "Office Worker",
                quote: isZh
                  ? "AI 生成的计划非常适合我的时间安排，3个月减掉了8公斤，推荐给所有想健身的朋友！"
                  : "AI-generated plan fits my schedule perfectly, lost 8kg in 3 months. Highly recommend to everyone!",
                metric: "-8kg"
              },
              {
                avatar: "S",
                name: isZh ? "李雪" : "Sarah L.",
                role: isZh ? "健身新手" : "Fitness Beginner",
                quote: isZh
                  ? "动作库很全面，视频指导帮助我正确掌握每个动作，作为新手再也不用担心姿势不对了。"
                  : "Comprehensive exercise library with great instructions. No more worrying about wrong form!",
                metric: "128+ exercises"
              },
              {
                avatar: "M",
                name: isZh ? "王强" : "Mike W.",
                role: isZh ? "健身爱好者" : "Fitness Enthusiast",
                quote: isZh
                  ? "挑战赛系统让我保持动力，已经连续训练30天，成就感满满！"
                  : "Challenge system keeps me motivated, 30 days streak achieved. Feeling accomplished!",
                metric: "30 days"
              },
            ].map((testimonial, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                  <Badge variant="secondary" className="text-accent">
                    {testimonial.metric}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "{testimonial.quote}"
                </p>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container">
          <Card className="overflow-hidden relative">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-accent" />

            <CardContent className="relative z-10 py-16 text-center text-white">
              <Sparkles className="w-12 h-12 mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {isZh
                  ? "今天就开始你的健身之旅"
                  : "Start Your Fitness Journey Today"}
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8">
                {isZh
                  ? `${totalExercises}+ 专业动作，10+ 训练计划，AI 智能生成，免费开始`
                  : `${totalExercises}+ exercises, 10+ plans, AI-powered generation, free to start`}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signin">
                  <Button size="lg" variant="secondary" className="gap-2 shadow-lg">
                    <Play className="w-4 h-4" />
                    {isZh ? "免费注册开始" : "Sign Up Free"}
                  </Button>
                </Link>
                <Link href="/plans">
                  <Button size="lg" variant="outline" className="gap-2 border-white/30 text-white hover:bg-white/10">
                    {isZh ? "浏览训练计划" : "Browse Plans"}
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 mt-8 text-white/60 text-sm">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  {isZh ? "安全支付" : "Secure Payment"}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {isZh ? "中英双语" : "Multi-language"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}