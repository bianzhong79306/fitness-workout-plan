import { auth, syncUserToD1 } from "@/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const ctx = getRequestContext();
    const db = (ctx.env as any).DB as D1Database;

    const user = await syncUserToD1(db, {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("User sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
}