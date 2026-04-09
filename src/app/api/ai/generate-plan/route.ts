// AI 智能训练计划生成 API

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generateWorkoutPlan, AIPlanInput } from '@/lib/ai';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // 获取环境变量
  const env = process.env as unknown as { DB?: D1Database; WENWEN_AI_API_KEY?: string };

  // 检查 API Key 配置
  const apiKey = env.WENWEN_AI_API_KEY || process.env.WENWEN_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI service not configured. Please set WENWEN_AI_API_KEY environment variable.' },
      { status: 503 }
    );
  }

  try {
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

    return NextResponse.json({
      success: true,
      plan,
    });

  } catch (error) {
    console.error('AI plan generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate plan' },
      { status: 500 }
    );
  }
}