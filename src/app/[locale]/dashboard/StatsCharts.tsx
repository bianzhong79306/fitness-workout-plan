'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface WeeklyData {
  week: string;
  workouts: number;
  duration: number;
  label?: string;
}

interface WorkoutStatsResponse {
  weeklyData?: WeeklyData[];
  totalWorkouts?: number;
  totalDurationMinutes?: number;
}

interface StatsChartsProps {
  locale: string;
  totalWorkouts: number;
}

export function StatsCharts({ locale, totalWorkouts }: StatsChartsProps) {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);
  const isZh = locale === 'zh';

  useEffect(() => {
    if (totalWorkouts > 0) {
      fetch('/api/workout/stats')
        .then(res => res.json())
        .then((data) => {
          const statsData = data as WorkoutStatsResponse;
          // weeklyData 是从 API 返回的
          if (statsData.weeklyData && statsData.weeklyData.length > 0) {
            // 转换数据格式，让图表更友好
            const formatted = statsData.weeklyData.map((item: WeeklyData) => {
              // week 格式是 '2026-W15'，简化显示
              const weekNum = item.week.split('-W')[1] || item.week;
              return {
                ...item,
                label: isZh ? `第${weekNum}周` : `W${weekNum}`,
              };
            });
            // 按时间正序排列（旧到新）
            setWeeklyData(formatted.reverse());
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [totalWorkouts, isZh]);

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="py-8">
          <div className="animate-pulse flex space-x-4">
            <div className="h-48 bg-muted rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (totalWorkouts === 0 || weeklyData.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* 每周训练次数图表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            {isZh ? '每周训练次数' : 'Weekly Workouts'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [
                    isZh ? `${value} 次` : `${value} sessions`,
                    isZh ? '训练次数' : 'Workouts'
                  ]}
                />
                <Bar 
                  dataKey="workouts" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 每周训练时长图表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            {isZh ? '每周训练时长' : 'Weekly Duration'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [
                    isZh ? `${value} 分钟` : `${value} min`,
                    isZh ? '训练时长' : 'Duration'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="duration" 
                  stroke="hsl(142 76% 36%)" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(142 76% 36%)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}