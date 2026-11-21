import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { fmtDate, privateOf, rupees, stages, type ProjectRow } from "@/lib/admin";
import { asset } from "@/lib/asset";
import { Banner } from "@/components/admin/Fields";
import { PublishToggle } from "@/components/admin/PublishToggle";

export default async function ProjectsAdmin({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*, project_private(*)").order("sort").order("created_at", { ascending: false });
  const projects = (data ?? []) as ProjectRow[];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label">Projects</p>
          <h1 className="display mt-2 text-[clamp(2rem,4vw,3rem)]">
            Dev <em>work.</em>
          </h1>
          <p className="mt-2 text-[14px] text-muted">Delivered projects go live on the Work page automatically. Use the switch to hide or show any project.</p>
        </div>
        <Link href="/admin/projects/new" className="rounded-full bg-ink px-5 py-2.5 text-[14px] text-cream">+ New project</Link>
      </div>

      {saved && <Banner>Saved “{saved}” ✓ The website is updated.</Banner>}

      <div className="mt-8 space-y-10">
        {stages.map((st) => {
          const list = projects.filter((p) => (privateOf(p)?.stage ?? "delivered") === st.id);
          if (!list.length) return null;
          return (
            <section key={st.id}>
              <h2 className="mb-3 flex items-center gap-2 font-serif text-xl">
                <span className={`h-3 w-3 rounded-full ${st.tone}`} /> {st.label}
                <span className="font-sans text-[13px] text-muted">{list.length}</span>
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((p) => {
                  const pp = privateOf(p);
                  return (
                    <li key={p.id} className="overflow-hidden rounded-[1.5rem] bg-paper ring-1 ring-line">
                      <Link href={`/admin/projects/${p.id}`} className="group block">
                        <div className="aspect-[16/9] overflow-hidden bg-cream">
                          {p.image_url ? (
                            <img src={asset(p.image_url)} alt="" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                          ) : (
                            <div className="grid h-full place-items-center font-serif text-muted">No image yet</div>
                          )}
                        </div>
                        <div className="p-4 pb-2">
                          <p className="font-serif text-lg leading-tight group-hover:text-rose">{p.title}</p>
                          <p className="text-[12px] text-muted">
                            {pp?.client || p.kind}
                            {pp?.due_date && pp.stage !== "delivered" ? ` · due ${fmtDate(pp.due_date)}` : ""}
                            {pp && pp.amount > 0 ? ` · ${rupees(pp.received)} / ${rupees(pp.amount)}` : ""}
                          </p>
                        </div>
                      </Link>
                      <div className="flex items-center justify-between px-4 pb-4 pt-2">
                        <PublishToggle id={p.id} published={p.published} />
                        {p.featured && <span className="rounded-full bg-butter px-2.5 py-0.5 text-[11px]">Featured</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
        {projects.length === 0 && <p className="text-muted">No projects yet. Add your first one!</p>}
      </div>
    </>
  );
}
