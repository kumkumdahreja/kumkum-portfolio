"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { DealPayment, Deliverable } from "@/lib/admin";

/* ---------- helpers ---------- */
async function db() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

/** Refresh every public page + the admin views after a change. */
function refresh() {
  revalidatePath("/", "layout");
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string) => {
  const n = Number(String(fd.get(k) ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const date = (fd: FormData, k: string) => str(fd, k) || null;
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";
const today = () => new Date().toISOString().slice(0, 10);

function derivePayment(amount: number, received: number): DealPayment {
  if (amount <= 0) return "na";
  if (received >= amount) return "received";
  return received > 0 ? "partial" : "pending";
}

/* ---------- auth ---------- */
export async function signIn(_: { error?: string } | undefined, fd: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: str(fd, "email"), password: String(fd.get("password") ?? "") });
  if (error) return { error: "That email and password didn't match. Try again?" };
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ---------- uploads ---------- */
export async function uploadFile(fd: FormData): Promise<{ url?: string; error?: string }> {
  const supabase = await db();
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "No file selected" };
  const folder = str(fd, "folder") || "uploads";
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const path = `${folder}/${Date.now()}-${safe}`;
  const { error } = await supabase.storage.from("site").upload(path, file, { contentType: file.type, upsert: true });
  if (error) return { error: error.message };
  return { url: supabase.storage.from("site").getPublicUrl(path).data.publicUrl };
}

/* ---------- projects ---------- */
export async function saveProject(fd: FormData) {
  const supabase = await db();
  const id = str(fd, "id");
  const stage = str(fd, "stage") || "onboarding";
  let published = bool(fd, "published");
  // A project goes live on the Work page automatically when it's delivered.
  if (stage === "delivered" && str(fd, "prev_stage") !== "delivered") published = true;

  const pub = {
    title: str(fd, "title") || "Untitled project",
    slug: str(fd, "slug") || null,
    kind: str(fd, "kind"),
    category: str(fd, "category") || "web",
    image_url: str(fd, "image_url"),
    live_url: str(fd, "live_url"),
    summary: str(fd, "summary"),
    stack: str(fd, "stack").split(",").map((t) => t.trim()).filter(Boolean),
    featured: bool(fd, "featured"),
    status: str(fd, "status") === "in-progress" ? "in-progress" : "live",
    published,
    sort: num(fd, "sort"),
    updated_at: new Date().toISOString(),
  };

  let projectId = id;
  if (id) {
    const { error } = await supabase.from("projects").update(pub).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase.from("projects").insert(pub).select("id").single();
    if (error) throw new Error(error.message);
    projectId = data.id;
  }

  const priv = {
    project_id: projectId,
    client: str(fd, "client"),
    source: str(fd, "source") || "direct",
    stage,
    repo_url: str(fd, "repo_url"),
    start_date: date(fd, "start_date"),
    due_date: date(fd, "due_date"),
    delivered_date: date(fd, "delivered_date") || (stage === "delivered" ? today() : null),
    amount: num(fd, "amount"),
    received: num(fd, "received"),
    payment_status: str(fd, "payment_status") || "pending",
    notes: str(fd, "notes"),
  };
  const { error: pErr } = await supabase.from("project_private").upsert(priv);
  if (pErr) throw new Error(pErr.message);

  refresh();
  redirect(`/admin/projects?saved=${encodeURIComponent(pub.title)}`);
}

export async function deleteProject(fd: FormData) {
  const supabase = await db();
  await supabase.from("projects").delete().eq("id", str(fd, "id"));
  refresh();
  redirect("/admin/projects");
}

export async function setProjectPublished(id: string, published: boolean) {
  const supabase = await db();
  await supabase.from("projects").update({ published }).eq("id", id);
  refresh();
}

/* ---------- brands & cafés ---------- */
export async function saveCollab(fd: FormData) {
  const supabase = await db();
  const id = str(fd, "id");
  const row = {
    name: str(fd, "name"),
    category: str(fd, "category") || "cafe",
    show_on_site: fd.has("show_on_site") ? bool(fd, "show_on_site") : true,
    sort: num(fd, "sort"),
  };
  if (!row.name) return;
  if (id) await supabase.from("collabs").update(row).eq("id", id);
  else await supabase.from("collabs").insert(row);
  refresh();
}

export async function setCollabVisible(id: string, show: boolean) {
  const supabase = await db();
  await supabase.from("collabs").update({ show_on_site: show }).eq("id", id);
  refresh();
}

export async function deleteCollab(fd: FormData) {
  const supabase = await db();
  await supabase.from("collabs").delete().eq("id", str(fd, "id"));
  refresh();
}

/* ---------- deals (private) ---------- */
export async function saveDeal(fd: FormData) {
  const supabase = await db();
  const id = str(fd, "id");

  let collabId = str(fd, "collab_id");
  const newBrand = str(fd, "new_brand");
  if (newBrand) {
    const { data, error } = await supabase
      .from("collabs")
      .insert({ name: newBrand, category: str(fd, "new_brand_category") || "cafe" })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    collabId = data.id;
  }
  if (!collabId) throw new Error("Pick a brand/café or type a new one");

  let deliverables: Deliverable[] = [];
  try {
    deliverables = JSON.parse(str(fd, "deliverables") || "[]");
  } catch {}

  const amount = num(fd, "amount");
  const received = num(fd, "received");
  const row = {
    collab_id: collabId,
    title: str(fd, "title"),
    deal_type: str(fd, "deal_type") || "barter",
    status: str(fd, "status") || "planned",
    deliverables,
    shoot_date: date(fd, "shoot_date"),
    due_date: date(fd, "due_date"),
    posted_date: date(fd, "posted_date"),
    amount,
    received,
    payment_status: derivePayment(amount, received),
    invoice_sent: bool(fd, "invoice_sent"),
    barter_details: str(fd, "barter_details"),
    barter_value: num(fd, "barter_value"),
    contact_name: str(fd, "contact_name"),
    contact_phone: str(fd, "contact_phone"),
    post_url: str(fd, "post_url"),
    views: str(fd, "views") ? num(fd, "views") : null,
    notes: str(fd, "notes"),
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from("deals").update(row).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("deals").insert(row);
    if (error) throw new Error(error.message);
  }
  refresh();
  redirect("/admin/deals?saved=1");
}

export async function deleteDeal(fd: FormData) {
  const supabase = await db();
  await supabase.from("deals").delete().eq("id", str(fd, "id"));
  refresh();
  redirect("/admin/deals");
}

export async function toggleDeliverable(dealId: string, index: number) {
  const supabase = await db();
  const { data } = await supabase.from("deals").select("deliverables,status").eq("id", dealId).single();
  if (!data) return;
  const list = (data.deliverables as Deliverable[]).map((d, i) => (i === index ? { ...d, done: !d.done } : d));
  const allDone = list.length > 0 && list.every((d) => d.done);
  await supabase
    .from("deals")
    .update({
      deliverables: list,
      status: allDone && data.status !== "done" ? "posted" : data.status,
      posted_date: allDone ? today() : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", dealId);
  revalidatePath("/admin", "layout");
}

export async function markDealPaid(dealId: string) {
  const supabase = await db();
  const { data } = await supabase.from("deals").select("amount").eq("id", dealId).single();
  if (!data) return;
  await supabase.from("deals").update({ received: data.amount, payment_status: "received" }).eq("id", dealId);
  revalidatePath("/admin", "layout");
}

export async function setDealStatus(dealId: string, status: string) {
  const supabase = await db();
  await supabase.from("deals").update({ status, updated_at: new Date().toISOString() }).eq("id", dealId);
  revalidatePath("/admin", "layout");
}

/* ---------- reels ---------- */
async function fetchReelCover(code: string): Promise<{ bytes: ArrayBuffer; type: string } | null> {
  try {
    const res = await fetch(`https://www.instagram.com/reel/${code}/embed/captioned/`, {
      headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36" },
      cache: "no-store",
    });
    const html = await res.text();
    const m =
      html.match(/class="EmbeddedMediaImage"[^>]*src="([^"]+)"/) ||
      html.match(/<img[^>]+src="([^"]+)"[^>]*class="EmbeddedMediaImage"/) ||
      html.match(/"display_url":"([^"]+)"/);
    if (!m) return null;
    const url = m[1].replace(/&amp;/g, "&").replace(/\\u0026/g, "&").replace(/\\\//g, "/");
    const img = await fetch(url, { cache: "no-store" });
    if (!img.ok) return null;
    return { bytes: await img.arrayBuffer(), type: img.headers.get("content-type") || "image/jpeg" };
  } catch {
    return null;
  }
}

export async function addReel(fd: FormData) {
  const supabase = await db();
  const link = str(fd, "link");
  const code = link.match(/instagram\.com\/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/)?.[1] || link.replace(/[^A-Za-z0-9_-]/g, "");
  if (!code) redirect("/admin/reels?error=link");

  let thumb_url = "";
  const file = fd.get("thumb");
  if (file instanceof File && file.size > 0) {
    const path = `reels/${code}-${Date.now()}.jpg`;
    const { error } = await supabase.storage.from("site").upload(path, file, { contentType: file.type, upsert: true });
    if (!error) thumb_url = supabase.storage.from("site").getPublicUrl(path).data.publicUrl;
  } else {
    const cover = await fetchReelCover(code);
    if (cover) {
      const path = `reels/${code}.jpg`;
      const { error } = await supabase.storage.from("site").upload(path, cover.bytes, { contentType: cover.type, upsert: true });
      if (!error) thumb_url = supabase.storage.from("site").getPublicUrl(path).data.publicUrl;
    }
  }

  const { error } = await supabase.from("reels").upsert(
    {
      code,
      category: str(fd, "category") || "cafe",
      partner: str(fd, "partner") || "Collab",
      note: str(fd, "note"),
      thumb_url,
      featured: true,
      sort: num(fd, "sort"),
    },
    { onConflict: "code" }
  );
  if (error) throw new Error(error.message);
  refresh();
  redirect(`/admin/reels?added=${thumb_url ? "1" : "nocover"}`);
}

export async function updateReel(fd: FormData) {
  const supabase = await db();
  const id = str(fd, "id");
  const patch: Record<string, unknown> = {
    partner: str(fd, "partner"),
    note: str(fd, "note"),
    category: str(fd, "category"),
    featured: bool(fd, "featured"),
    sort: num(fd, "sort"),
  };
  const file = fd.get("thumb");
  if (file instanceof File && file.size > 0) {
    const path = `reels/${id}-${Date.now()}.jpg`;
    const { error } = await supabase.storage.from("site").upload(path, file, { contentType: file.type, upsert: true });
    if (!error) patch.thumb_url = supabase.storage.from("site").getPublicUrl(path).data.publicUrl;
  }
  await supabase.from("reels").update(patch).eq("id", id);
  refresh();
}

export async function deleteReel(fd: FormData) {
  const supabase = await db();
  await supabase.from("reels").delete().eq("id", str(fd, "id"));
  refresh();
}

/* ---------- media kit & profile (JSON editors) ---------- */
export async function saveMediaKit(json: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await db();
  try {
    const data = JSON.parse(json);
    const { error } = await supabase.from("mediakit_snapshots").insert({ period: String(data.period || "Untitled"), data });
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function saveProfile(json: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await db();
  try {
    const data = JSON.parse(json);
    const { error } = await supabase.from("site_profile").upsert({ id: 1, data, updated_at: new Date().toISOString() });
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
