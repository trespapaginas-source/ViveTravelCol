import { NextRequest, NextResponse } from "next/server";
import { cabins } from "@/lib/data";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cabin = cabins.find((c) => c.id === id || c.slug === id);
  if (!cabin) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(cabin);
}