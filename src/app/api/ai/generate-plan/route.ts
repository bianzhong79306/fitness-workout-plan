// AI 智能训练计划生成 API

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generateWorkoutPlan, AIPlanInput } from '@/lib/ai';
import { canGenerateAIPlan } from '@/lib/membership';

export const runtime = 'edge';

interface Env {
  DB: D1Database;
  WENWEN_AI_API_KEY: string;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const env = process.env as unknown as Env;
  
  // 检查 API Key 配置
  if (!env.WENWEN_AI_API_KEY) {
    // 使用硬编码的 API Key（开发阶段）
    process.env.WENWEN_AI_API_KEY = 'sk-RLG8Lo3Rt9pExSt6E4pXtUEYc7uHVJdlFFElCNlKBbCDULyD';
  }
  
  try {
    const body = await request.json() as AIPlanInput;
    
    // 验证必要参数
    if (!body.goal || !body.fitnessLevel || !body.availableDays || !body.sessionDuration) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // 检查会员权限（暂时跳过，等会员系统完全集成）
    // const permission = await canGenerateAIPlan(env.DB, session.user.id, 0);
    // if (!permission.allowed) {
    //   return NextResponse.json({ error: permission.reason }, { status: 403 });
    // }
    
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