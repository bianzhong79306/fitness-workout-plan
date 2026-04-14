import { setRequestLocale } from "next-intl/server";
export const runtime = "edge";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer, Clock, Gauge, Flame, Zap, Trophy } from "lucide-react";
import { StopwatchClient } from "./stopwatch-client";
import { CountdownClient } from "./countdown-client";
import { HIITTimerClient } from "./hiit-client";

export default function TimersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <TimersPageContent params={params} />;
}

async function TimersPageContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isZh = locale === "zh";

  return (
    <div className="min-h-screen">
      {/* 活力Hero区域 */}
      <section className="relative py-20 overflow-hidden">
        {/* 渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500" />
        
        {/* 动态网格 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        
        {/* 光晕装饰 */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-300/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Timer className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium">{isZh ? "专业计时工具" : "Professional Timing Tools"}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 drop-shadow-lg">
            {isZh ? "训练计时器" : "Workout Timers"}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-medium">
            {isZh ? "使用内置计时器优化您的训练" : "Optimize your training with built-in timers"}
          </p>
          
          {/* 功能徽章 */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Clock className="w-4 h-4 inline mr-1" />
              <span className="font-medium">{isZh ? "秒表" : "Stopwatch"}</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Timer className="w-4 h-4 inline mr-1" />
              <span className="font-medium">{isZh ? "倒计时" : "Countdown"}</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Flame className="w-4 h-4 inline mr-1" />
              <span className="font-medium">HIIT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timer Tabs */}
      <section className="py-12 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container">
          <Tabs defaultValue="stopwatch" className="max-w-2xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 p-1 rounded-full">
              <TabsTrigger value="stopwatch" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white font-medium">
                <Clock className="h-4 w-4 mr-2" />
                {isZh ? "秒表" : "Stopwatch"}
              </TabsTrigger>
              <TabsTrigger value="countdown" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white font-medium">
                <Timer className="h-4 w-4 mr-2" />
                {isZh ? "倒计时" : "Countdown"}
              </TabsTrigger>
              <TabsTrigger value="hiit" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-green-500 data-[state=active]:text-white font-medium">
                <Flame className="h-4 w-4 mr-2" />
                HIIT
              </TabsTrigger>
            </TabsList>

        <TabsContent value="stopwatch">
          <Card className="border-2 border-blue-500/20 shadow-xl">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-lg" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                {isZh ? "秒表" : "Stopwatch"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StopwatchClient isZh={isZh} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="countdown">
          <Card className="border-2 border-cyan-500/20 shadow-xl">
            <div className="h-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-t-lg" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-cyan-500" />
                {isZh ? "倒计时" : "Countdown Timer"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CountdownClient isZh={isZh} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hiit">
          <Card className="border-2 border-teal-500/20 shadow-xl">
            <div className="h-2 bg-gradient-to-r from-teal-500 to-green-500 rounded-t-lg" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-teal-500" />
                HIIT Timer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HIITTimerClient isZh={isZh} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
      </section>
    </div>
  );
}