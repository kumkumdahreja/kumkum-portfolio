"use client";

import { useFormStatus } from "react-dom";
import { useRef, useState, useTransition } from "react";
import { uploadFile } from "@/app/admin/actions";
import { asset } from "@/lib/asset";

export const inputCls =
  "w-full rounded-2xl border border-line bg-paper px-4 py-2.5 text-[14px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-blush-deep";

export function Field({ label, hint, children, className = "" }: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[12px] font-medium text-ink-soft">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-muted">{hint}</span>}
    </label>
  );
}

export function Toggle({ name, defaultChecked, label }: { name: string; defaultChecked?: boolean; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-[14px]">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative h-6 w-11 rounded-full bg-line transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-paper after:shadow after:transition-transform peer-checked:bg-mint-deep peer-checked:after:translate-x-5" />
      {label}
    </label>
  );
}

export function SubmitButton({ children = "Save", className = "" }: { children?: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className={`rounded-full bg-ink px-6 py-3 text-[14px] font-medium text-cream transition-transform hover:-translate-y-0.5 disabled:opacity-60 ${className}`}
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

export function DangerButton({ children = "Delete", confirmText = "Delete this? This can't be undone." }: { children?: React.ReactNode; confirmText?: string }) {
  return (
    <button
      className="rounded-full px-4 py-2 text-[13px] text-rose ring-1 ring-blush-deep/60 transition-colors hover:bg-blush"
      onClick={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

/** Text input for an image/file URL with an Upload button and preview. */
export function ImageField({ name, label, defaultValue = "", folder = "uploads", accept = "image/*" }: { name: string; label: string; defaultValue?: string; folder?: string; accept?: string }) {
  const [url, setUrl] = useState(defaultValue);
  return (
    <Field label={label}>
      <div className="flex items-start gap-3">
        {url && /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(url) && (
          <img src={asset(url)} alt="" className="h-16 w-24 shrink-0 rounded-xl object-cover ring-1 ring-line" />
        )}
        <div className="flex-1 space-y-2">
          <input name={name} value={url} onChange={(e) => setUrl(e.target.value)} className={inputCls} placeholder="/images/... or https://..." />
          <UploadButton folder={folder} accept={accept} onUploaded={setUrl} />
        </div>
      </div>
    </Field>
  );
}

export function UploadButton({ onUploaded, folder = "uploads", accept = "image/*", label = "Upload file" }: { onUploaded: (url: string) => void; folder?: string; accept?: string; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");
  return (
    <span className="inline-flex items-center gap-2">
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const fd = new FormData();
          fd.append("file", f);
          fd.append("folder", folder);
          setErr("");
          start(async () => {
            const res = await uploadFile(fd);
            if (res.url) onUploaded(res.url);
            else setErr(res.error || "Upload failed");
          });
          e.target.value = "";
        }}
      />
      <button type="button" onClick={() => ref.current?.click()} className="rounded-full bg-butter px-3.5 py-1.5 text-[12px] transition-transform hover:-translate-y-0.5">
        {pending ? "Uploading…" : label}
      </button>
      {err && <span className="text-[12px] text-rose">{err}</span>}
    </span>
  );
}

export function Banner({ children, tone = "bg-mint" }: { children: React.ReactNode; tone?: string }) {
  return <div className={`mb-6 rounded-2xl px-5 py-3 text-[14px] ${tone}`}>{children}</div>;
}
