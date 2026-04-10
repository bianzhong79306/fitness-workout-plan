// Community Likes API - 点赞功能

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

// POST: 点赞/取消点赞
export async function POST(request: NextRequest) {
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

    const body = await request.json() as { post_id: string };

    if (!body.post_id) {
      return NextResponse.json({ error: 'post_id is required' }, { status: 400 });
    }

    // 检查是否已点赞
    const existingLike = await db
      .prepare('SELECT id FROM community_likes WHERE post_id = ? AND user_id = ?')
      .bind(body.post_id, user.id)
      .first<{ id: string }>();

    if (existingLike) {
      // 取消点赞
      await db.prepare('DELETE FROM community_likes WHERE id = ?').bind(existingLike.id).run();
      await db
        .prepare('UPDATE community_posts SET likes_count = likes_count - 1 WHERE id = ?')
        .bind(body.post_id)
        .run();

      return NextResponse.json({ liked: false, message: 'Unliked' });
    } else {
      // 添加点赞
      const id = crypto.randomUUID();
      await db
        .prepare('INSERT INTO community_likes (id, post_id, user_id, created_at) VALUES (?, ?, ?, ?)')
        .bind(id, body.post_id, user.id, new Date().toISOString())
        .run();
      await db
        .prepare('UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = ?')
        .bind(body.post_id)
        .run();

      return NextResponse.json({ liked: true, message: 'Liked' });
    }
  } catch (error) {
    console.error('[Community Likes API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}