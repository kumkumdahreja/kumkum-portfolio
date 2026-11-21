import { createClient } from "@/lib/supabase/server";
import { mediakit as fallback } from "@/data/mediakit";
import { saveMediaKit } from "../../actions";
import { JsonEditor } from "@/components/admin/JsonEditor";

export default async function MediaKitAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("mediakit_snapshots").select("id,period,data,created_at").order("created_at", { ascending: false }).limit(12);
  const latest = data?.[0]?.data ?? fallback;
  const current = { ...fallback, ...latest };

  return (
    <>
      <p className="label">Media kit</p>
      <h1 className="display mt-2 text-[clamp(2rem,4vw,3rem)]">
        Monthly <em>numbers.</em>
      </h1>
      <p className="mt-2 max-w-2xl text-[14px] text-muted">
        Copy the numbers from Instagram → Insights for the last 30 days. Change the period, update the figures and save. Each save is kept as
        that month&apos;s snapshot, and the media kit always shows the newest one. Growth badges, “K” formatting and totals are worked out for you.
      </p>

      {data && data.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {data.map((s, i) => (
            <span key={s.id} className={`rounded-full px-3 py-1 text-[12px] ${i === 0 ? "bg-mint" : "bg-paper ring-1 ring-line"}`}>
              {s.period}
              {i === 0 ? " · live" : ""}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8">
        <JsonEditor initial={current} action={saveMediaKit} saveLabel="Save this month" hint="Saving updates the public media kit right away." />
      </div>
    </>
  );
}
