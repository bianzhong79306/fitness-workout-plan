// Community Comments API - 评论功能

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string | null;
  user_avatar: string | null;
  content: string;
  parent_id: string | null;
  created_at: string;
}

// GET: 获取评论列表
export async function GET(request: NextRequest) {
  const session = await auth();

  try {
    const { env } = getRequestContext();
    const db = env.DB as D1Database | undefined;

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('post_id');

    if (!postId) {
      return NextResponse.json({ error: 'post_id is required' }, { status: 400 });
    }

    const result = await db
      .prepare(`
        SELECT
          c.id, c.post_id, c.user_id, c.content, c.parent_id, c.created_at,
          u.name as user_name, u.avatar_url as user_avatar
        FROM community_comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.created_at ASC
      `)
      .bind(postId)
      .all<Comment>();

    return NextResponse.json({ comments: result.results });
  } catch (error) {
    console.error('[Community Comments API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: 创建评论
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

    const body = await request.json() as {
      post_id: string;
      content: string;
      parent_id?: string;
    };

    if (!body.post_id || !body.content || body.content.trim().length === 0) {
      return NextResponse.json({ error: 'post_id and content are required' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db
      .prepare(`
        INSERT INTO community_comments (id, post_id, user_id, content, parent_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        body.post_id,
        user.id,
        body.content.trim(),
        body.parent_id || null,
        now
      )
      .run();

    // 更新评论计数
    await db
      .prepare('UPDATE community_posts SET comments_count = comments_count + 1 WHERE id = ?')
      .bind(body.post_id)
      .run();

    return NextResponse.json({
      success: true,
      comment: {
        id,
        post_id: body.post_id,
        user_id: user.id,
        user_name: session.user.name || null,
        user_avatar: session.user.image || null,
        content: body.content.trim(),
        parent_id: body.parent_id || null,
        created_at: now,
      },
    });
  } catch (error) {
    console.error('[Community Comments API] Create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: 删除评论
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');

    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    // 验证是自己的评论
    const comment = await db
      .prepare('SELECT user_id, post_id FROM community_comments WHERE id = ?')
      .bind(commentId)
      .first<{ user_id: string; post_id: string }>();

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    if (comment.user_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized to delete this comment' }, { status: 403 });
    }

    await db.prepare('DELETE FROM community_comments WHERE id = ?').bind(commentId).run();

    // 更新评论计数
    await db
      .prepare('UPDATE community_posts SET comments_count = comments_count - 1 WHERE id = ?')
      .bind(comment.post_id)
      .run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Community Comments API] Delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}