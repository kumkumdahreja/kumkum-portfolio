import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { privateOf, stages, type ProjectRow } from "@/lib/admin";
import { categories } from "@/data/projects";
import { deleteProject, saveProject } from "../../../actions";
import { DangerButton, Field, ImageField, inputCls, SubmitButton, Toggle } from "@/components/admin/Fields";

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  let p: ProjectRow | null = null;
  if (!isNew) {
    const supabase = await createClient();
    const { data } = await supabase.from("projects").select("*, project_private(*)").eq("id", id).maybeSingle();
    if (!data) notFound();
    p = data as ProjectRow;
  }
  const pp = p ? privateOf(p) : null;

  return (
    <>
      <Link href="/admin/projects" className="text-[13px] text-muted hover:text-rose">← All projects</Link>
      <h1 className="display mt-2 text-[clamp(2rem,4vw,3rem)]">{isNew ? <>New <em>project.</em></> : p!.title}</h1>

      <form action={saveProject} className="mt-8 space-y-6">
        <input type="hidden" name="id" value={p?.id ?? ""} />
        <input type="hidden" name="prev_stage" value={pp?.stage ?? ""} />

        <section className="rounded-[1.75rem] bg-paper p-6 ring-1 ring-line">
          <h2 className="font-serif text-xl">Work progress <span className="font-sans text-[12px] text-muted">· private</span></h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Stage" hint="Set to Delivered and the project goes live on the Work page.">
              <select name="stage" defaultValue={pp?.stage ?? "onboarding"} className={inputCls}>
                {stages.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Client">
              <input name="client" defaultValue={pp?.client ?? ""} className={inputCls} />
            </Field>
            <Field label="Source">
              <select name="source" defaultValue={pp?.source ?? "direct"} className={inputCls}>
                <option value="direct">Direct</option>
                <option value="agency">Agency / employer</option>
                <option value="upwork">Upwork</option>
                <option value="personal">Personal</option>
              </select>
            </Field>
            <Field label="Repo / Figma link">
              <input name="repo_url" defaultValue={pp?.repo_url ?? ""} className={inputCls} />
            </Field>
            <Field label="Start date"><input type="date" name="start_date" defaultValue={pp?.start_date ?? ""} className={inputCls} /></Field>
            <Field label="Due date"><input type="date" name="due_date" defaultValue={pp?.due_date ?? ""} className={inputCls} /></Field>
            <Field label="Delivered on"><input type="date" name="delivered_date" defaultValue={pp?.delivered_date ?? ""} className={inputCls} /></Field>
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-paper p-6 ring-1 ring-line">
          <h2 className="font-serif text-xl">Money <span className="font-sans text-[12px] text-muted">· private, never shown on the site</span></h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="Project value (₹)"><input type="number" name="amount" defaultValue={pp?.amount ?? 0} className={inputCls} /></Field>
            <Field label="Received (₹)"><input type="number" name="received" defaultValue={pp?.received ?? 0} className={inputCls} /></Field>
            <Field label="Payment status">
              <select name="payment_status" defaultValue={pp?.payment_status ?? "pending"} className={inputCls}>
                <option value="pending">Pending</option>
                <option value="advance">Advance paid</option>
                <option value="settled">Settled</option>
                <option value="na">Not applicable</option>
              </select>
            </Field>
          </div>
          <Field label="Notes" className="mt-4"><textarea name="notes" rows={3} defaultValue={pp?.notes ?? ""} className={inputCls} /></Field>
        </section>

        <section className="rounded-[1.75rem] bg-paper p-6 ring-1 ring-line">
          <h2 className="font-serif text-xl">On the website</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Title"><input name="title" required defaultValue={p?.title ?? ""} className={inputCls} /></Field>
            <Field label="Kind" hint="e.g. Hotel & banquet, Travel, E-commerce"><input name="kind" defaultValue={p?.kind ?? ""} className={inputCls} /></Field>
            <Field label="Filter category">
              <select name="category" defaultValue={p?.category ?? "web"} className={inputCls}>
                {categories.filter((c) => c.id !== "all").map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Live link"><input name="live_url" defaultValue={p?.live_url ?? ""} className={inputCls} placeholder="https://" /></Field>
            <Field label="Tech stack" hint="Comma separated, e.g. Next.js, Tailwind"><input name="stack" defaultValue={p?.stack?.join(", ") ?? ""} className={inputCls} /></Field>
            <Field label="Order" hint="Lower numbers show first"><input type="number" name="sort" defaultValue={p?.sort ?? 0} className={inputCls} /></Field>
          </div>
          <Field label="One-line summary" className="mt-4"><textarea name="summary" rows={2} defaultValue={p?.summary ?? ""} className={inputCls} /></Field>
          <div className="mt-4">
            <ImageField name="image_url" label="Screenshot" defaultValue={p?.image_url ?? ""} folder="projects" />
          </div>
          <div className="mt-5 flex flex-wrap gap-6">
            <Toggle name="published" defaultChecked={p?.published ?? false} label="Show on Work page" />
            <Toggle name="featured" defaultChecked={p?.featured ?? false} label="Feature on Home page" />
            <label className="flex items-center gap-2 text-[14px]">
              <input type="checkbox" name="status" value="in-progress" defaultChecked={p?.status === "in-progress"} className="h-4 w-4 accent-[#6fb596]" />
              Show “In progress” badge
            </label>
          </div>
        </section>

        <div className="flex items-center justify-between">
          <SubmitButton>{isNew ? "Create project" : "Save changes"}</SubmitButton>
        </div>
      </form>

      {!isNew && (
        <form action={deleteProject} className="mt-6">
          <input type="hidden" name="id" value={p!.id} />
          <DangerButton>Delete project</DangerButton>
        </form>
      )}
    </>
  );
}
