'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarGrid } from './CalendarGrid';
import { WorkoutDetailDialog } from './WorkoutDetailDialog';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

interface WorkoutInfo {
  id: string;
  plan_name: string | null;
  duration_seconds: number | null;
  total_sets: number | null;
  rating: number | null;
}

interface CalendarDay {
  date: string;
  hasWorkout: boolean;
  workoutCount: number;
  workouts: WorkoutInfo[];
}

interface MonthData {
  year: number;
  month: number;
  days: CalendarDay[];
}

interface CalendarClientProps {
  locale: string;
}

export function CalendarClient({ locale }: CalendarClientProps) {
  const isZh = locale === 'zh';
  const [currentDate, setCurrentDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const [monthData, setMonthData] = useState<MonthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchMonthData = useCallback(async (year: number, month: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/calendar?year=${year}&month=${month}`);
      if (response.ok) {
        const data = await response.json() as MonthData;
        setMonthData(data);
      }
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonthData(currentDate.year, currentDate.month);
  }, [currentDate, fetchMonthData]);

  const goToPrevMonth = () => {
    setCurrentDate((prev) => {
      if (prev.month === 1) {
        return { year: prev.year - 1, month: 12 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => {
      if (prev.month === 12) {
        return { year: prev.year + 1, month: 1 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const goToToday = () => {
    setCurrentDate({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    });
  };

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day);
    setDialogOpen(true);
  };

  const monthName = new Date(
    currentDate.year,
    currentDate.month - 1
  ).toLocaleDateString(isZh ? 'zh-CN' : 'en-US', {
    month: 'long',
    year: 'numeric',
  });

  // 统计数据
  const workoutDays = monthData?.days?.filter((d) => d.hasWorkout).length || 0;
  const totalWorkouts =
    monthData?.days?.reduce((sum, d) => sum + d.workoutCount, 0) || 0;

  return (
    <div className="min-h-screen">
      {/* 活力Hero区域 */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-500">
        {/* 光晕装饰 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-300/30 rounded-full blur-2xl" />
        
        <div className="container relative z-10 text-center text-white">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 border border-white/20">
            <CalendarDays className="w-5 h-5" />
            <span className="font-medium">{isZh ? "记录每一次突破" : "Track Every Achievement"}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            {isZh ? '训练日历' : 'Workout Calendar'}
          </h1>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {isZh ? '查看您的训练历史和进度' : 'View your workout history and progress'}
          </p>
        </div>
      </section>
      
      {/* 内容区域 */}
      <div className="container py-16">

      <Card className="border-2 border-indigo-500/20 shadow-xl">
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-t-lg" />
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            {/* 月份导航 */}
            <div className="flex items-center gap-3">
              <Button className="rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white" size="icon" onClick={goToPrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xl font-bold min-w-[160px] text-center text-indigo-700">
                {monthName}
              </span>
              <Button className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* 今天按钮 */}
            <Button className="rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 border-2 border-indigo-300" onClick={goToToday}>
              {isZh ? '今天' : 'Today'}
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* 月度统计 */}
          <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b-2 border-indigo-200">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100">
              <span className="text-indigo-600 font-medium">
                {isZh ? '训练天数: ' : 'Workout days: '}
              </span>
              <span className="font-bold text-indigo-700">{workoutDays}</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100">
              <span className="text-blue-600 font-medium">
                {isZh ? '总训练次数: ' : 'Total workouts: '}
              </span>
              <span className="font-bold text-blue-700">{totalWorkouts}</span>
            </div>
          </div>

          {/* 日历网格 */}
          {loading ? (
            <div className="animate-pulse">
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="h-12 md:h-14 bg-muted rounded-md" />
                ))}
              </div>
            </div>
          ) : (
            <CalendarGrid
              year={currentDate.year}
              month={currentDate.month}
              days={monthData?.days || []}
              locale={locale}
              onDayClick={handleDayClick}
            />
          )}

          {/* 空数据提示 */}
          {!loading && workoutDays === 0 && (
            <div className="mt-6 text-center p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200">
              <p className="text-indigo-600">
                {isZh
                  ? '本月还没有训练记录，开始您的第一次训练吧！'
                  : 'No workouts this month. Start your first workout!'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 训练详情弹窗 */}
      <WorkoutDetailDialog
        day={selectedDay}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        locale={locale}
      />
      </div>
    </div>
  );
}