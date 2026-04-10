// Calendar API - 获取月份训练数据

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

interface CalendarDay {
  date: string;
  hasWorkout: boolean;
  workoutCount: number;
  workouts: Array<{
    id: string;
    plan_name: string | null;
    duration_seconds: number | null;
    total_sets: number | null;
    rating: number | null;
  }>;
}

interface MonthData {
  year: number;
  month: number;
  days: CalendarDay[];
}

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { env } = getRequestContext();
    const db = env.DB as D1Database | undefined;

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // 获取用户
    const user = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(session.user.email)
      .first<{ id: string }>();

    if (!user) {
      return NextResponse.json({ days: [] });
    }

    // 从 URL 参数获取年月
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());

    // 计算月份开始和结束日期
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);
    const monthEndStr = monthEnd.toISOString().split('T')[0];
    const monthStartStr = monthStart.toISOString().split('T')[0];

    // 获取该月所有训练记录
    const workouts = await db
      .prepare(`
        SELECT
          wl.id,
          wl.started_at,
          wl.duration_seconds,
          wl.total_sets,
          wl.rating,
          wl.plan_id,
          wp.name as plan_name,
          wp.name_en as plan_name_en
        FROM workout_logs wl
        LEFT JOIN workout_plans wp ON wl.plan_id = wp.id
        WHERE wl.user_id = ?
        AND wl.completed_at IS NOT NULL
        AND date(wl.started_at) >= ?
        AND date(wl.started_at) <= ?
        ORDER BY wl.started_at
      `)
      .bind(user.id, monthStartStr, monthEndStr)
      .all<{
        id: string;
        started_at: string;
        duration_seconds: number | null;
        total_sets: number | null;
        rating: number | null;
        plan_id: string | null;
        plan_name: string | null;
        plan_name_en: string | null;
      }>();

    // 按日期分组
    const workoutsByDate: Record<string, CalendarDay['workouts']> = {};
    for (const w of workouts.results) {
      const dateKey = new Date(w.started_at).toISOString().split('T')[0];
      if (!workoutsByDate[dateKey]) {
        workoutsByDate[dateKey] = [];
      }
      workoutsByDate[dateKey].push({
        id: w.id,
        plan_name: w.plan_name || w.plan_name_en,
        duration_seconds: w.duration_seconds,
        total_sets: w.total_sets,
        rating: w.rating,
      });
    }

    // 构建该月每一天的数据
    const days: CalendarDay[] = [];
    const daysInMonth = monthEnd.getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayWorkouts = workoutsByDate[dateStr] || [];

      days.push({
        date: dateStr,
        hasWorkout: dayWorkouts.length > 0,
        workoutCount: dayWorkouts.length,
        workouts: dayWorkouts,
      });
    }

    return NextResponse.json({
      year,
      month,
      days,
    });
  } catch (error) {
    console.error('[Calendar API] Error:', error);
    return NextResponse.json({ days: [] });
  }
}