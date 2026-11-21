"use client";

import { motion } from "motion/react";
import { useOptimistic, useState, useTransition } from "react";
import { markDealPaid, setDealStatus, toggleDeliverable } from "@/app/admin/actions";
import { dealStatuses, deliverablePresets, type DealStatus, type Deliverable } from "@/lib/admin";
import { inputCls } from "./Fields";

/** Editable deliverables list for the deal form (serialised into a hidden input). */
export function DeliverablesEditor({ initial }: { initial: Deliverable[] }) {
  const [list, setList] = useState<Deliverable[]>(initial.length ? initial : [{ label: "Reel", done: false }, { label: "Story", done: false }]);
  const [custom, setCustom] = useState("");
  const add = (label: string) => label.trim() && setList((l) => [...l, { label: label.trim(), done: false }]);
  return (
    <div>
      <input type="hidden" name="deliverables" value={JSON.stringify(list)} />
      <ul className="space-y-2">
        {list.map((d, i) => (
          <li key={i} className="flex items-center gap-3 rounded-2xl bg-paper px-4 py-2.5 ring-1 ring-line">
            <input
              type="checkbox"
              checked={d.done}
              onChange={() => setList((l) => l.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))}
              className="h-4 w-4 accent-[#6fb596]"
            />
            <input
              value={d.label}
              onChange={(e) => setList((l) => l.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
              className={`flex-1 bg-transparent text-[14px] outline-none ${d.done ? "text-muted line-through" : ""}`}
            />
            <button type="button" onClick={() => setList((l) => l.filter((_, j) => j !== i))} className="text-[13px] text-muted hover:text-rose" aria-label="Remove">
              ✕
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {deliverablePresets.map((p) => (
          <button key={p} type="button" onClick={() => add(p)} className="rounded-full bg-lavender px-3 py-1 text-[12px] transition-transform hover:-translate-y-0.5">
            + {p}
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Something else…" className={inputCls} />
        <button type="button" onClick={() => { add(custom); setCustom(""); }} className="rounded-full bg-paper px-4 text-[13px] ring-1 ring-line">
          Add
        </button>
      </div>
    </div>
  );
}

/** Tick deliverables straight from the tracker list. */
export function QuickDeliverables({ dealId, items }: { dealId: string; items: Deliverable[] }) {
  const [, start] = useTransition();
  const [optimistic, flip] = useOptimistic(items, (state: Deliverable[], i: number) => state.map((d, j) => (j === i ? { ...d, done: !d.done } : d)));
  const done = optimistic.filter((d) => d.done).length;
  return (
    <div>
      <div className="mb-2 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.06]">
          <motion.div className="h-full rounded-full bg-mint-deep" animate={{ width: `${optimistic.length ? (done / optimistic.length) * 100 : 0}%` }} />
        </div>
        <span className="text-[12px] text-muted">
          {done}/{optimistic.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {optimistic.map((d, i) => (
          <button
            key={i}
            onClick={() => start(async () => { flip(i); await toggleDeliverable(dealId, i); })}
            className={`rounded-full px-3 py-1 text-[12px] transition-colors ${d.done ? "bg-mint text-ink-soft line-through" : "bg-paper text-ink ring-1 ring-line hover:bg-blush"}`}
          >
            {d.done ? "✓ " : ""}
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MarkPaidButton({ dealId }: { dealId: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => start(() => markDealPaid(dealId))}
      className="rounded-full bg-butter px-3 py-1 text-[12px] transition-transform hover:-translate-y-0.5"
    >
      {pending ? "Saving…" : "Mark paid ✓"}
    </button>
  );
}

export function StatusSelect({ dealId, value }: { dealId: string; value: DealStatus }) {
  const [pending, start] = useTransition();
  const tone = dealStatuses.find((s) => s.id === value)?.tone ?? "bg-line";
  return (
    <select
      defaultValue={value}
      disabled={pending}
      onChange={(e) => start(() => setDealStatus(dealId, e.target.value))}
      className={`rounded-full px-3 py-1 text-[12px] outline-none ${tone}`}
    >
      {dealStatuses.map((s) => (
        <option key={s.id} value={s.id}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
