import { NextResponse } from "next/server";
import { cabins } from "@/lib/data";

export async function GET() {
  const sorted = [...cabins].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return NextResponse.json(sorted);
}