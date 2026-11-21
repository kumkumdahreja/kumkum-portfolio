import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { categoryLabels, dealStatuses, dealTypes, type CollabRow, type DealRow } from "@/lib/admin";
import { deleteDeal, saveDeal } from "../../../actions";
import { DangerButton, Field, inputCls, SubmitButton, Toggle } from "@/components/admin/Fields";
import { DeliverablesEditor } from "@/components/admin/DealBits";

export default async function EditDeal({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ collab?: string }> }) {
  const { id } = await params;
  const { collab } = await searchParams;
  const isNew = id === "new";
  const supabase = await createClient();
  const { data: collabsData } = await supabase.from("collabs").select("id,name,category").order("name");
  const collabs = (collabsData ?? []) as CollabRow[];

  let d: DealRow | null = null;
  if (!isNew) {
    const { data } = await supabase.from("deals").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    d = data as DealRow;
  }

  return (
    <>
      <Link href="/admin/deals" className="text-[13px] text-muted hover:text-rose">← Collab tracker</Link>
      <h1 className="display mt-2 text-[clamp(2rem,4vw,3rem)]">{isNew ? <>New <em>collab.</em></> : <>Edit <em>collab.</em></>}</h1>

      <form action={saveDeal} className="mt-8 space-y-6">
        <input type="hidden" name="id" value={d?.id ?? ""} />

        <section className="rounded-[1.75rem] bg-paper p-6 ring-1 ring-line">
          <h2 className="font-serif text-xl">Who &amp; what</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Brand / café">
              <select name="collab_id" defaultValue={d?.collab_id ?? collab ?? ""} className={inputCls}>
                <option value="">— choose —</option>
                {collabs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {categoryLabels[c.category]}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Field label="…or a new one">
                <input name="new_brand" placeholder="New brand or café name" className={inputCls} />
              </Field>
              <Field label="Type">
                <select name="new_brand_category" className={inputCls}>
                  {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Campaign name" hint="Optional, e.g. Navratri menu, Diwali gifting">
              <input name="title" defaultValue={d?.title ?? ""} className={inputCls} />
            </Field>
            <Field label="Deal type">
              <select name="deal_type" defaultValue={d?.deal_type ?? "barter"} className={inputCls}>
                {dealTypes.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select name="status" defaultValue={d?.status ?? "planned"} className={inputCls}>
                {dealStatuses.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </Field>
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-paper p-6 ring-1 ring-line">
          <h2 className="font-serif text-xl">Deliverables</h2>
          <div className="mt-4">
            <DeliverablesEditor initial={d?.deliverables ?? []} />
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Field label="Shoot / visit date"><input type="date" name="shoot_date" defaultValue={d?.shoot_date ?? ""} className={inputCls} /></Field>
            <Field label="Post by"><input type="date" name="due_date" defaultValue={d?.due_date ?? ""} className={inputCls} /></Field>
            <Field label="Posted on"><input type="date" name="posted_date" defaultValue={d?.posted_date ?? ""} className={inputCls} /></Field>
            <Field label="Post / reel link" className="sm:col-span-2"><input name="post_url" defaultValue={d?.post_url ?? ""} className={inputCls} /></Field>
            <Field label="Views"><input type="number" name="views" defaultValue={d?.views ?? ""} className={inputCls} /></Field>
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-paper p-6 ring-1 ring-line">
          <h2 className="font-serif text-xl">Payment <span className="font-sans text-[12px] text-muted">· private</span></h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="Agreed amount (₹)" hint="Leave 0 for barter"><input type="number" name="amount" defaultValue={d?.amount ?? 0} className={inputCls} /></Field>
            <Field label="Received (₹)"><input type="number" name="received" defaultValue={d?.received ?? 0} className={inputCls} /></Field>
            <div className="flex items-end pb-2"><Toggle name="invoice_sent" defaultChecked={d?.invoice_sent} label="Invoice sent" /></div>
            <Field label="Barter: what you got" className="sm:col-span-2"><input name="barter_details" defaultValue={d?.barter_details ?? ""} placeholder="e.g. Dinner for 2, product kit" className={inputCls} /></Field>
            <Field label="Barter value (₹)"><input type="number" name="barter_value" defaultValue={d?.barter_value ?? 0} className={inputCls} /></Field>
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-paper p-6 ring-1 ring-line">
          <h2 className="font-serif text-xl">Contact &amp; notes <span className="font-sans text-[12px] text-muted">· private</span></h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Contact person"><input name="contact_name" defaultValue={d?.contact_name ?? ""} className={inputCls} /></Field>
            <Field label="Phone / WhatsApp"><input name="contact_phone" defaultValue={d?.contact_phone ?? ""} className={inputCls} /></Field>
          </div>
          <Field label="Notes" className="mt-4"><textarea name="notes" rows={3} defaultValue={d?.notes ?? ""} className={inputCls} /></Field>
        </section>

        <SubmitButton>{isNew ? "Add collab" : "Save changes"}</SubmitButton>
      </form>

      {!isNew && (
        <form action={deleteDeal} className="mt-6">
          <input type="hidden" name="id" value={d!.id} />
          <DangerButton>Delete this collab</DangerButton>
        </form>
      )}
    </>
  );
}
