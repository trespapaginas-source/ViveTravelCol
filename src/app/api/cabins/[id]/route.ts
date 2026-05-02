import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cabin = await db.cabin.findUnique({ where: { id } });
  if (!cabin) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(cabin);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const cabin = await db.cabin.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.shortDescription !== undefined && { shortDescription: body.shortDescription }),
      ...(body.fullDescription !== undefined && { fullDescription: body.fullDescription }),
      ...(body.images !== undefined && { images: JSON.stringify(body.images) }),
      ...(body.pricePerNight !== undefined && { pricePerNight: body.pricePerNight }),
      ...(body.priceRange !== undefined && { priceRange: body.priceRange }),
      ...(body.location !== undefined && { location: body.location }),
      ...(body.capacity !== undefined && { capacity: body.capacity }),
      ...(body.bedrooms !== undefined && { bedrooms: body.bedrooms }),
      ...(body.bathrooms !== undefined && { bathrooms: body.bathrooms }),
      ...(body.amenities !== undefined && { amenities: JSON.stringify(body.amenities) }),
      ...(body.highlights !== undefined && { highlights: JSON.stringify(body.highlights) }),
      ...(body.rules !== undefined && { rules: JSON.stringify(body.rules) }),
      ...(body.rating !== undefined && { rating: body.rating }),
      ...(body.reviewCount !== undefined && { reviewCount: body.reviewCount }),
      ...(body.lat !== undefined && { lat: body.lat }),
      ...(body.lng !== undefined && { lng: body.lng }),
      ...(body.checkIn !== undefined && { checkIn: body.checkIn }),
      ...(body.checkOut !== undefined && { checkOut: body.checkOut }),
      ...(body.cancellationPolicy !== undefined && { cancellationPolicy: body.cancellationPolicy }),
      ...(body.published !== undefined && { published: body.published }),
      ...(body.order !== undefined && { order: body.order }),
    },
  });
  return NextResponse.json(cabin);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.cabin.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
