/**
 * Content layer for the public site.
 * Reads from Supabase when it's configured, otherwise from src/data.
 * Only public tables/columns are read here; money, deals and contacts
 * live in private tables that the public site never queries.
 */
import { profileBundle, type SiteProfile } from "@/data/profile";
import { projects as localProjects, type Project, type ProjectCategory } from "@/data/projects";
import { collabs as localCollabs, reels as localReels, type Collab, type CollabCategory, type Reel } from "@/data/collabs";
import { mediakit as localMediaKit, type MediaKit } from "@/data/mediakit";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { publicClient } from "@/lib/supabase/public";

async function safe<T>(label: string, fn: () => Promise<T | null>, fallback: T): Promise<T> {
  if (!isSupabaseConfigured) return fallback;
  try {
    const v = await fn();
    return v ?? fallback;
  } catch (e) {
    console.warn(`[content] ${label}: using local data (${(e as Error)?.message ?? e})`);
    return fallback;
  }
}

export function getProfile(): Promise<SiteProfile> {
  return safe("profile", async () => {
    const { data, error } = await publicClient().from("site_profile").select("data").eq("id", 1).maybeSingle();
    if (error) throw error;
    return data ? ({ ...profileBundle, ...(data.data as Partial<SiteProfile>) } as SiteProfile) : null;
  }, profileBundle);
}

type ProjectRow = {
  id: string;
  slug: string | null;
  title: string;
  kind: string;
  category: ProjectCategory;
  image_url: string;
  live_url: string;
  summary: string;
  stack: string[] | null;
  featured: boolean;
  status: "live" | "in-progress";
};

export function getProjects(): Promise<Project[]> {
  return safe("projects", async () => {
    const { data, error } = await publicClient()
      .from("projects")
      .select("id,slug,title,kind,category,image_url,live_url,summary,stack,featured,status")
      .eq("published", true)
      .order("sort", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as ProjectRow[]).map((r) => ({
      id: r.slug || r.id,
      title: r.title,
      kind: r.kind,
      category: r.category,
      image: r.image_url,
      url: r.live_url,
      summary: r.summary,
      stack: r.stack ?? [],
      featured: r.featured,
      status: r.status,
    }));
  }, localProjects);
}

export function getCollabs(): Promise<Collab[]> {
  return safe("collabs", async () => {
    const { data, error } = await publicClient()
      .from("collabs")
      .select("name,category")
      .eq("show_on_site", true)
      .order("sort", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data as Collab[];
  }, localCollabs);
}

export function getReels(): Promise<Reel[]> {
  return safe("reels", async () => {
    const { data, error } = await publicClient()
      .from("reels")
      .select("code,category,partner,note,thumb_url")
      .eq("featured", true)
      .order("sort", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data as { code: string; category: CollabCategory; partner: string; note: string; thumb_url: string }[]).map((r) => ({
      id: r.code,
      category: r.category,
      partner: r.partner,
      note: r.note || undefined,
      thumb: r.thumb_url, // "" means no cover yet
    }));
  }, localReels);
}

export function getMediaKit(): Promise<MediaKit> {
  return safe("mediakit", async () => {
    const { data, error } = await publicClient()
      .from("mediakit_snapshots")
      .select("data")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data ? ({ ...localMediaKit, ...(data.data as Partial<MediaKit>) } as MediaKit) : null;
  }, localMediaKit);
}

export const namesBy = (list: Collab[], c: CollabCategory) => list.filter((x) => x.category === c).map((x) => x.name);
