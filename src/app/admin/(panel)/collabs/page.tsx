import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { categoryLabels, type CollabRow } from "@/lib/admin";
import { deleteCollab, saveCollab } from "../../actions";
import { inputCls, SubmitButton } from "@/components/admin/Fields";
import { VisibleToggle } from "@/components/admin/PublishToggle";

export default async function CollabsAdmin() {
  const supabase = await createClient();
  const [{ data }, { data: dealCounts }] = await Promise.all([
    supabase.from("collabs").select("*").order("category").order("sort").order("name"),
    supabase.from("deals").select("collab_id"),
  ]);
  const collabs = (data ?? []) as CollabRow[];
  const count = (id: string) => (dealCounts ?? []).filter((d) => d.collab_id === id).length;

  return (
    <>
      <p className="label">Brands &amp; cafés</p>
      <h1 className="display mt-2 text-[clamp(2rem,4vw,3rem)]">
        The <em>names wall.</em>
      </h1>
      <p className="mt-2 text-[14px] text-muted">These names appear on the media kit and Home. Hide any you don&apos;t want shown.</p>

      <form action={saveCollab} className="mt-8 flex flex-wrap items-end gap-3 rounded-[1.5rem] bg-paper p-5 ring-1 ring-line">
        <label className="min-w-[14rem] flex-1">
          <span className="mb-1.5 block text-[12px] font-medium text-ink-soft">Add a brand or café</span>
          <input name="name" required placeholder="e.g. Blue Tokai" className={inputCls} />
        </label>
        <select name="category" className={`${inputCls} w-auto`}>
          {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <SubmitButton>Add</SubmitButton>
      </form>

      {(Object.keys(categoryLabels) as CollabRow["category"][]).map((cat) => {
        const list = collabs.filter((c) => c.category === cat);
        if (!list.length) return null;
        return (
          <section key={cat} className="mt-10">
            <h2 className="font-serif text-xl">
              {categoryLabels[cat]} <span className="font-sans text-[13px] text-muted">{list.length}</span>
            </h2>
            <ul className="mt-3 divide-y divide-line rounded-[1.5rem] bg-paper ring-1 ring-line">
              {list.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                  <span className="min-w-[10rem] flex-1 text-[15px]">{c.name}</span>
                  {count(c.id) > 0 ? (
                    <span className="rounded-full bg-lavender px-2.5 py-0.5 text-[12px]">
                      {count(c.id)} collab{count(c.id) > 1 ? "s" : ""}
                      {count(c.id) > 1 ? " · repeat" : ""}
                    </span>
                  ) : null}
                  <Link href={`/admin/deals/new?collab=${c.id}`} className="text-[12px] text-muted hover:text-rose">+ deal</Link>
                  <VisibleToggle id={c.id} visible={c.show_on_site} />
                  <form action={deleteCollab}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className="text-[12px] text-muted hover:text-rose" title="Delete">✕</button>
                  </form>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}
