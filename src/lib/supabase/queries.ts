"use client";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { SiteContentData, SectionKey } from "@/lib/content-types";
import { defaultSiteContent } from "@/lib/content-defaults";

function getClient() {
  const client = createClient();
  if (!client) {
    throw new Error("Supabase no está configurado. Agrega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local");
  }
  return client;
}

// ============================================================
// TYPES - Alinhados con la base de datos Supabase
// ============================================================

export interface TourPlan {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  price: number;
  price_range: string;
  duration: string;
  location: string;
  category_id: string;
  category?: PlanCategory;
  difficulty: string;
  schedule: string;
  meeting_point: string;
  rating: number;
  review_count: number;
  max_guests: number;
  published: boolean;
  sort_order: number;
  images: PlanImage[];
  includes: PlanInclude[];
  excludes: PlanExclude[];
  highlights: PlanHighlight[];
  created_at: string;
  updated_at: string;
}

export interface PlanCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
  sort_order: number;
}

export interface PlanImage {
  id: string;
  plan_id: string;
  url: string;
  caption: string;
  storage_path: string | null;
  source: "external" | "upload";
  sort_order: number;
}

export interface PlanInclude {
  id: string;
  plan_id: string;
  text: string;
  sort_order: number;
}

export interface PlanExclude {
  id: string;
  plan_id: string;
  text: string;
  sort_order: number;
}

export interface PlanHighlight {
  id: string;
  plan_id: string;
  text: string;
  sort_order: number;
}

export interface Cabin {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  price_per_night: number;
  price_range: string;
  location: string;
  address: string;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  lat: number;
  lng: number;
  check_in: string;
  check_out: string;
  cancellation_policy: string;
  rating: number;
  review_count: number;
  published: boolean;
  sort_order: number;
  images: CabinImage[];
  amenities: CabinAmenity[];
  highlights: CabinHighlight[];
  rules: CabinRule[];
  created_at: string;
  updated_at: string;
}

export interface CabinImage {
  id: string;
  cabin_id: string;
  url: string;
  caption: string;
  storage_path: string | null;
  source: "external" | "upload";
  sort_order: number;
}

export interface CabinAmenity {
  id: string;
  cabin_id: string;
  text: string;
  sort_order: number;
}

export interface CabinHighlight {
  id: string;
  cabin_id: string;
  text: string;
  sort_order: number;
}

export interface CabinRule {
  id: string;
  cabin_id: string;
  text: string;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  location: string;
  text: string;
  rating: number;
  trip_name: string;
  plan_id: string | null;
  published: boolean;
  sort_order: number;
}

export interface HeroImage {
  id: string;
  url: string;
  caption: string;
  storage_path: string | null;
  source: "external" | "upload";
  sort_order: number;
}

export interface TripImage {
  id: string;
  url: string;
  caption: string;
  storage_path: string | null;
  source: "external" | "upload";
  sort_order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  contact_method: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// PLAN CATEGORIES
// ============================================================

export async function fetchCategories(): Promise<PlanCategory[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("plan_categories")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data || [];
}

// ============================================================
// TOUR PLANS
// ============================================================

export async function fetchPlans(all = false): Promise<TourPlan[]> {
  const supabase = getClient();
  let query = supabase
    .from("tour_plans")
    .select(`
      *,
      category:plan_categories(*),
      images:plan_images(*),
      includes:plan_includes(*),
      excludes:plan_excludes(*),
      highlights:plan_highlights(*)
    `)
    .order("sort_order");

  if (!all) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(transformPlan);
}

export async function fetchPlan(id: string): Promise<TourPlan | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("tour_plans")
    .select(`
      *,
      category:plan_categories(*),
      images:plan_images(*),
      includes:plan_includes(*),
      excludes:plan_excludes(*),
      highlights:plan_highlights(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return transformPlan(data);
}

function safeSortArray<T>(arr: unknown, key: keyof T): T[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((item): item is T => item != null && typeof item === 'object')
    .sort((a, b) => {
      const aVal = a[key] ?? 0;
      const bVal = b[key] ?? 0;
      return Number(aVal) - Number(bVal);
    });
}

function transformPlan(raw: Record<string, unknown>): TourPlan {
  const plan = { ...raw } as TourPlan;
  plan.images = safeSortArray<PlanImage>(raw.images, 'sort_order');
  plan.includes = safeSortArray<PlanInclude>(raw.includes, 'sort_order');
  plan.excludes = safeSortArray<PlanExclude>(raw.excludes, 'sort_order');
  plan.highlights = safeSortArray<PlanHighlight>(raw.highlights, 'sort_order');
  return plan;
}

// ============================================================
// CABINS
// ============================================================

export async function fetchCabins(all = false): Promise<Cabin[]> {
  const supabase = getClient();
  let query = supabase
    .from("cabins")
    .select(`
      *,
      images:cabin_images(*),
      amenities:cabin_amenities(*),
      highlights:cabin_highlights(*),
      rules:cabin_rules(*)
    `)
    .order("sort_order");

  if (!all) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(transformCabin);
}

export async function fetchCabin(id: string): Promise<Cabin | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("cabins")
    .select(`
      *,
      images:cabin_images(*),
      amenities:cabin_amenities(*),
      highlights:cabin_highlights(*),
      rules:cabin_rules(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return transformCabin(data);
}

function transformCabin(raw: Record<string, unknown>): Cabin {
  const cabin = { ...raw } as Cabin;
  cabin.images = safeSortArray<CabinImage>(raw.images, 'sort_order');
  cabin.amenities = safeSortArray<CabinAmenity>(raw.amenities, 'sort_order');
  cabin.highlights = safeSortArray<CabinHighlight>(raw.highlights, 'sort_order');
  cabin.rules = safeSortArray<CabinRule>(raw.rules, 'sort_order');
  return cabin;
}

// ============================================================
// TESTIMONIALS
// ============================================================

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  if (error) throw error;
  return data || [];
}

// ============================================================
// HERO IMAGES
// ============================================================

export async function fetchHeroImages(): Promise<HeroImage[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("hero_images")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data || [];
}

// ============================================================
// TRIP IMAGES
// ============================================================

export async function fetchTripImages(): Promise<TripImage[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("trip_images")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data || [];
}

// ============================================================
// SITE CONTENT
// ============================================================

export async function fetchSiteContent(): Promise<SiteContentData> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("section_key, content");

  if (error) throw error;

  const result = { ...defaultSiteContent };
  for (const row of data || []) {
    const key = row.section_key as SectionKey;
    if (result[key] && row.content) {
      result[key] = { ...result[key], ...(row.content as Record<string, unknown>) };
    }
  }
  return result;
}

export async function updateSiteSection(
  sectionKey: SectionKey,
  content: Record<string, unknown>
): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase
    .from("site_content")
    .upsert(
      { section_key: sectionKey, content },
      { onConflict: "section_key" }
    );
  if (error) throw error;
}

// ============================================================
// CONTACT MESSAGES
// ============================================================

export async function submitContactMessage(msg: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  contact_method: string;
}): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase.from("contact_messages").insert(msg);
  if (error) throw error;
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function markMessageRead(id: string): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteContactMessage(id: string): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ============================================================
// IMAGE UPLOAD
// ============================================================

export async function uploadImage(
  file: File,
  folder: string = "general"
): Promise<{ url: string; storagePath: string }> {
  const supabase = getClient();
  const ext = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(fileName, file, { upsert: false });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  return { url: publicUrl, storagePath: fileName };
}

export async function deleteImage(storagePath: string): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase.storage
    .from("images")
    .remove([storagePath]);
  if (error) throw error;
}
