import { NextRequest, NextResponse } from "next/server";
import { tourPlans } from "@/lib/data";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = tourPlans.find((p) => p.id === id || p.slug === id);
  if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(plan);
}