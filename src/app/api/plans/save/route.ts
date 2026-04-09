// 保存训练计划 API

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

interface SavePlanInput {
  name?: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  goal?: string;
  difficulty?: string;
  durationWeeks?: number;
  sessionsPerWeek?: number;
  equipment?: string[];
  sessions?: Array<{
    sessionNumber?: number;
    name?: string;
    nameEn?: string;
    durationMinutes?: number;
    exercises?: Array<{
      name: string;
      nameEn: string;
      sets: number;
      reps: string;
      restSeconds: number;
    }>;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    // 尝试获取 Cloudflare 绑定
    const { env } = getRequestContext();
    const db = env.DB as D1Database | undefined;

    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const plan = await request.json() as SavePlanInput;

    // 参数验证
    if (!plan.name && !plan.nameEn) {
      return NextResponse.json(
        { error: 'Plan name is required' },
        { status: 400 }
      );
    }

    const planId = crypto.randomUUID();
    const now = new Date().toISOString();

    // 保存计划主表
    await db.prepare(`
      INSERT INTO workout_plans (id, creator_id, name, name_en, description, description_en,
        goal, difficulty, duration_weeks, sessions_per_week, equipment, is_premium, is_published, created_at)
      VALUES (?, 'guest', ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, ?)
    `).bind(
      planId,
      plan.name || 'Plan',
      plan.nameEn || 'Plan',
      plan.description || '',
      plan.descriptionEn || '',
      plan.goal || 'general',
      plan.difficulty || 'beginner',
      plan.durationWeeks || 4,
      plan.sessionsPerWeek || 3,
      (plan.equipment || []).join(','),
      now
    ).run();

    // 保存训练课程
    for (const s of (plan.sessions || [])) {
      const sessionId = crypto.randomUUID();
      await db.prepare(`
        INSERT INTO workout_sessions (id, plan_id, session_number, name, name_en, duration_minutes, exercises_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        sessionId,
        planId,
        s.sessionNumber || 1,
        s.name || 'Session',
        s.nameEn || 'Session',
        s.durationMinutes || 45,
        JSON.stringify(s.exercises || []),
        now
      ).run();
    }

    return NextResponse.json({ success: true, planId });
  } catch (error) {
    console.error('Save plan error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save plan' },
      { status: 500 }
    );
  }
}