"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchPlans, fetchCabins } from "@/lib/api";

/**
 * Prefetches plans and cabins data in the background
 * so that navigating to those views is instant.
 * Call this from the home page.
 */
export function usePrefetchData() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch plans and cabins after a short delay to not block initial render
    const timer = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: ["plans"],
        queryFn: fetchPlans,
      });
      queryClient.prefetchQuery({
        queryKey: ["cabins"],
        queryFn: fetchCabins,
      });
    }, 2000); // Wait 2s after mount to start prefetching

    return () => clearTimeout(timer);
  }, [queryClient]);
}
