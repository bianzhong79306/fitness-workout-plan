import { NextResponse } from "next/server";
import { getPlanById } from "@/data/workout-plans";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const plan = getPlanById(id);

  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  return NextResponse.json({ plan });
}