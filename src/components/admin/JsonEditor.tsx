"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, useTransition } from "react";
import { asset } from "@/lib/asset";
import { inputCls, UploadButton } from "./Fields";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
type Path = (string | number)[];

const humanize = (k: string) =>
  k
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());

const isFileKey = (k: string) => /(url|src|image|file|hero|kit)$/i.test(k);
const isLongKey = (k: string) => /(bio|summary|highlight|description|notes)$/i.test(k);

function setIn(obj: Json, path: Path, value: Json): Json {
  if (!path.length) return value;
  const [h, ...rest] = path;
  if (Array.isArray(obj)) {
    const copy = obj.slice();
    copy[h as number] = setIn(copy[h as number], rest, value);
    return copy;
  }
  const o = (obj ?? {}) as { [k: string]: Json };
  return { ...o, [h]: setIn(o[h as string], rest, value) };
}

function blankLike(v: Json): Json {
  if (typeof v === "string") return "";
  if (typeof v === "number") return 0;
  if (typeof v === "boolean") return false;
  if (Array.isArray(v)) return [];
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blankLike(x)]));
  return "";
}

/** Generic editor: renders a form for any JSON object and saves it with `action`. */
export function JsonEditor({
  initial,
  action,
  saveLabel = "Save changes",
  hint,
}: {
  initial: Json;
  action: (json: string) => Promise<{ ok: boolean; error?: string }>;
  saveLabel?: string;
  hint?: string;
}) {
  const [data, setData] = useState<Json>(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const update = (path: Path, v: Json) => setData((d) => setIn(d, path, v));

  return (
    <div>
      <Node value={data} path={[]} update={update} depth={0} />
      <div className="sticky bottom-4 z-10 mt-8 flex flex-wrap items-center gap-4 rounded-full bg-paper/90 p-2 pl-5 shadow-lg ring-1 ring-line backdrop-blur">
        <span className="flex-1 text-[13px] text-muted">{hint}</span>
        <AnimatePresence>
          {msg && (
            <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`text-[13px] ${msg.ok ? "text-mint-deep" : "text-rose"}`}>
              {msg.text}
            </motion.span>
          )}
        </AnimatePresence>
        <button
          disabled={pending}
          onClick={() =>
            start(async () => {
              const r = await action(JSON.stringify(data));
              setMsg(r.ok ? { ok: true, text: "Saved ✓ The website is updated." } : { ok: false, text: r.error || "Couldn't save" });
              setTimeout(() => setMsg(null), 4000);
            })
          }
          className="rounded-full bg-ink px-6 py-3 text-[14px] font-medium text-cream disabled:opacity-60"
        >
          {pending ? "Saving…" : saveLabel}
        </button>
      </div>
    </div>
  );
}

