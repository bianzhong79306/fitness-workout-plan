'use client';

import { useState } from 'react';
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

interface CalendarGridProps {
  year: number;
  month: number;
  days: CalendarDay[];
  locale: string;
  onDayClick?: (day: CalendarDay) => void;
}

const WEEKDAY_NAMES_ZH = ['日', '一', '二', '三', '四', '五', '六'];
const WEEKDAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarGrid({
  year,
  month,
  days,
  locale,
  onDayClick,
}: CalendarGridProps) {
  const isZh = locale === 'zh';
  const weekdays = isZh ? WEEKDAY_NAMES_ZH : WEEKDAY_NAMES_EN;

  // 计算月份第一天是星期几（0=周日）
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  // 计算需要在前面填充的空格数量
  const emptySlots = firstDayOfWeek;

  // 生成日历格子
  const calendarCells: (CalendarDay | null)[] = [];

  // 前面的空格
  for (let i = 0; i < emptySlots; i++) {
    calendarCells.push(null);
  }

  // 实际日期
  for (const day of days) {
    calendarCells.push(day);
  }

  // 后面的空格（补齐到完整的周）
  const remainingCells = 7 - (calendarCells.length % 7);
  if (remainingCells < 7) {
    for (let i = 0; i < remainingCells; i++) {
      calendarCells.push(null);
    }
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full">
      {/* 星期头部 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day, i) => (
          <div
            key={i}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日历格子 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarCells.map((cell, i) => {
          if (!cell) {
            return (
              <div
                key={i}
                className="h-12 md:h-14 rounded-md bg-muted/20"
              />
            );
          }

          const dayNum = parseInt(cell.date.split('-')[2]);
          const isToday = cell.date === today;
          const hasWorkout = cell.hasWorkout;
          const multipleWorkouts = cell.workoutCount > 1;

          return (
            <button
              key={i}
              onClick={() => hasWorkout && onDayClick?.(cell)}
              disabled={!hasWorkout}
              className={cn(
                'h-12 md:h-14 rounded-md flex flex-col items-center justify-center transition-colors relative',
                isToday && 'ring-2 ring-primary ring-offset-1',
                hasWorkout
                  ? 'bg-primary/20 hover:bg-primary/30 cursor-pointer'
                  : 'bg-muted/30 hover:bg-muted/40',
                hasWorkout && multipleWorkouts && 'bg-primary/30',
              )}
            >
              <span
                className={cn(
                  'text-sm font-medium',
                  hasWorkout ? 'text-primary' : 'text-muted-foreground',
                  isToday && 'text-primary font-bold',
                )}
              >
                {dayNum}
              </span>

              {/* 训练指示点 */}
              {hasWorkout && (
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: Math.min(cell.workoutCount, 3) }).map((_, j) => (
                    <div
                      key={j}
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}