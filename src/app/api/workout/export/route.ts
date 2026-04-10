// 数据导出 API（Pro 会员功能）

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import type { D1Database } from '@/types/database';
import { getUserLimits } from '@/lib/membership';

export const runtime = 'edge';

interface ExportData {
  user: {
    email: string;
    name: string | null;
    membershipTier: string;
    exportedAt: string;
  };
  workoutLogs: Array<{
    id: string;
    startedAt: string;
    completedAt: string | null;
    durationSeconds: number | null;
    totalSets: number;
    totalReps: number;
    rating: number | null;
    exercises: unknown[];
    planId: string | null;
  }>;
  bodyMetrics: Array<{
    id: string;
    weight: number | null;
    bodyFat: number | null;
    recordedAt: string;
  }>;
  summary: {
    totalWorkouts: number;
    totalDurationHours: number;
    totalSets: number;
    totalReps: number;
    firstWorkoutDate: string | null;
    lastWorkoutDate: string | null;
  };
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
      .prepare('SELECT id, email, name, membership_tier FROM users WHERE email = ?')
      .bind(session.user.email)
      .first<{ id: string; email: string; name: string | null; membership_tier: string }>();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 检查用户是否有导出权限
    const limits = await getUserLimits(db, user.id);
    if (!limits.canExportData) {
      return NextResponse.json(
        { error: 'Export requires Pro membership', upgradeUrl: '/pricing' },
        { status: 403 }
      );
    }

    // 获取导出数据
    const exportData = await gatherExportData(db, user);

    // 根据请求参数决定格式
    const format = request.nextUrl.searchParams.get('format') || 'json';

    if (format === 'csv') {
      return exportAsCSV(exportData);
    }

    return exportAsJSON(exportData);
  } catch (error) {
    console.error('[Export] Error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}

async function gatherExportData(db: D1Database, user: { id: string; email: string; name: string | null; membership_tier: string }): Promise<ExportData> {
  // 获取训练记录
  const workoutLogsResult = await db
    .prepare(`
      SELECT 
        id, started_at, completed_at, duration_seconds, 
        total_sets, total_reps, rating, exercises_json, plan_id
      FROM workout_logs
      WHERE user_id = ?
      ORDER BY started_at DESC
    `)
    .bind(user.id)
    .all<{
      id: string;
      started_at: string;
      completed_at: string | null;
      duration_seconds: number | null;
      total_sets: number;
      total_reps: number;
      rating: number | null;
      exercises_json: string | null;
      plan_id: string | null;
    }>();

  const workoutLogs = workoutLogsResult.results.map(log => ({
    id: log.id,
    startedAt: log.started_at,
    completedAt: log.completed_at,
    durationSeconds: log.duration_seconds,
    totalSets: log.total_sets,
    totalReps: log.total_reps,
    rating: log.rating,
    exercises: log.exercises_json ? JSON.parse(log.exercises_json) : [],
    planId: log.plan_id,
  }));

  // 获取身体数据
  const bodyMetricsResult = await db
    .prepare(`
      SELECT id, weight, body_fat, recorded_at
      FROM body_metrics
      WHERE user_id = ?
      ORDER BY recorded_at DESC
    `)
    .bind(user.id)
    .all<{
      id: string;
      weight: number | null;
      body_fat: number | null;
      recorded_at: string;
    }>();

  const bodyMetrics = bodyMetricsResult.results.map(m => ({
    id: m.id,
    weight: m.weight,
    bodyFat: m.body_fat,
    recordedAt: m.recorded_at,
  }));

  // 计算汇总
  const totalDuration = workoutLogs.reduce((sum, log) => sum + (log.durationSeconds || 0), 0);
  const summary = {
    totalWorkouts: workoutLogs.length,
    totalDurationHours: Math.round(totalDuration / 3600),
    totalSets: workoutLogs.reduce((sum, log) => sum + log.totalSets, 0),
    totalReps: workoutLogs.reduce((sum, log) => sum + log.totalReps, 0),
    firstWorkoutDate: workoutLogs.length > 0 ? workoutLogs[workoutLogs.length - 1].startedAt : null,
    lastWorkoutDate: workoutLogs.length > 0 ? workoutLogs[0].startedAt : null,
  };

  return {
    user: {
      email: user.email,
      name: user.name,
      membershipTier: user.membership_tier,
      exportedAt: new Date().toISOString(),
    },
    workoutLogs,
    bodyMetrics,
    summary,
  };
}

function exportAsJSON(data: ExportData): NextResponse {
  const json = JSON.stringify(data, null, 2);

  return new NextResponse(json, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="fitplan-export-${new Date().toISOString().split('T')[0]}.json"`,
    },
  });
}

function exportAsCSV(data: ExportData): NextResponse {
  // CSV 格式：只导出训练记录
  const headers = ['Date', 'Duration(min)', 'Sets', 'Reps', 'Rating', 'Plan ID'];
  const rows = data.workoutLogs.map(log => [
    log.startedAt.split('T')[0],
    Math.round((log.durationSeconds || 0) / 60),
    log.totalSets,
    log.totalReps,
    log.rating || '',
    log.planId || '',
  ]);

  const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="fitplan-workouts-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}