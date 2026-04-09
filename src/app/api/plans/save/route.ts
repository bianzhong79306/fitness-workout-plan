// 保存训练计划 API - 暂时简化版

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export const runtime = 'edge';

interface Env {
  DB: D1Database;
}

export async function POST(request: NextRequest) {
  const env = process.env as unknown as Env;
  
  // 检查登录状态
  const session = await auth();
  const userId = session?.user?.id || 'guest-user';
  
  try {
    const plan = await request.json() as {
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
        exercises?: Array<{ name: string; nameEn: string; sets: number; reps: string; restSeconds: number }>;
      }>;
    };
    
    const planId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    // 保存计划主表（允许 guest 用户）
    await env.DB.prepare(`
      INSERT INTO workout_plans (id, creator_id, name, name_en, description, description_en,
        goal, difficulty, duration_weeks, sessions_per_week, equipment, is_premium, is_published, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, ?)
    `).bind(
      planId, userId,
      plan.name || 'AI Plan', plan.nameEn || 'AI Plan',
      plan.description || '', plan.descriptionEn || '',
      plan.goal || 'general', plan.difficulty || 'beginner',
      plan.durationWeeks || 4, plan.sessionsPerWeek || 3,
      (plan.equipment || []).join(','), now
    ).run();
    
    // 保存训练课程
    for (const s of (plan.sessions || [])) {
      const sessionId = crypto.randomUUID();
      await env.DB.prepare(`
        INSERT INTO workout_sessions (id, plan_id, session_number, name, name_en, duration_minutes, exercises_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(sessionId, planId, s.sessionNumber || 1, s.name || 'Session', s.nameEn || 'Session',
        s.durationMinutes || 45, JSON.stringify(s.exercises || []), now).run();
    }
    
    return NextResponse.json({ success: true, planId });
    
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}