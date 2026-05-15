import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const cabins = await db.cabin.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(cabins);
}

export const runtime = 'edge';

export const runtime = 'edge';
