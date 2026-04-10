// Challenge Join API - 参与/退出挑战

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

// POST: 参与挑战
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) {
  const { challengeId } = await params;
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

    const user = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(session.user.email)
      .first<{ id: string }>();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 检查挑战是否存在且有效
    const challenge = await db
      .prepare('SELECT id, goal_value, end_at, is_active FROM challenges WHERE id = ?')
      .bind(challengeId)
      .first<{ id: string; goal_value: number; end_at: string; is_active: number }>();

    if (!challenge || !challenge.is_active) {
      return NextResponse.json({ error: 'Challenge not found or inactive' }, { status: 404 });
    }

    // 检查挑战是否已过期
    if (new Date(challenge.end_at) < new Date()) {
      return NextResponse.json({ error: 'Challenge has ended' }, { status: 400 });
    }

    // 检查是否已参与
    const existing = await db
      .prepare('SELECT id FROM user_challenges WHERE user_id = ? AND challenge_id = ?')
      .bind(user.id, challengeId)
      .first();

    if (existing) {
      return NextResponse.json({ error: 'Already joined this challenge' }, { status: 400 });
    }

    // 创建参与记录
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db
      .prepare(`
        INSERT INTO user_challenges (id, user_id, challenge_id, status, current_progress, target_progress, joined_at)
        VALUES (?, ?, ?, 'active', 0, ?, ?)
      `)
      .bind(id, user.id, challengeId, challenge.goal_value, now)
      .run();

    // 更新参与人数
    await db
      .prepare('UPDATE challenges SET participants_count = participants_count + 1 WHERE id = ?')
      .bind(challengeId)
      .run();

    // 如果是社区挑战，添加到排行榜
    const challengeType = await db
      .prepare('SELECT challenge_type FROM challenges WHERE id = ?')
      .bind(challengeId)
      .first<{ challenge_type: string }>();

    if (challengeType?.challenge_type === 'community') {
      await db
        .prepare(`
          INSERT OR IGNORE INTO challenge_leaderboard (id, challenge_id, user_id, contribution, rank)
          VALUES (?, ?, ?, 0, 0)
        `)
        .bind(crypto.randomUUID(), challengeId, user.id)
        .run();
    }

    return NextResponse.json({
      success: true,
      userChallenge: {
        id,
        user_id: user.id,
        challenge_id: challengeId,
        status: 'active',
        current_progress: 0,
        target_progress: challenge.goal_value,
        joined_at: now,
      },
    });
  } catch (error) {
    console.error('[Challenge Join API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: 退出挑战
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) {
  const { challengeId } = await params;
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

    const user = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(session.user.email)
      .first<{ id: string }>();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 检查是否已参与
    const existing = await db
      .prepare('SELECT id, status FROM user_challenges WHERE user_id = ? AND challenge_id = ?')
      .bind(user.id, challengeId)
      .first<{ id: string; status: string }>();

    if (!existing) {
      return NextResponse.json({ error: 'Not joined this challenge' }, { status: 400 });
    }

    // 只能退出未完成的挑战
    if (existing.status === 'completed') {
      return NextResponse.json({ error: 'Cannot leave completed challenge' }, { status: 400 });
    }

    // 删除参与记录
    await db
      .prepare('DELETE FROM user_challenges WHERE id = ?')
      .bind(existing.id)
      .run();

    // 更新参与人数
    await db
      .prepare('UPDATE challenges SET participants_count = MAX(0, participants_count - 1) WHERE id = ?')
      .bind(challengeId)
      .run();

    // 从排行榜删除
    await db
      .prepare('DELETE FROM challenge_leaderboard WHERE challenge_id = ? AND user_id = ?')
      .bind(challengeId, user.id)
      .run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Challenge Leave API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}