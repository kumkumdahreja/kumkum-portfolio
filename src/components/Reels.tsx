"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { reelUrl, type CollabCategory, type Reel } from "@/data/collabs";
import { asset } from "@/lib/asset";

const tabs: { id: CollabCategory; label: string; tone: string }[] = [
  { id: "cafe", label: "Cafés", tone: "bg-blush" },
  { id: "brand", label: "Brands", tone: "bg-lavender" },
  { id: "modelling", label: "Modelling", tone: "bg-butter" },
  { id: "ugc", label: "UGC", tone: "bg-mint" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function ReelsShowcase({ reels }: { reels: Reel[] }) {
  const [tab, setTab] = useState<CollabCategory>("cafe");
  const [open, setOpen] = useState<Reel | null>(null);
  const list = reels.filter((r) => r.category === tab);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="no-print no-scrollbar -mx-5 mb-8 overflow-x-auto px-5">
        <div className="inline-flex gap-1 rounded-full border border-line bg-paper/70 p-1 backdrop-blur" role="tablist" aria-label="Reel categories">
          {tabs.filter((t) => reels.some((r) => r.category === t.id)).map((t) => {
            const on = tab === t.id;
            const count = reels.filter((r) => r.category === t.id).length;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={on}
                onClick={() => setTab(t.id)}
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-[14px] transition-colors ${on ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                {on && (
                  <motion.span
                    layoutId="reel-tab"
                    className={`absolute inset-0 -z-10 rounded-full ${t.tone}`}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {t.label}
                <span className="ml-1.5 text-[12px] text-muted">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.ul layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 print:grid-cols-4 print:gap-2">
        <AnimatePresence mode="popLayout">
          {list.map((r, i) => (
            <motion.li
              key={r.id}
              layout
              initial={{ opacity: 0, y: 30, rotate: i % 2 ? 2 : -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.55, ease, delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpen(r)}
                className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[1.5rem] bg-paper text-left ring-1 ring-line"
                aria-label={`Play ${r.partner} reel`}
              >
                {r.thumb === "" ? (
                  <span className="block h-full w-full bg-gradient-to-br from-blush via-lavender to-mint" />
                ) : (
                  <img
                    src={asset(r.thumb ?? `/images/reels/${r.id}.jpg`)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0" />
                <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper/85 shadow-lg backdrop-blur transition-transform duration-500 group-hover:scale-110">
                  <span className="absolute inset-0 animate-ping rounded-full bg-paper/50 [animation-duration:2.2s]" />
                  <svg width="18" height="18" viewBox="0 0 24 24" className="relative ml-0.5 fill-rose">
                    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
                  </svg>
                </span>
                <span className="absolute inset-x-0 bottom-0 p-4 text-cream">
                  <span className="block font-serif text-[17px] leading-tight">{r.partner}</span>
                  {r.note && <span className="text-[12px] text-cream/75">{r.note}</span>}
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {open && (
          <motion.div
            className="no-print fixed inset-0 z-[90] grid place-items-center bg-ink/50 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${open.partner} reel`}
          >
            <motion.div
              className="relative w-full max-w-[400px] overflow-hidden rounded-[1.75rem] bg-paper shadow-2xl"
              initial={{ y: 40, scale: 0.94, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-serif text-lg leading-tight">{open.partner}</p>
                  {open.note && <p className="text-[12px] text-muted">{open.note}</p>}
                </div>
                <button
                  onClick={() => setOpen(null)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-blush text-lg"
                  aria-label="Close"
                  autoFocus
                >
                  ×
                </button>
              </div>
              <iframe
                src={`${reelUrl(open.id)}embed/`}
                title={`${open.partner} reel on Instagram`}
                className="block h-[min(70vh,640px)] w-full border-0 bg-cream"
                allow="autoplay; encrypted-media; picture-in-picture"
                loading="lazy"
              />
              <a
                href={reelUrl(open.id)}
                target="_blank"
                rel="noopener"
                className="flex items-center justify-between px-5 py-3 text-[14px] hover:text-rose"
              >
                Open in Instagram <span>↗</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
