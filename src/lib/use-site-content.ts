"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { defaultSiteContent } from "@/lib/content-defaults";
import type { SiteContentData, SectionKey } from "@/lib/content-types";
import { fetchSiteContent, updateSiteSection } from "@/lib/supabase/queries";

export function useSiteContent() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<SiteContentData>({
    queryKey: ["site-content"],
    queryFn: fetchSiteContent,
    staleTime: 1000 * 60 * 5,
    initialData: defaultSiteContent,
  });

  const updateSection = async (section: SectionKey, sectionData: unknown) => {
    await updateSiteSection(section, sectionData as Record<string, unknown>);
    queryClient.setQueryData<SiteContentData>(["site-content"], (old) => {
      if (!old) return old;
      return { ...old, [section]: sectionData };
    });
    queryClient.invalidateQueries({ queryKey: ["site-content"] });
  };

  return {
    content: data ?? defaultSiteContent,
    isLoading,
    error,
    updateSection,
  };
}
