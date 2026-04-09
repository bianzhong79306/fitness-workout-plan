// 获取计划详情 API

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface Env {
  DB: D1Database;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params;
  const env = process.env as unknown as Env;
  
  try {
    const plan = await env.DB.prepare('SELECT * FROM workout_plans WHERE id = ?').bind(planId).first();
    
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }
    
    const sessions = await env.DB.prepare('SELECT * FROM workout_sessions WHERE plan_id = ? ORDER BY session_number')
      .bind(planId).all();
    
    return NextResponse.json({ 
      plan: {
        ...plan,
        sessions: sessions.results || []
      }
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
  }
}