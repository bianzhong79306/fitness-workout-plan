// 获取计划详情 API

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { workoutPlans } from '@/data/workout-plans';
import { getExerciseById } from '@/data/exercises';

export const runtime = 'edge';

// 将静态数据转换为 API 返回格式
function convertStaticPlanToApiFormat(plan: typeof workoutPlans[0]) {
  return {
    id: plan.id,
    name: plan.name,
    name_en: plan.nameEn,
    description: plan.description,
    description_en: plan.descriptionEn,
    goal: plan.goal,
    difficulty: plan.difficulty,
    duration_weeks: plan.durationWeeks,
    sessions_per_week: plan.sessionsPerWeek,
    equipment: plan.equipment?.join(',') || '',
    is_premium: plan.isPremium ? 1 : 0,
    is_published: plan.isPublished ? 1 : 0,
    image_url: plan.imageUrl || null,
    created_at: plan.createdAt,
    sessions: plan.sessions.map(session => ({
      id: session.id,
      plan_id: session.planId,
      session_number: session.sessionNumber,
      name: session.name,
      name_en: session.nameEn,
      duration_minutes: session.durationMinutes,
      exercises_json: JSON.stringify(session.exercises.map(ex => {
        const exercise = getExerciseById(ex.exerciseId);
        return {
          exerciseId: ex.exerciseId,
          name: exercise?.name || '',
          nameEn: exercise?.nameEn || '',
          sets: ex.sets,
          reps: ex.reps,
          duration: ex.duration,
          restSeconds: ex.restSeconds,
          weight: ex.weight,
        };
      })),
    })),
  };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params;

  // 先尝试从静态数据获取（作为 fallback）
  const staticPlan = workoutPlans.find(p => p.id === planId);

  // 尝试从数据库获取
  try {
    const { env } = getRequestContext();
    const db = env.DB;

    const plan = await db.prepare('SELECT * FROM workout_plans WHERE id = ?').bind(planId).first();

    if (plan) {
      const sessions = await db.prepare('SELECT * FROM workout_sessions WHERE plan_id = ? ORDER BY session_number')
        .bind(planId).all();

      return NextResponse.json({ plan: { ...plan, sessions: sessions.results || [] } });
    }
  } catch (e) {
    // 数据库查询失败，继续使用静态数据
    console.error('Database query failed:', e);
  }

  // Fallback 到静态数据
  if (staticPlan) {
    return NextResponse.json({ plan: convertStaticPlanToApiFormat(staticPlan) });
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}