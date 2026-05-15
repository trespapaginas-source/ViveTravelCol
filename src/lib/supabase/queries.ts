"use client";

import { createClient } from "@/lib/supabase/client";
import { defaultSiteContent } from "@/lib/content-defaults";
import type { SectionKey, SiteContentData } from "@/lib/content-types";

export async function fetchSiteContent(): Promise<SiteContentData> {
  const supabase = createClient();

  if (!supabase) {
    return defaultSiteContent;
  }

  const { data, error } = await supabase
    .from("site_content")
    .select("section_key, content");

  if (error) {
    console.error("Error fetching site content:", error);
    return defaultSiteContent;
  }

  const result = { ...defaultSiteContent } as Record<SectionKey, unknown>;
  const keys = Object.keys(defaultSiteContent) as SectionKey[];

  for (const row of data || []) {
    const key = row.section_key as SectionKey;
    if (keys.includes(key) && row.content) {
        result[key] = {
          ...defaultSiteContent[key],
          ...(row.content as Record<string, unknown>),
        };
    }
  }

  return result as SiteContentData;
}
