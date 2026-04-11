// AI 智能训练计划生成 API

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import { generateWorkoutPlan, AIPlanInput } from '@/lib/ai';
import { getUserLimits } from '@/lib/membership';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // 获取数据库和API Key
  const { env } = getRequestContext();
  const db = env.DB as D1Database | undefined;
  const apiKey = env.WENWEN_AI_API_KEY || process.env.WENWEN_AI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI service not configured' },
      { status: 503 }
    );
  }

  if (!db) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  try {
    // 获取用户
    const user = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(session.user.email)
      .first<{ id: string }>();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 获取用户权限
    const limits = await getUserLimits(db, user.id);
    
    // Pro用户无限次，Free用户每天1次
    if (limits.aiGenerationsPerDay !== -1) {
      // 检查今日生成次数
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = await db
        .prepare(`SELECT COUNT(*) as count FROM ai_generation_logs WHERE user_id = ? AND date(created_at) = ?`)
        .bind(user.id, today)
        .first<{ count: number }>();

      const used = todayLogs?.count || 0;
      
      if (used >= limits.aiGenerationsPerDay) {
        return NextResponse.json(
          { 
            error: '今日AI生成次数已用完，升级会员可无限使用', 
            remaining: 0,
            upgradeUrl: '/pricing'
          },
          { status: 403 }
        );
      }
    }

    const body = await request.json() as AIPlanInput;

    // 验证必要参数
    if (!body.goal || !body.fitnessLevel || !body.availableDays || !body.sessionDuration) {
      return NextResponse.json(
        { error: 'Missing required parameters: goal, fitnessLevel, availableDays, sessionDuration' },
        { status: 400 }
      );
    }

    // 参数范围验证
    if (body.availableDays < 1 || body.availableDays > 7) {
      return NextResponse.json(
        { error: 'availableDays must be between 1 and 7' },
        { status: 400 }
      );
    }

    if (body.sessionDuration < 10 || body.sessionDuration > 180) {
      return NextResponse.json(
        { error: 'sessionDuration must be between 10 and 180 minutes' },
        { status: 400 }
      );
    }

    // 生成训练计划
    const plan = await generateWorkoutPlan(body);

    // 记录生成日志（免费用户需要统计）
    if (limits.aiGenerationsPerDay !== -1) {
      await db
        .prepare(`INSERT INTO ai_generation_logs (id, user_id, created_at) VALUES (?, ?, datetime('now'))`)
        .bind(crypto.randomUUID(), user.id)
        .run();
    }

    // 计算剩余次数
    const remaining = limits.aiGenerationsPerDay === -1 ? -1 : limits.aiGenerationsPerDay - 1;

    return NextResponse.json({
      success: true,
      plan,
      remaining,
    });

  } catch (error) {
    console.error('AI plan generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate plan' },
      { status: 500 }
    );
  }
}