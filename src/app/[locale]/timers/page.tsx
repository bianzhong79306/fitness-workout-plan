import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer, Stopwatch, Gauge, Flame } from "lucide-react";
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
    <div className="container py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">
          {isZh ? "训练计时器" : "Workout Timers"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {isZh
            ? "使用内置计时器优化您的训练"
            : "Optimize your training with built-in timers"}
        </p>
      </div>

      {/* Timer Tabs */}
      <Tabs defaultValue="stopwatch" className="max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stopwatch">
            <Stopwatch className="h-4 w-4 mr-2" />
            {isZh ? "秒表" : "Stopwatch"}
          </TabsTrigger>
          <TabsTrigger value="countdown">
            <Timer className="h-4 w-4 mr-2" />
            {isZh ? "倒计时" : "Countdown"}
          </TabsTrigger>
          <TabsTrigger value="hiit">
            <Flame className="h-4 w-4 mr-2" />
            HIIT
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stopwatch">
          <Card>
            <CardHeader>
              <CardTitle>{isZh ? "秒表" : "Stopwatch"}</CardTitle>
            </CardHeader>
            <CardContent>
              <StopwatchClient isZh={isZh} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="countdown">
          <Card>
            <CardHeader>
              <CardTitle>{isZh ? "倒计时" : "Countdown Timer"}</CardTitle>
            </CardHeader>
            <CardContent>
              <CountdownClient isZh={isZh} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hiit">
          <Card>
            <CardHeader>
              <CardTitle>HIIT Timer</CardTitle>
            </CardHeader>
            <CardContent>
              <HIITTimerClient isZh={isZh} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}