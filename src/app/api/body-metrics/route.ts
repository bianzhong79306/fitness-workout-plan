// 身体数据 API
// GET: 获取用户的身体数据记录
// POST: 保存新的身体数据记录

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

interface BodyMetric {
  id: string;
  weight: number | null;
  body_fat: number | null;
  height: number | null;
  chest: number | null;
  waist: number | null;
  hip: number | null;
  arm: number | null;
  thigh: number | null;
  recorded_at: string;
}

interface BodyMetricsResponse {
  metrics: BodyMetric[];
  latest: BodyMetric | null;
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
      return NextResponse.json({ metrics: [], latest: null });
    }

    // 获取日期范围参数（默认最近30天）
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // 查询身体数据
    const result = await db
      .prepare(`
        SELECT id, weight, body_fat, height, chest, waist, hip, arm, thigh, recorded_at
        FROM body_metrics
        WHERE user_id = ? AND recorded_at >= ?
        ORDER BY recorded_at DESC
        LIMIT 100
      `)
      .bind(user.id, startDate.toISOString())
      .all<BodyMetric>();

    const metrics = result.results || [];
    const latest = metrics.length > 0 ? metrics[0] : null;

    return NextResponse.json({ metrics, latest });
  } catch (error) {
    console.error('[Body Metrics API] Error:', error);
    return NextResponse.json({ metrics: [], latest: null });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json() as {
      weight?: number;
      bodyFat?: number;
      height?: number;
      chest?: number;
      waist?: number;
      hip?: number;
      arm?: number;
      thigh?: number;
    };

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

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db
      .prepare(`
        INSERT INTO body_metrics
        (id, user_id, weight, body_fat, height, chest, waist, hip, arm, thigh, recorded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        user.id,
        body.weight ?? null,
        body.bodyFat ?? null,
        body.height ?? null,
        body.chest ?? null,
        body.waist ?? null,
        body.hip ?? null,
        body.arm ?? null,
        body.thigh ?? null,
        now
      )
      .run();

    return NextResponse.json({ success: true, id, recordedAt: now });
  } catch (error) {
    console.error('[Body Metrics API] Create error:', error);
    return NextResponse.json(
      { error: 'Failed to save body metrics' },
      { status: 500 }
    );
  }
}