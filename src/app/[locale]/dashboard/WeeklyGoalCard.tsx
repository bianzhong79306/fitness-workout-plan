'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/ui/progress-ring';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Target, Settings, Check } from 'lucide-react';

interface WeeklyGoalCardProps {
  locale: string;
}

interface StatsData {
  thisWeekWorkouts: number;
  weeklyGoal: number;
  completionRate: number;
}

export function WeeklyGoalCard({ locale }: WeeklyGoalCardProps) {
  const [stats, setStats] = useState<StatsData>({
    thisWeekWorkouts: 0,
    weeklyGoal: 3,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editingGoal, setEditingGoal] = useState(3);
  const [saving, setSaving] = useState(false);
  const isZh = locale === 'zh';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/workout/stats');
      if (response.ok) {
        const data = await response.json() as StatsData;
        setStats({
          thisWeekWorkouts: data.thisWeekWorkouts || 0,
          weeklyGoal: data.weeklyGoal || 3,
          completionRate: data.completionRate || 0,
        });
        setEditingGoal(data.weeklyGoal || 3);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = async (newGoal: number) => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeklyWorkoutGoal: newGoal }),
      });

      if (response.ok) {
        // 重新获取统计数据以更新完成率
        await fetchStats();
      }
    } catch (error) {
      console.error('Failed to update goal:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="py-8">
          <div className="animate-pulse h-32 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const goalOptions = [1, 2, 3, 4, 5, 6, 7];
  const isCompleted = stats.completionRate >= 100;

  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <span>{isZh ? '本周目标' : 'Weekly Goal'}</span>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {isZh ? '设置每周训练目标' : 'Set Weekly Workout Goal'}
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {isZh
                    ? '选择每周计划完成的训练次数：'
                    : 'Choose how many workouts you plan to complete each week:'}
                </p>
                <div className="grid grid-cols-7 gap-2">
                  {goalOptions.map((num) => (
                    <Button
                      key={num}
                      variant={editingGoal === num ? 'default' : 'outline'}
                      size="sm"
                      className="h-10"
                      onClick={() => setEditingGoal(num)}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">
                      {isZh ? '取消' : 'Cancel'}
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={() => updateGoal(editingGoal)}
                    disabled={saving}
                  >
                    {saving
                      ? (isZh ? '保存中...' : 'Saving...')
                      : (isZh ? '保存' : 'Save')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
          {/* 进度环 */}
          <div className="relative">
            <ProgressRing
              percentage={stats.completionRate}
              size={140}
              strokeWidth={12}
              color={isCompleted ? 'hsl(142 76% 36%)' : 'hsl(var(--primary))'}
            />
            {isCompleted && (
              <div className="absolute -top-2 -right-2">
                <Check className="h-6 w-6 text-green-500" />
              </div>
            )}
          </div>

          {/* 详细信息 */}
          <div className="flex flex-col gap-4 text-center md:text-left">
            <div>
              <div className="text-3xl font-bold">
                {stats.thisWeekWorkouts}
                <span className="text-muted-foreground"> / {stats.weeklyGoal}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {isZh ? '本周训练次数' : 'Workouts this week'}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {Array.from({ length: stats.weeklyGoal }).map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i < stats.thisWeekWorkouts
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i < stats.thisWeekWorkouts ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-xs">{i + 1}</span>
                  )}
                </div>
              ))}
            </div>

            {/* 进度文本 */}
            <div className="text-sm text-muted-foreground">
              {isCompleted
                ? (isZh ? '🎉 目标已完成！' : '🎉 Goal completed!')
                : stats.thisWeekWorkouts === 0
                  ? (isZh ? '开始你的第一次训练' : 'Start your first workout')
                  : (isZh
                    ? `还需 ${stats.weeklyGoal - stats.thisWeekWorkouts} 次完成目标`
                    : `${stats.weeklyGoal - stats.thisWeekWorkouts} more to complete goal`)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}