// Exercise Progress API - 力量进步记录

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

interface ExerciseProgress {
  id: string;
  exercise_id: string;
  weight: number | null;
  reps: number | null;
  sets: number | null;
  one_rep_max: number | null;
  notes: string | null;
  recorded_at: string;
}

interface ProgressSummary {
  exercise_id: string;
  max_weight: number;
  max_one_rep_max: number;
  total_records: number;
  latest_record: ExerciseProgress | null;
  progress_history: ExerciseProgress[];
}

// GET: 获取力量进步记录
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get('exercise_id');
    const days = parseInt(searchParams.get('days') || '90');

    // 计算日期范围
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    if (exerciseId) {
      // 获取特定动作的进步记录
      const records = await db
        .prepare(`
          SELECT id, exercise_id, weight, reps, sets, one_rep_max, notes, recorded_at
          FROM exercise_progress
          WHERE user_id = ? AND exercise_id = ?
          AND recorded_at >= ?
          ORDER BY recorded_at DESC
        `)
        .bind(user.id, exerciseId, startDate.toISOString())
        .all<ExerciseProgress>();

      // 计算该动作的统计摘要
      const summary = await db
        .prepare(`
          SELECT
            MAX(weight) as max_weight,
            MAX(one_rep_max) as max_one_rep_max,
            COUNT(*) as total_records
          FROM exercise_progress
          WHERE user_id = ? AND exercise_id = ?
        `)
        .bind(user.id, exerciseId)
        .first<{ max_weight: number | null; max_one_rep_max: number | null; total_records: number }>();

      return NextResponse.json({
        exercise_id: exerciseId,
        max_weight: summary?.max_weight || 0,
        max_one_rep_max: summary?.max_one_rep_max || 0,
        total_records: summary?.total_records || 0,
        latest_record: records.results[0] || null,
        progress_history: records.results,
      });
    } else {
      // 获取所有动作的进步摘要
      const allRecords = await db
        .prepare(`
          SELECT id, exercise_id, weight, reps, sets, one_rep_max, notes, recorded_at
          FROM exercise_progress
          WHERE user_id = ?
          AND recorded_at >= ?
          ORDER BY recorded_at DESC
        `)
        .bind(user.id, startDate.toISOString())
        .all<ExerciseProgress>();

      // 按动作分组
      const exerciseMap = new Map<string, ExerciseProgress[]>();
      for (const record of allRecords.results) {
        if (!exerciseMap.has(record.exercise_id)) {
          exerciseMap.set(record.exercise_id, []);
        }
        exerciseMap.get(record.exercise_id)!.push(record);
      }

      // 构建摘要列表
      const summaries: ProgressSummary[] = [];
      for (const [exId, records] of exerciseMap) {
        const maxWeight = Math.max(...records.map(r => r.weight || 0));
        const maxOrm = Math.max(...records.map(r => r.one_rep_max || 0));
        summaries.push({
          exercise_id: exId,
          max_weight: maxWeight,
          max_one_rep_max: maxOrm,
          total_records: records.length,
          latest_record: records[0],
          progress_history: records,
        });
      }

      return NextResponse.json({
        total_exercises: summaries.length,
        summaries,
      });
    }
  } catch (error) {
    console.error('[Exercise Progress API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: 记录力量进步
export async function POST(request: NextRequest) {
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json() as {
      exercise_id: string;
      weight?: number;
      reps?: number;
      sets?: number;
      notes?: string;
    };

    if (!body.exercise_id) {
      return NextResponse.json({ error: 'exercise_id is required' }, { status: 400 });
    }

    // 计算 One Rep Max (使用 Brzycki 公式)
    let oneRepMax: number | null = null;
    if (body.weight && body.reps && body.reps > 0) {
      // Brzycki 公式: 1RM = weight × (36 / (37 - reps))
      oneRepMax = Math.round(body.weight * (36 / (37 - body.reps)) * 100) / 100;
    }

    // 生成唯一 ID
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db
      .prepare(`
        INSERT INTO exercise_progress (id, user_id, exercise_id, weight, reps, sets, one_rep_max, notes, recorded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        user.id,
        body.exercise_id,
        body.weight || null,
        body.reps || null,
        body.sets || null,
        oneRepMax,
        body.notes || null,
        now
      )
      .run();

    return NextResponse.json({
      success: true,
      id,
      one_rep_max: oneRepMax,
      recorded_at: now,
    });
  } catch (error) {
    console.error('[Exercise Progress API] Create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: 删除记录
export async function DELETE(request: NextRequest) {
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

    const user = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(session.user.email)
      .first<{ id: string }>();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    await db
      .prepare('DELETE FROM exercise_progress WHERE id = ? AND user_id = ?')
      .bind(id, user.id)
      .run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Exercise Progress API] Delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}