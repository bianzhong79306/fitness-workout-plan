import { auth } from "@/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const ctx = getRequestContext();
    const db = (ctx.env as any).DB as D1Database;

    // 获取用户
    const user = await db
      .prepare("SELECT id FROM users WHERE email = ?")
      .bind(session.user.email)
      .first();

    if (!user) {
      return NextResponse.json({ logs: [] });
    }

    // 获取训练记录
    const result = await db
      .prepare(
        "SELECT * FROM workout_logs WHERE user_id = ? ORDER BY started_at DESC LIMIT 30"
      )
      .bind(user.id)
      .all();

    return NextResponse.json({ logs: result.results });
  } catch (error) {
    console.error("Get workout logs error:", error);
    return NextResponse.json({ logs: [] });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json() as {
      sessionId?: string;
      planId?: string;
      startedAt?: string;
      completedAt?: string;
      durationSeconds?: number;
      exercises?: unknown[];
      totalSets?: number;
      totalReps?: number;
      rating?: number;
    };
    const ctx = getRequestContext();
    const db = (ctx.env as any).DB as D1Database;

    // 获取用户
    const user = await db
      .prepare("SELECT id FROM users WHERE email = ?")
      .bind(session.user.email)
      .first();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db
      .prepare(
        `INSERT INTO workout_logs
        (id, user_id, session_id, plan_id, started_at, completed_at, duration_seconds, exercises_json, total_sets, total_reps, rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        user.id,
        body.sessionId || null,
        body.planId || null,
        body.startedAt || now,
        body.completedAt || now,
        body.durationSeconds || 0,
        JSON.stringify(body.exercises || []),
        body.totalSets || 0,
        body.totalReps || 0,
        body.rating || null
      )
      .run();

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Create workout log error:", error);
    return NextResponse.json(
      { error: "Failed to create workout log" },
      { status: 500 }
    );
  }
}