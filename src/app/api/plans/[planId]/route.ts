// 获取计划详情 API

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(request: NextRequest, { params }: { params: Promise<{ planId: string }> }) {
  const { env } = getRequestContext();
  const db = env.DB;
  
  const { planId } = await params;
  
  try {
    const plan = await db.prepare('SELECT * FROM workout_plans WHERE id = ?').bind(planId).first();
    if (!plan) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    const sessions = await db.prepare('SELECT * FROM workout_sessions WHERE plan_id = ? ORDER BY session_number')
      .bind(planId).all();
    
    return NextResponse.json({ plan: { ...plan, sessions: sessions.results||[] } });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}