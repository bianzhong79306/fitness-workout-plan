// 用户设置 API
// GET: 获取用户设置
// PATCH: 更新用户设置

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

interface UserSettings {
  weeklyWorkoutGoal: number;
}

export async function GET() {
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

    // 获取用户设置
    const user = await db
      .prepare('SELECT weekly_workout_goal FROM users WHERE email = ?')
      .bind(session.user.email)
      .first<{ weekly_workout_goal: number | null }>();

    return NextResponse.json({
      weeklyWorkoutGoal: user?.weekly_workout_goal ?? 3,
    });
  } catch (error) {
    console.error('[User Settings API] Error:', error);
    return NextResponse.json({ weeklyWorkoutGoal: 3 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json() as { weeklyWorkoutGoal?: number };

    // 验证周目标范围 (1-7)
    const weeklyGoal = body.weeklyWorkoutGoal;
    if (weeklyGoal !== undefined && (weeklyGoal < 1 || weeklyGoal > 7)) {
      return NextResponse.json(
        { error: 'Weekly goal must be between 1 and 7' },
        { status: 400 }
      );
    }

    const { env } = getRequestContext();
    const db = env.DB as D1Database | undefined;

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // 更新用户设置
    if (weeklyGoal !== undefined) {
      await db
        .prepare('UPDATE users SET weekly_workout_goal = ? WHERE email = ?')
        .bind(weeklyGoal, session.user.email)
        .run();
    }

    return NextResponse.json({ success: true, weeklyWorkoutGoal: weeklyGoal });
  } catch (error) {
    console.error('[User Settings API] Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}