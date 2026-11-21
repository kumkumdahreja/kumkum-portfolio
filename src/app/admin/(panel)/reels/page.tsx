import { createClient } from "@/lib/supabase/server";
import { categoryLabels, type ReelRow } from "@/lib/admin";
import { asset } from "@/lib/asset";
import { addReel, deleteReel, updateReel } from "../../actions";
import { Banner, Field, inputCls, SubmitButton } from "@/components/admin/Fields";

export default async function ReelsAdmin({ searchParams }: { searchParams: Promise<{ added?: string; error?: string }> }) {
  const { added, error } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("reels").select("*").order("category").order("sort");
  const reels = (data ?? []) as ReelRow[];

  return (
    <>
      <p className="label">Reels</p>
      <h1 className="display mt-2 text-[clamp(2rem,4vw,3rem)]">
        Featured <em>reels.</em>
      </h1>
      <p className="mt-2 text-[14px] text-muted">Shown in “Tap to watch” on the media kit. Paste a link and the cover is fetched for you.</p>

      {added === "1" && <Banner>Reel added with its cover ✓</Banner>}
      {added === "nocover" && <Banner tone="bg-butter">Reel added, but Instagram didn&apos;t share the cover. Upload one below.</Banner>}
      {error && <Banner tone="bg-blush">That doesn&apos;t look like an Instagram reel link.</Banner>}

      <form action={addReel} className="mt-8 grid gap-4 rounded-[1.75rem] bg-paper p-6 ring-1 ring-line sm:grid-cols-2">
        <Field label="Instagram reel link" className="sm:col-span-2">
          <input name="link" required placeholder="https://www.instagram.com/reel/…" className={inputCls} />
        </Field>
        <Field label="Partner name"><input name="partner" required placeholder="e.g. Rowdy Cafe" className={inputCls} /></Field>
        <Field label="Tab">
          <select name="category" className={inputCls}>
            {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>
        <Field label="Small note" hint="City or product, e.g. Vrindavan"><input name="note" className={inputCls} /></Field>
        <Field label="Cover image (optional)"><input type="file" name="thumb" accept="image/*" className="text-[13px]" /></Field>
        <div className="sm:col-span-2"><SubmitButton>Add reel</SubmitButton></div>
      </form>

      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {reels.map((r) => (
          <li key={r.id} className="overflow-hidden rounded-[1.5rem] bg-paper ring-1 ring-line">
            <div className="aspect-[9/12] bg-cream">
              {r.thumb_url ? (
                <img src={asset(r.thumb_url)} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center p-4 text-center text-[13px] text-muted">No cover yet</div>
              )}
            </div>
            <form action={updateReel} className="space-y-2 p-3">
              <input type="hidden" name="id" value={r.id} />
              <input name="partner" defaultValue={r.partner} className={`${inputCls} py-1.5 text-[13px]`} />
              <input name="note" defaultValue={r.note} placeholder="Note" className={`${inputCls} py-1.5 text-[13px]`} />
              <div className="flex gap-2">
                <select name="category" defaultValue={r.category} className={`${inputCls} py-1.5 text-[12px]`}>
                  {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <input type="number" name="sort" defaultValue={r.sort} title="Order" className={`${inputCls} w-16 py-1.5 text-[12px]`} />
              </div>
              <label className="flex items-center gap-2 text-[12px]">
                <input type="checkbox" name="featured" defaultChecked={r.featured} className="accent-[#6fb596]" /> Show on media kit
              </label>
              <input type="file" name="thumb" accept="image/*" className="w-full text-[11px]" />
              <div className="flex items-center justify-between">
                <SubmitButton className="!px-4 !py-1.5 !text-[12px]">Save</SubmitButton>
                <a href={`https://www.instagram.com/reel/${r.code}/`} target="_blank" className="text-[12px] text-muted hover:text-rose">Open ↗</a>
              </div>
            </form>
            <form action={deleteReel} className="px-3 pb-3">
              <input type="hidden" name="id" value={r.id} />
              <button className="text-[12px] text-muted hover:text-rose">Remove</button>
            </form>
          </li>
        ))}
      </ul>
    </>
  );
}
