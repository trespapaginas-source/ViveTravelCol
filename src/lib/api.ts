import type { TourPlan, Cabin } from "./data";

// ─── API helpers ──────────────────────────────────────────────────────────────

const API_BASE = "/api";

export async function fetchPlans(): Promise<TourPlan[]> {
  const res = await fetch(`${API_BASE}/plans`);
  if (!res.ok) throw new Error("Error fetching plans");
  const raw = await res.json();
  return raw.map((p: Record<string, unknown>) => ({
    ...p,
    images: safeParse(p.images),
    includes: safeParse(p.includes),
    excludes: safeParse(p.excludes),
    highlights: safeParse(p.highlights),
  }));
}

export async function fetchPlan(id: string): Promise<TourPlan | null> {
  const res = await fetch(`${API_BASE}/plans/${id}`);
  if (!res.ok) return null;
  const p = await res.json();
  return {
    ...p,
    images: safeParse(p.images),
    includes: safeParse(p.includes),
    excludes: safeParse(p.excludes),
    highlights: safeParse(p.highlights),
  };
}

export async function fetchCabins(): Promise<Cabin[]> {
  const res = await fetch(`${API_BASE}/cabins`);
  if (!res.ok) throw new Error("Error fetching cabins");
  const raw = await res.json();
  return raw.map((c: Record<string, unknown>) => ({
    ...c,
    images: safeParse(c.images),
    amenities: safeParse(c.amenities),
    highlights: safeParse(c.highlights),
    rules: safeParse(c.rules),
    coordinates: {
      lat: (c.lat as number) || 0,
      lng: (c.lng as number) || 0,
    },
  }));
}

export async function fetchCabin(id: string): Promise<Cabin | null> {
  const res = await fetch(`${API_BASE}/cabins/${id}`);
  if (!res.ok) return null;
  const c = await res.json();
  return {
    ...c,
    images: safeParse(c.images),
    amenities: safeParse(c.amenities),
    highlights: safeParse(c.highlights),
    rules: safeParse(c.rules),
    coordinates: {
      lat: c.lat || 0,
      lng: c.lng || 0,
    },
  };
}

function safeParse(val: unknown): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}
