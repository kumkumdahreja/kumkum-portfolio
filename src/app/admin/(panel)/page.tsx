import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  dealOutstanding,
  fmtDate,
  isOverdue,
  pendingDeliverables,
  privateOf,
  rupees,
  stages,
  type DealRow,
  type ProjectRow,
} from "@/lib/admin";
import { MarkPaidButton, QuickDeliverables } from "@/components/admin/DealBits";

export default async function Overview() {
  const supabase = await createClient();
  const [{ data: projectsData }, { data: dealsData }] = await Promise.all([
    supabase.from("projects").select("*, project_private(*)").order("created_at", { ascending: false }),
    supabase.from("deals").select("*, collabs(name,category)").order("due_date", { ascending: true, nullsFirst: false }),
  ]);
  const projects = (projectsData ?? []) as ProjectRow[];
  const deals = (dealsData ?? []) as DealRow[];

  const activeProjects = projects.filter((p) => privateOf(p) && privateOf(p)!.stage !== "delivered");
  const toDeliver = deals.filter((d) => pendingDeliverables(d) > 0);
  const dealsUnpaid = deals.filter((d) => dealOutstanding(d) > 0);
  const projectsUnpaid = projects.filter((p) => {
    const pp = privateOf(p);
    return pp && pp.payment_status !== "settled" && pp.payment_status !== "na" && pp.amount > pp.received;
  });
  const unpaidTotal =
    dealsUnpaid.reduce((a, d) => a + dealOutstanding(d), 0) +
    projectsUnpaid.reduce((a, p) => a + (privateOf(p)!.amount - privateOf(p)!.received), 0);
  const receivedTotal =
    deals.reduce((a, d) => a + (d.received || 0), 0) + projects.reduce((a, p) => a + (privateOf(p)?.received || 0), 0);
  const pendingCount = toDeliver.reduce((a, d) => a + pendingDeliverables(d), 0);

  const hour = new Date().toLocaleString("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" });
  const greet = +hour < 12 ? "Good morning" : +hour < 17 ? "Good afternoon" : "Good evening";

  const kpis = [
    { label: "Deliverables left", value: pendingCount, tone: "bg-blush", href: "/admin/deals?view=deliver" },
    { label: "Unpaid", value: rupees(unpaidTotal), tone: "bg-butter", href: "/admin/deals?view=unpaid" },
    { label: "Projects in progress", value: activeProjects.length, tone: "bg-lavender", href: "/admin/projects" },
    { label: "Received so far", value: rupees(receivedTotal), tone: "bg-mint", href: "/admin/deals" },
  ];

  return (
    <>
      <p className="label">Overview</p>
      <h1 className="display mt-2 text-[clamp(2rem,4vw,3rem)]">
        {greet}, <em>Kumkum.</em>
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href} className={`rounded-[1.5rem] p-5 transition-transform hover:-translate-y-1 ${k.tone}`}>
            <p className="font-serif text-3xl">{k.value}</p>
            <p className="mt-1 text-[13px] text-ink-soft">{k.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/admin/deals/new" className="rounded-full bg-ink px-5 py-2.5 text-[14px] text-cream">+ New collab</Link>
        <Link href="/admin/projects/new" className="rounded-full bg-paper px-5 py-2.5 text-[14px] ring-1 ring-line">+ New project</Link>
        <Link href="/admin/media-kit" className="rounded-full bg-paper px-5 py-2.5 text-[14px] ring-1 ring-line">Update media kit</Link>
      </div>

      <section className="mt-12">
        <h2 className="font-serif text-2xl">Still to deliver</h2>
        {toDeliver.length === 0 ? (
          <p className="mt-3 text-[14px] text-muted">Nothing pending. Lovely!</p>
        ) : (
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {toDeliver.map((d) => (
              <li key={d.id} className="rounded-[1.5rem] bg-paper p-5 ring-1 ring-line">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <Link href={`/admin/deals/${d.id}`} className="font-serif text-xl hover:text-rose">
                    {d.collabs?.name ?? "Collab"}
                    {d.title && <span className="ml-2 font-sans text-[13px] text-muted">{d.title}</span>}
                  </Link>
                  {d.due_date && (
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[12px] ${isOverdue(d.due_date) ? "bg-blush text-rose" : "bg-cream text-ink-soft"}`}>
                      {isOverdue(d.due_date) ? "Overdue · " : "Due "}
                      {fmtDate(d.due_date)}
                    </span>
                  )}
                </div>
                <QuickDeliverables dealId={d.id} items={d.deliverables} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl">Waiting for payment</h2>
          <ul className="mt-4 divide-y divide-line rounded-[1.5rem] bg-paper ring-1 ring-line">
            {dealsUnpaid.length + projectsUnpaid.length === 0 && <li className="p-5 text-[14px] text-muted">All paid up.</li>}
            {dealsUnpaid.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 p-4">
                <Link href={`/admin/deals/${d.id}`} className="text-[14px] hover:text-rose">
                  {d.collabs?.name}
                  <span className="block text-[12px] text-muted">
                    {rupees(dealOutstanding(d))} due{d.invoice_sent ? " · invoice sent" : ""}
                  </span>
                </Link>
                <MarkPaidButton dealId={d.id} />
              </li>
            ))}
            {projectsUnpaid.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 p-4">
                <Link href={`/admin/projects/${p.id}`} className="text-[14px] hover:text-rose">
                  {p.title}
                  <span className="block text-[12px] text-muted">
                    {rupees(privateOf(p)!.amount - privateOf(p)!.received)} due · project
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-serif text-2xl">Projects in progress</h2>
          <ul className="mt-4 divide-y divide-line rounded-[1.5rem] bg-paper ring-1 ring-line">
            {activeProjects.length === 0 && <li className="p-5 text-[14px] text-muted">No active projects.</li>}
            {activeProjects.map((p) => {
              const pp = privateOf(p)!;
              const st = stages.find((s) => s.id === pp.stage)!;
              return (
                <li key={p.id} className="flex items-center justify-between gap-3 p-4">
                  <Link href={`/admin/projects/${p.id}`} className="text-[14px] hover:text-rose">
                    {p.title}
                    <span className="block text-[12px] text-muted">
                      {pp.client || "—"}
                      {pp.due_date ? ` · due ${fmtDate(pp.due_date)}` : ""}
                    </span>
                  </Link>
                  <span className={`rounded-full px-3 py-1 text-[12px] ${st.tone}`}>{st.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
