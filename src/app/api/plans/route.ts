import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const plans = await db.tourPlan.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(plans);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const plan = await db.tourPlan.create({
    data: {
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      shortDescription: body.shortDescription || "",
      fullDescription: body.fullDescription || "",
      images: JSON.stringify(body.images || []),
      price: body.price || 0,
      priceRange: body.priceRange || "",
      duration: body.duration || "",
      location: body.location || "",
      category: body.category || "Naturaleza",
      includes: JSON.stringify(body.includes || []),
      excludes: JSON.stringify(body.excludes || []),
      highlights: JSON.stringify(body.highlights || []),
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0,
      maxGuests: body.maxGuests || 1,
      difficulty: body.difficulty || "Fácil",
      schedule: body.schedule || "",
      meeting: body.meeting || "",
      published: body.published ?? true,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json(plan, { status: 201 });
}
