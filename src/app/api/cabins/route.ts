import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const cabins = await db.cabin.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(cabins);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cabin = await db.cabin.create({
    data: {
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      shortDescription: body.shortDescription || "",
      fullDescription: body.fullDescription || "",
      images: JSON.stringify(body.images || []),
      pricePerNight: body.pricePerNight || 0,
      priceRange: body.priceRange || "",
      location: body.location || "",
      capacity: body.capacity || 2,
      bedrooms: body.bedrooms || 1,
      bathrooms: body.bathrooms || 1,
      amenities: JSON.stringify(body.amenities || []),
      highlights: JSON.stringify(body.highlights || []),
      rules: JSON.stringify(body.rules || []),
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0,
      lat: body.lat || 0,
      lng: body.lng || 0,
      checkIn: body.checkIn || "3:00 PM",
      checkOut: body.checkOut || "11:00 AM",
      cancellationPolicy: body.cancellationPolicy || "",
      published: body.published ?? true,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json(cabin, { status: 201 });
}
