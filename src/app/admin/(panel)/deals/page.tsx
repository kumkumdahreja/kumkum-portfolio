import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { categoryLabels, dealOutstanding, dealTypes, fmtDate, isOverdue, isPaidDeal, pendingDeliverables, rupees, type CollabRow, type DealRow } from "@/lib/admin";
import { Banner } from "@/components/admin/Fields";
import { MarkPaidButton, QuickDeliverables, StatusSelect } from "@/components/admin/DealBits";

const views = [
  { id: "all", label: "All" },
  { id: "deliver", label: "To deliver" },
  { id: "unpaid", label: "Unpaid" },
  { id: "done", label: "Done" },
];

export default async function DealsAdmin({ searchParams }: { searchParams: Promise<{ view?: string; saved?: string }> }) {
  const { view = "all", saved } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("deals").select("*, collabs(name,category)").order("created_at", { ascending: false });
  const all = (data ?? []) as DealRow[];

  const list = all.filter((d) => {
    if (view === "deliver") return pendingDeliverables(d) > 0;
    if (view === "unpaid") return dealOutstanding(d) > 0;
    if (view === "done") return d.status === "done";
    return true;
  });

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">Collab tracker</p>
          <h1 className="display mt-2 text-[clamp(2rem,4vw,3rem)]">
            Deals &amp; <em>deliverables.</em>
          </h1>
          <p className="mt-2 text-[14px] text-muted">Private. Tap a deliverable to tick it off; “Mark paid” settles the payment.</p>
        </div>
        <Link href="/admin/deals/new" className="rounded-full bg-ink px-5 py-2.5 text-[14px] text-cream">+ New collab</Link>
      </div>

      {saved && <Banner>Saved ✓</Banner>}

      <div className="mt-6 inline-flex gap-1 rounded-full bg-paper p-1 ring-1 ring-line">
        {views.map((v) => (
          <Link
            key={v.id}
            href={`/admin/deals?view=${v.id}`}
            className={`rounded-full px-4 py-2 text-[13px] ${view === v.id ? "bg-lavender text-ink" : "text-muted hover:text-ink"}`}
          >
            {v.label}
          </Link>
        ))}
      </div>

      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {list.map((d) => {
          const owed = dealOutstanding(d);
          return (
            <li key={d.id} className="rounded-[1.5rem] bg-paper p-5 ring-1 ring-line">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/admin/deals/${d.id}`} className="font-serif text-xl hover:text-rose">
                    {d.collabs?.name ?? "Collab"}
                  </Link>
                  <p className="text-[12px] text-muted">
                    {categoryLabels[(d.collabs?.category as CollabRow["category"]) ?? "cafe"]} · {dealTypes.find((t) => t.id === d.deal_type)?.label}
                    {d.title ? ` · ${d.title}` : ""}
                  </p>
                </div>
                <StatusSelect dealId={d.id} value={d.status} />
              </div>

              {d.deliverables?.length > 0 && (
                <div className="mt-4">
                  <QuickDeliverables dealId={d.id} items={d.deliverables} />
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px]">
                {d.due_date && (
                  <span className={`rounded-full px-2.5 py-0.5 ${isOverdue(d.due_date) && pendingDeliverables(d) > 0 ? "bg-blush text-rose" : "bg-cream text-ink-soft"}`}>
                    Due {fmtDate(d.due_date)}
                  </span>
                )}
                {isPaidDeal(d) && (
                  <span className={`rounded-full px-2.5 py-0.5 ${owed > 0 ? "bg-butter" : "bg-mint"}`}>
                    {owed > 0 ? `${rupees(owed)} due of ${rupees(d.amount)}` : `Paid ${rupees(d.amount)}`}
                  </span>
                )}
                {d.barter_details && <span className="rounded-full bg-cream px-2.5 py-0.5 text-ink-soft">Barter: {d.barter_details}</span>}
                {owed > 0 && <MarkPaidButton dealId={d.id} />}
                {d.post_url && (
                  <a href={d.post_url} target="_blank" className="text-muted underline underline-offset-2 hover:text-rose">Post ↗</a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {list.length === 0 && <p className="mt-6 text-muted">Nothing here yet.</p>}
    </>
  );
}
