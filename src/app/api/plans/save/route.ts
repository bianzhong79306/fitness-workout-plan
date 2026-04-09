// 保存训练计划 API

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export const runtime = 'edge';

interface Env {
  DB: D1Database;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const env = process.env as unknown as Env;
  
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
        exercises?: Array<{
          name: string;
          nameEn: string;
          sets: number;
          reps: string;
          restSeconds: number;
        }>;
      }>;
    };
    
    // 生成计划 ID
    const planId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    // 先保存计划主表
    await env.DB
      .prepare(`
        INSERT INTO workout_plans (
          id, creator_id, name, name_en, description, description_en,
          goal, difficulty, duration_weeks, sessions_per_week,
          equipment, is_premium, is_published, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)
      `)
      .bind(
        planId,
        session.user.id,
        plan.name || 'AI Generated Plan',
        plan.nameEn || 'AI Generated Plan',
        plan.description || '',
        plan.descriptionEn || '',
        plan.goal || 'general',
        plan.difficulty || 'beginner',
        plan.durationWeeks || 4,
        plan.sessionsPerWeek || 3,
        (plan.equipment || []).join(','),
        now
      )
      .run();
    
    // 保存每个训练课程
    for (const session of (plan.sessions || [])) {
      const sessionId = crypto.randomUUID();
      
      await env.DB
        .prepare(`
          INSERT INTO workout_sessions (
            id, plan_id, session_number, name, name_en, duration_minutes, exercises_json, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          sessionId,
          planId,
          session.sessionNumber || 1,
          session.name || 'Session',
          session.nameEn || 'Session',
          session.durationMinutes || 45,
          JSON.stringify(session.exercises || []),
          now
        )
        .run();
    }
    
    // 创建用户订阅关系
    const subscriptionId = crypto.randomUUID();
    await env.DB
      .prepare(`
        INSERT INTO user_plan_subscriptions (
          id, user_id, plan_id, started_at, current_week, completed_sessions, is_active
        ) VALUES (?, ?, ?, ?, 1, 0, 1)
      `)
      .bind(subscriptionId, session.user.id, planId, now)
      .run();
    
    return NextResponse.json({ 
      success: true, 
      planId,
      message: 'Plan saved successfully'
    });
    
  } catch (error) {
    console.error('Save plan error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save plan' },
      { status: 500 }
    );
  }
}