function Node({ value, path, update, depth, label }: { value: Json; path: Path; update: (p: Path, v: Json) => void; depth: number; label?: string }) {
  const key = String(path[path.length - 1] ?? "");

  // primitives
  if (typeof value === "number") {
    return (
      <Labeled label={label}>
        <input type="number" step="any" value={value} onChange={(e) => update(path, e.target.value === "" ? 0 : Number(e.target.value))} className={inputCls} />
      </Labeled>
    );
  }
  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2 text-[14px]">
        <input type="checkbox" checked={value} onChange={(e) => update(path, e.target.checked)} className="h-4 w-4 accent-[#6fb596]" />
        {label}
      </label>
    );
  }
  if (typeof value === "string" || value === null) {
    const v = value ?? "";
    if (isFileKey(key)) {
      return (
        <Labeled label={label}>
          <div className="flex items-start gap-3">
            {/\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(v) && <img src={asset(v)} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-line" />}
            <div className="flex-1 space-y-2">
              <input value={v} onChange={(e) => update(path, e.target.value)} className={inputCls} />
              <UploadButton accept={/resume|file/i.test(key) ? "application/pdf,image/*" : "image/*"} onUploaded={(u) => update(path, u)} />
            </div>
          </div>
        </Labeled>
      );
    }
    return (
      <Labeled label={label}>
        {isLongKey(key) || v.length > 90 ? (
          <textarea value={v} rows={3} onChange={(e) => update(path, e.target.value)} className={inputCls} />
        ) : (
          <input value={v} onChange={(e) => update(path, e.target.value)} className={inputCls} />
        )}
      </Labeled>
    );
  }

  // arrays of primitives → one per line
  if (Array.isArray(value) && value.every((x) => typeof x !== "object" || x === null)) {
    const numeric = value.length > 0 && value.every((x) => typeof x === "number");
    return (
      <Labeled label={label} hint="One per line">
        <textarea
          rows={Math.max(3, value.length + 1)}
          defaultValue={value.join("\n")}
          onBlur={(e) => {
            const lines = e.target.value.split("\n").map((l) => l.trim()).filter(Boolean);
            update(path, numeric ? lines.map(Number).filter((n) => !Number.isNaN(n)) : lines);
          }}
          className={inputCls}
        />
      </Labeled>
    );
  }

  // arrays of objects → cards with add/remove/reorder
  if (Array.isArray(value)) {
    return (
      <Section label={label} depth={depth}>
        <div className="space-y-3">
          {value.map((item, i) => (
            <div key={i} className="rounded-2xl bg-cream/70 p-4 ring-1 ring-line">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[12px] text-muted">#{i + 1}</span>
                <div className="flex gap-1">
                  <button type="button" disabled={i === 0} onClick={() => { const c = value.slice(); [c[i - 1], c[i]] = [c[i], c[i - 1]]; update(path, c); }} className="rounded-full px-2 text-[13px] text-muted hover:text-ink disabled:opacity-30">↑</button>
                  <button type="button" disabled={i === value.length - 1} onClick={() => { const c = value.slice(); [c[i + 1], c[i]] = [c[i], c[i + 1]]; update(path, c); }} className="rounded-full px-2 text-[13px] text-muted hover:text-ink disabled:opacity-30">↓</button>
                  <button type="button" onClick={() => confirm("Remove this item?") && update(path, value.filter((_, j) => j !== i))} className="rounded-full px-2 text-[13px] text-rose">Remove</button>
                </div>
              </div>
              <Node value={item} path={[...path, i]} update={update} depth={depth + 1} />
            </div>
          ))}
          <button
            type="button"
            onClick={() => update(path, [...value, value.length ? blankLike(value[0]) : ""])}
            className="rounded-full bg-lavender px-4 py-2 text-[13px] transition-transform hover:-translate-y-0.5"
          >
            + Add {label ? label.toLowerCase().replace(/s$/, "") : "item"}
          </button>
        </div>
      </Section>
    );
  }

  // objects
  const entries = Object.entries(value as { [k: string]: Json });
  const simple = entries.filter(([, v]) => typeof v !== "object" || v === null);
  const nested = entries.filter(([, v]) => typeof v === "object" && v !== null);
  const body = (
    <>
      {simple.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {simple.map(([k, v]) => (
            <Node key={k} value={v} path={[...path, k]} update={update} depth={depth + 1} label={humanize(k)} />
          ))}
        </div>
      )}
      {nested.map(([k, v]) => (
        <div key={k} className="mt-5">
          <Node value={v} path={[...path, k]} update={update} depth={depth + 1} label={humanize(k)} />
        </div>
      ))}
    </>
  );
  return depth === 0 || !label ? body : <Section label={label} depth={depth}>{body}</Section>;
}

function Labeled({ label, hint, children }: { label?: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-[12px] font-medium text-ink-soft">{label}</span>}
      {children}
      {hint && <span className="mt-1 block text-[11px] text-muted">{hint}</span>}
    </label>
  );
}

function Section({ label, depth, children }: { label?: string; depth: number; children: React.ReactNode }) {
  return (
    <details open={depth <= 1} className="group rounded-[1.5rem] bg-paper p-5 ring-1 ring-line">
      <summary className="flex cursor-pointer list-none items-center justify-between font-serif text-lg">
        {label}
        <span className="text-[13px] text-muted transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}
