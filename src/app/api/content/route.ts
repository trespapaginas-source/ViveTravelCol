import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { defaultSiteContent } from "@/lib/content-defaults";
import type { SectionKey, SiteContentData } from "@/lib/content-types";

// GET /api/content — Returns all site content
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("site_content")
      .select("section_key, content");

    if (error) {
      console.error("Error fetching site content:", error);
      return NextResponse.json(defaultSiteContent);
    }

    const result: Partial<SiteContentData> = { ...defaultSiteContent };
    const keys = Object.keys(defaultSiteContent) as SectionKey[];

    for (const row of data || []) {
      const key = row.section_key as SectionKey;
      if (keys.includes(key) && row.content) {
        result[key] = {
          ...defaultSiteContent[key],
          ...(row.content as Record<string, unknown>),
        } as SiteContentData[SectionKey];
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching site content:", error);
    return NextResponse.json(defaultSiteContent);
  }
}

// PUT /api/content — Updates one or more sections
// Body: { section: "hero", data: {...} } or { sections: { hero: {...}, footer: {...} } }
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    const body = await request.json();

    if (body.section && body.data) {
      // Update single section
      const { error } = await supabase
        .from("site_content")
        .upsert(
          { section_key: body.section, content: body.data },
          { onConflict: "section_key" }
        );

      if (error) {
        console.error("Error updating section:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, key: body.section });
    }

    if (body.sections) {
      // Update multiple sections
      const entries = Object.entries(body.sections) as [string, unknown][];
      const upserts = entries.map(([key, data]) => ({
        section_key: key,
        content: data,
      }));

      const { error } = await supabase
        .from("site_content")
        .upsert(upserts, { onConflict: "section_key" });

      if (error) {
        console.error("Error updating sections:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, count: entries.length });
    }

    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating site content:", error);
    return NextResponse.json(
      { error: "Error al actualizar el contenido" },
      { status: 500 }
    );
  }
}

// POST /api/content — Seeds the database with default content
export async function POST() {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    const keys = Object.keys(defaultSiteContent) as SectionKey[];
    const upserts = keys.map((key) => ({
      section_key: key,
      content: defaultSiteContent[key] as Record<string, unknown>,
    }));

    const { error } = await supabase
      .from("site_content")
      .upsert(upserts, { onConflict: "section_key" });

    if (error) {
      console.error("Error seeding site content:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Contenido inicializado correctamente",
      count: keys.length,
    });
  } catch (error) {
    console.error("Error seeding site content:", error);
    return NextResponse.json(
      { error: "Error al inicializar el contenido" },
      { status: 500 }
    );
  }
}
