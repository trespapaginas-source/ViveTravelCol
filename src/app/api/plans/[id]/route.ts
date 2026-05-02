import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = await db.tourPlan.findUnique({ where: { id } });
  if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(plan);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const plan = await db.tourPlan.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.shortDescription !== undefined && { shortDescription: body.shortDescription }),
      ...(body.fullDescription !== undefined && { fullDescription: body.fullDescription }),
      ...(body.images !== undefined && { images: JSON.stringify(body.images) }),
      ...(body.price !== undefined && { price: body.price }),
      ...(body.priceRange !== undefined && { priceRange: body.priceRange }),
      ...(body.duration !== undefined && { duration: body.duration }),
      ...(body.location !== undefined && { location: body.location }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.includes !== undefined && { includes: JSON.stringify(body.includes) }),
      ...(body.excludes !== undefined && { excludes: JSON.stringify(body.excludes) }),
      ...(body.highlights !== undefined && { highlights: JSON.stringify(body.highlights) }),
      ...(body.rating !== undefined && { rating: body.rating }),
      ...(body.reviewCount !== undefined && { reviewCount: body.reviewCount }),
      ...(body.maxGuests !== undefined && { maxGuests: body.maxGuests }),
      ...(body.difficulty !== undefined && { difficulty: body.difficulty }),
      ...(body.schedule !== undefined && { schedule: body.schedule }),
      ...(body.meeting !== undefined && { meeting: body.meeting }),
      ...(body.published !== undefined && { published: body.published }),
      ...(body.order !== undefined && { order: body.order }),
    },
  });
  return NextResponse.json(plan);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.tourPlan.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
