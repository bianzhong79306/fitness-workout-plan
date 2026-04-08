import { NextResponse } from "next/server";
import { workoutPlans } from "@/data/workout-plans";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const goal = searchParams.get("goal");
  const difficulty = searchParams.get("difficulty");

  let filteredPlans = [...workoutPlans];

  if (goal) {
    filteredPlans = filteredPlans.filter((plan) => plan.goal === goal);
  }

  if (difficulty) {
    filteredPlans = filteredPlans.filter((plan) => plan.difficulty === difficulty);
  }

  return NextResponse.json({ plans: filteredPlans });
}