import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const plans = await db.tourPlan.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(plans);
}export const runtime = 'edge';