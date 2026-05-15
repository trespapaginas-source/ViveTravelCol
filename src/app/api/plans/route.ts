import { NextResponse } from "next/server";
import { tourPlans } from "@/lib/data";

export async function GET() {
  return NextResponse.json(tourPlans);
}