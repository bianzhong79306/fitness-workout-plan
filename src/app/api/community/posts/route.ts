// Community Posts API - 社区动态

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { auth } from '@/auth';
import type { D1Database } from '@/types/database';

export const runtime = 'edge';

interface Post {
  id: string;
  user_id: string;
  user_name: string | null;
  user_avatar: string | null;
  content: string;
  post_type: string;
  workout_id: string | null;
  plan_id: string | null;
  workout_duration: number | null;
  workout_sets: number | null;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at: string;
}

interface PostWithUser {
  id: string;
  user_id: string;
  content: string;
  post_type: string;
  workout_id: string | null;
  plan_id: string | null;
  workout_duration: number | null;
  workout_sets: number | null;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  is_public: number;
  created_at: string;
  user_name: string | null;
  user_avatar: string | null;
}

// GET: 获取动态列表
export async function GET(request: NextRequest) {
  const session = await auth();
  const currentUserId = session?.user?.email ? await getUserId(session.user.email) : null;

  try {
    const { env } = getRequestContext();
    const db = env.DB as D1Database | undefined;

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const postType = searchParams.get('type');
    const userId = searchParams.get('user_id');

    const offset = (page - 1) * limit;

    // 构建查询
    let query = `
      SELECT
        p.id, p.user_id, p.content, p.post_type, p.workout_id, p.plan_id,
        p.workout_duration, p.workout_sets, p.image_url,
        p.likes_count, p.comments_count, p.is_public, p.created_at,
        u.name as user_name, u.avatar_url as user_avatar
      FROM community_posts p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.is_public = 1
    `;

    const params: string[] = [];

    if (postType) {
      query += ' AND p.post_type = ?';
      params.push(postType);
    }

    if (userId) {
      query += ' AND p.user_id = ?';
      params.push(userId);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(String(limit), String(offset));

    const result = await db
      .prepare(query)
      .bind(...params)
      .all<PostWithUser>();

    // 获取用户点赞状态
    const posts: Post[] = await Promise.all(
      result.results.map(async (post) => {
        let isLiked = false;
        if (currentUserId) {
          const like = await db
            .prepare('SELECT id FROM community_likes WHERE post_id = ? AND user_id = ?')
            .bind(post.id, currentUserId)
            .first();
          isLiked = !!like;
        }

        return {
          id: post.id,
          user_id: post.user_id,
          user_name: post.user_name,
          user_avatar: post.user_avatar,
          content: post.content,
          post_type: post.post_type,
          workout_id: post.workout_id,
          plan_id: post.plan_id,
          workout_duration: post.workout_duration,
          workout_sets: post.workout_sets,
          image_url: post.image_url,
          likes_count: post.likes_count,
          comments_count: post.comments_count,
          is_liked: isLiked,
          created_at: post.created_at,
        };
      })
    );

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM community_posts WHERE is_public = 1';
    const countParams: string[] = [];
    if (postType) {
      countQuery += ' AND post_type = ?';
      countParams.push(postType);
    }
    if (userId) {
      countQuery += ' AND user_id = ?';
      countParams.push(userId);
    }

    const countResult = await db
      .prepare(countQuery)
      .bind(...countParams)
      .first<{ total: number }>();

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / limit),
      },
    });
  } catch (error) {
    console.error('[Community Posts API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: 创建新动态
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

    // 获取用户ID
    const user = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(session.user.email)
      .first<{ id: string }>();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json() as {
      content: string;
      post_type?: string;
      workout_id?: string;
      plan_id?: string;
      workout_duration?: number;
      workout_sets?: number;
      image_url?: string;
    };

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db
      .prepare(`
        INSERT INTO community_posts (
          id, user_id, content, post_type, workout_id, plan_id,
          workout_duration, workout_sets, image_url, likes_count, comments_count, is_public, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 1, ?)
      `)
      .bind(
        id,
        user.id,
        body.content.trim(),
        body.post_type || 'general',
        body.workout_id || null,
        body.plan_id || null,
        body.workout_duration || null,
        body.workout_sets || null,
        body.image_url || null,
        now
      )
      .run();

    return NextResponse.json({
      success: true,
      post: {
        id,
        user_id: user.id,
        user_name: session.user.name || null,
        user_avatar: session.user.image || null,
        content: body.content.trim(),
        post_type: body.post_type || 'general',
        likes_count: 0,
        comments_count: 0,
        is_liked: false,
        created_at: now,
      },
    });
  } catch (error) {
    console.error('[Community Posts API] Create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: 删除动态
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
    const postId = searchParams.get('id');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // 验证是自己的动态
    const post = await db
      .prepare('SELECT user_id FROM community_posts WHERE id = ?')
      .bind(postId)
      .first<{ user_id: string }>();

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.user_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized to delete this post' }, { status: 403 });
    }

    // 删除相关数据
    await db.prepare('DELETE FROM community_likes WHERE post_id = ?').bind(postId).run();
    await db.prepare('DELETE FROM community_comments WHERE post_id = ?').bind(postId).run();
    await db.prepare('DELETE FROM community_posts WHERE id = ?').bind(postId).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Community Posts API] Delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 辅助函数：获取用户ID
async function getUserId(email: string): Promise<string | null> {
  try {
    const { env } = getRequestContext();
    const db = env.DB as D1Database | undefined;
    if (!db) return null;

    const user = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(email)
      .first<{ id: string }>();

    return user?.id || null;
  } catch {
    return null;
  }
}