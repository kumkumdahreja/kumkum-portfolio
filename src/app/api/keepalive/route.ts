import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { publicClient } from "@/lib/supabase/public";

// Called once a day by Vercel Cron (see vercel.json) so the free Supabase
// project never pauses for inactivity.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!isSupabaseConfigured) return NextResponse.json({ ok: true, supabase: "not configured" });
  const { error } = await publicClient().from("site_profile").select("id").limit(1);
  return NextResponse.json({ ok: !error, at: new Date().toISOString() });
}
