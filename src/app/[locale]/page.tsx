import { setRequestLocale } from "next-intl/server";
export const runtime = "edge";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { workoutPlans, getFreePlans } from "@/data/workout-plans";
import { totalExercises } from "@/data/exercises";
import {
  Dumbbell, Timer, BarChart3, Zap, ChevronRight, Play, Sparkles, Check,
  Calendar, Target, Trophy, Flame, Sunrise, Moon, Users, Star, BookOpen,
  Activity, HeartPulse, Brain, Rocket, ArrowRight, MoveRight
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
  const freePlans = getFreePlans().slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - 活力渐变背景 */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* 背景图片 */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80')`,
          }}
        />
        
        {/* 动感渐变覆盖层 */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/80 via-blue-100/60 to-purple-100/80 dark:from-slate-900/95 dark:via-slate-800/90 dark:to-slate-900/95" />
        
        {/* 动态装饰元素 */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl float-hint" />
        
        {/* 运动线条装饰 */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-green-500" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div className="container relative z-10 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left slide-in-up">
              {/* 活力徽章 */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
                <Sparkles className="w-4 h-4 text-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  {isZh ? "知识库 + AI 智能教练" : "Knowledge + AI Coach"}
                </span>
                <span className="energy-badge">NEW</span>
              </div>

              {/* 主标题 */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
                <span className="bg-gradient-to-r from-slate-900 via-green-800 to-blue-900 bg-clip-text text-transparent dark:from-white dark:via-green-200 dark:to-blue-200">
                  {isZh ? "教你怎么练" : "Learn to Train"}
                </span>
                <br />
                <span className="relative">
                  <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                    {isZh ? "科学健身" : "Scientifically"}
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 6 Q50 0, 100 6 T200 6" stroke="currentColor" strokeWidth="3" fill="none" className="text-green-500/50" />
                  </svg>
                </span>
              </h1>

              {/* 描述 */}
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed">
                {isZh 
                  ? "不只是陪你练，更是教你练。专业动作百科、科学训练知识、AI智能计划，让你真正学会健身。" 
                  : "Not just train with you, but teach you how. Professional exercise library, scientific training knowledge, AI-powered plans—learn fitness properly."}
              </p>

              {/* 活力按钮组 */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link href="/plans">
                  <Button size="lg" className="energy-button rounded-full px-8 py-6 text-lg font-semibold shadow-xl shadow-green-500/30 hover:shadow-green-500/50 transition-all">
                    <Rocket className="w-5 h-5 mr-2" />
                    {isZh ? "开始训练" : "Start Training"}
                    <ArrowRight className="w-5 h-5 ml-2 animate-pulse" />
                  </Button>
                </Link>
                <Link href="/ai-plan">
                  <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg font-semibold border-2 border-blue-500/30 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-500 transition-all group">
                    <Brain className="w-5 h-5 mr-2 text-blue-500 group-hover:scale-110 transition-transform" />
                    {isZh ? "AI 生成计划" : "AI Generate Plan"}
                  </Button>
                </Link>
              </div>

              {/* 快速特点 */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {[
                  { icon: Check, text: isZh ? "免费开始" : "Free to Start", color: "green" },
                  { icon: Dumbbell, text: `${totalExercises}+ ${isZh ? "动作" : "Exercises"}`, color: "blue" },
                  { icon: BookOpen, text: isZh ? "知识库" : "Knowledge Base", color: "purple" },
                  { icon: Users, text: isZh ? "全球用户" : "Global Users", color: "orange" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 text-sm">
                    <item.icon className={`w-4 h-4 text-${item.color}-500`} />
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - 动感视觉元素 */}
            <div className="hidden lg:block relative">
              {/* 主圆形 */}
              <div className="relative w-[500px] h-[500px] mx-auto">
                {/* 外圈旋转 */}
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-green-500/30 animate-spin" style={{ animationDuration: '20s' }} />
                
                {/* 中圈脉冲 */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-green-500/20 via-blue-500/20 to-purple-500/20 animate-pulse" />
                
                {/* 内圈 */}
                <div className="absolute inset-16 rounded-full bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-slate-700 shadow-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative mb-4">
                      <Dumbbell className="w-20 h-20 text-green-500 animate-pulse" />
                      <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
                    </div>
                    <div className="text-5xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      {totalExercises}+
                    </div>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                      {isZh ? "专业动作教学" : "Professional Exercises"}
                    </div>
                  </div>
                </div>

                {/* 浮动卡片 */}
                <div className="absolute top-0 right-0 sport-card p-4 shadow-xl float-hint" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">10+</div>
                      <div className="text-xs text-slate-500">{isZh ? "训练计划" : "Plans"}</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 sport-card p-4 shadow-xl float-hint" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">AI</div>
                      <div className="text-xs text-slate-500">{isZh ? "智能生成" : "Smart Generate"}</div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 -right-8 sport-card p-4 shadow-xl float-hint" style={{ animationDelay: '1.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">11</div>
                      <div className="text-xs text-slate-500">{isZh ? "知识文章" : "Articles"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部波浪 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-20">
            <path d="M0 60 Q360 120, 720 60 T1440 60 V120 H0 Z" className="fill-white dark:fill-slate-900" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-white dark:bg-slate-900">
        <div className="container">
          {/* 标题 */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {isZh ? "四大核心功能" : "Four Core Features"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {isZh ? "从学习到实践，全方位健身支持" : "From learning to practice, comprehensive fitness support"}
            </p>
          </div>

          {/* 功能卡片 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                title: isZh ? "知识库" : "Knowledge Base",
                desc: isZh ? "科学训练原理、专业营养指南、人群定制建议" : "Scientific training principles, nutrition guides, customized advice",
                color: "from-purple-500 to-pink-500",
                href: "/knowledge",
                stat: "11 篇文章"
              },
              {
                icon: Dumbbell,
                title: isZh ? "动作百科" : "Exercise Library",
                desc: isZh ? "详细动作教学、分类清晰、视频演示" : "Detailed instructions, clear categories, video demos",
                color: "from-blue-500 to-indigo-500",
                href: "/exercises",
                stat: `${totalExercises}+ 动作`
              },
              {
                icon: Calendar,
                title: isZh ? "训练计划" : "Training Plans",
                desc: isZh ? "专业计划模板、难度分级、免费开始" : "Professional templates, difficulty levels, free start",
                color: "from-orange-500 to-red-500",
                href: "/plans",
                stat: "10+ 计划"
              },
              {
                icon: Brain,
                title: isZh ? "AI 生成" : "AI Generator",
                desc: isZh ? "智能生成计划、个性化定制、每日更新" : "Smart plan generation, personalized, daily updates",
                color: "from-green-500 to-emerald-500",
                href: "/ai-plan",
                stat: "AI 驱动"
              },
            ].map((feature, idx) => (
              <Link key={idx} href={feature.href}>
                <div className="sport-card sport-card-click p-6 h-full cursor-pointer group" style={{ animationDelay: `${idx * 100}ms` }}>
                  {/* 图标 */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* 标题 */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  {/* 描述 */}
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                    {feature.desc}
                  </p>
                  
                  {/* 统计 */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                      {feature.stat}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800">
                <Flame className="w-3 h-3 mr-1" />
                {isZh ? "快速开始" : "Quick Start"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {isZh ? "选择计划，立即开始" : "Choose a Plan, Start Now"}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                {isZh ? "无需复杂设置，选择适合你的计划，立刻开始训练。免费计划完全可用。" : "No complex setup. Choose a suitable plan and start training immediately. Free plans fully available."}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/plans">
                  <Button className="energy-button rounded-full px-6 gap-2">
                    <Play className="w-4 h-4" />
                    {isZh ? "浏览计划" : "Browse Plans"}
                  </Button>
                </Link>
                <Link href="/exercises">
                  <Button variant="outline" className="rounded-full px-6 gap-2 border-green-500/30 hover:bg-green-50">
                    <Dumbbell className="w-4 h-4" />
                    {isZh ? "查看动作" : "View Exercises"}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right - 计划卡片 */}
            <div className="grid gap-4">
              {freePlans.slice(0, 3).map((plan, idx) => (
                <Link key={plan.id} href={`/plans/${plan.id}`}>
                  <div className="exercise-card sport-card-click p-4 flex items-center gap-4 cursor-pointer group">
                    {/* 序号 */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${
                      idx === 0 ? 'from-green-500 to-emerald-500' :
                      idx === 1 ? 'from-blue-500 to-indigo-500' :
                      'from-purple-500 to-pink-500'
                    } flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {idx + 1}
                    </div>
                    
                    {/* 内容 */}
                    <div className="flex-1">
                      <h4 className="font-semibold group-hover:text-green-600 transition-colors">
                        {isZh ? plan.name : plan.nameEn}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {isZh ? (plan.difficulty === 'beginner' ? '初级' : plan.difficulty === 'intermediate' ? '中级' : '高级') : plan.difficulty} · {plan.durationWeeks} {isZh ? "周" : "weeks"}
                      </p>
                    </div>
                    
                    {/* Arrow */}
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: `${totalExercises}+`, label: isZh ? "专业动作" : "Exercises", icon: Dumbbell, color: "blue" },
              { value: "11", label: isZh ? "知识文章" : "Articles", icon: BookOpen, color: "purple" },
              { value: "10+", label: isZh ? "训练计划" : "Plans", icon: Calendar, color: "orange" },
              { value: "AI", label: isZh ? "智能生成" : "AI Powered", icon: Brain, color: "green" },
            ].map((stat, idx) => (
              <div key={idx} className="stats-card sport-card-click text-center p-6 rounded-2xl cursor-pointer hover:scale-105 transition-transform">
                <stat.icon className={`w-8 h-8 mx-auto mb-2 text-${stat.color}-500`} />
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 fitness-gradient text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isZh ? "准备好开始了吗？" : "Ready to Start?"}
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            {isZh ? "加入全球用户，科学健身，从这里开始" : "Join global users, train scientifically, start here"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" className="bg-white text-green-600 hover:bg-white/90 rounded-full px-8 font-semibold shadow-xl">
                <Rocket className="w-5 h-5 mr-2" />
                {isZh ? "免费注册" : "Sign Up Free"}
              </Button>
            </Link>
            <Link href="/knowledge">
              <Button size="lg" className="bg-green-700 text-white border-2 border-white/40 hover:bg-green-600 rounded-full px-8 font-semibold shadow-lg">
                <BookOpen className="w-5 h-5 mr-2" />
                {isZh ? "浏览知识库" : "Browse Knowledge"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}