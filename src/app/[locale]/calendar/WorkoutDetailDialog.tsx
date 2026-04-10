'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock, Dumbbell, Star, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface WorkoutDetailDialogProps {
  day: CalendarDay | null;
  open: boolean;
  onClose: () => void;
  locale: string;
}

export function WorkoutDetailDialog({
  day,
  open,
  onClose,
  locale,
}: WorkoutDetailDialogProps) {
  const isZh = locale === 'zh';

  if (!day) return null;

  const formattedDate = new Date(day.date).toLocaleDateString(
    isZh ? 'zh-CN' : 'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return isZh ? '未记录' : 'Not recorded';
    const mins = Math.round(seconds / 60);
    return `${mins} ${isZh ? '分钟' : 'min'}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {formattedDate}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* 训练数量 */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {isZh
                ? `${day.workoutCount} 次训练`
                : `${day.workoutCount} workouts`}
            </Badge>
          </div>

          {/* 训练列表 */}
          {day.workouts.map((workout, index) => (
            <div
              key={workout.id}
              className="p-4 rounded-lg bg-muted/50 space-y-3"
            >
              {/* 训练计划名称 */}
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {workout.plan_name ||
                    (isZh ? '自定义训练' : 'Custom Workout')}
                </span>
                {workout.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm">{workout.rating}</span>
                  </div>
                )}
              </div>

              {/* 训练详情 */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDuration(workout.duration_seconds)}
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell className="h-4 w-4" />
                  {workout.total_sets
                    ? `${workout.total_sets} ${isZh ? '组' : 'sets'}`
                    : (isZh ? '未记录' : 'Not recorded')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}