"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { introDelay } from "./Effects";

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- Draggable polaroid pile ---------- */
type Polaroid = { src: string; caption: string; x: number; y: number; r: number };

export function Polaroids({ items }: { items: Polaroid[] }) {
  const area = useRef<HTMLDivElement>(null);
  const [d] = useState(() => introDelay());
  return (
    <div ref={area} className="relative mx-auto h-[26rem] w-full max-w-md sm:h-[30rem]">
      {items.map((p, i) => (
        <motion.figure
          key={p.src}
          drag
          dragConstraints={area}
          dragElastic={0.15}
          whileHover={{ scale: 1.04, rotate: 0, zIndex: 30 }}
          whileDrag={{ scale: 1.08, rotate: 0, zIndex: 40, cursor: "grabbing" }}
          initial={{ opacity: 0, y: 80, rotate: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, rotate: p.r, scale: 1 }}
          transition={{ type: "spring", stiffness: 110, damping: 14, delay: d + 0.3 + i * 0.15 }}
          className="absolute w-[var(--pw)] cursor-grab rounded-md bg-paper p-2.5 pb-9 shadow-[0_18px_40px_-14px_rgba(43,37,35,0.35)] [--pw:10.5rem] sm:[--pw:12.5rem] lg:[--pw:13.5rem]"
          style={{ left: `clamp(0px, ${p.x}%, calc(100% - var(--pw) - 12px))`, top: `${p.y}%`, zIndex: 10 + i }}
        >
          <img src={asset(p.src)} alt={p.caption} draggable={false} className="aspect-[4/5] w-full rounded-sm object-cover" />
          <figcaption className="absolute inset-x-0 bottom-2 text-center font-serif text-[15px] italic text-ink-soft">
            {p.caption}
          </figcaption>
          <span className="absolute -top-2.5 left-1/2 h-5 w-14 -translate-x-1/2 rotate-[-3deg] rounded-sm bg-butter/80" />
        </motion.figure>
      ))}
      <motion.p
        className="absolute -bottom-2 right-2 font-serif text-[15px] italic text-muted"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        drag us around ✦
      </motion.p>
    </div>
  );
}

/* ---------- Floating little tags ---------- */
export function FloatChips({ chips }: { chips: { label: string; tone: string }[] }) {
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {chips.map((c, i) => (
        <motion.span
          key={c.label}
          className={`rounded-full px-3.5 py-1.5 text-[13px] text-ink-soft ${c.tone}`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
          transition={{
            opacity: { delay: 0.8 + i * 0.08 },
            scale: { type: "spring", stiffness: 200, damping: 12, delay: 0.8 + i * 0.08 },
            y: { duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
          }}
        >
          {c.label}
        </motion.span>
      ))}
    </div>
  );
}

/* ---------- Timeline that draws itself on scroll ---------- */
type Job = { role: string; org: string; period: string; points?: string[] };

export function Timeline({ items }: { items: Job[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <div ref={ref} className="relative">
      <div className="absolute bottom-0 left-4 top-0 w-px bg-line md:left-1/2" />
      <motion.div
        style={{ scaleY }}
        className="absolute bottom-0 left-4 top-0 w-[2px] origin-top bg-gradient-to-b from-blush-deep via-lavender-deep to-mint-deep md:left-1/2 md:-translate-x-[0.5px]"
      />
      <ul className="space-y-10">
        {items.map((it, i) => {
          const right = i % 2 === 1;
          const current = i === 0;
          return (
            <li key={i} className="relative md:grid md:grid-cols-2 md:gap-14">
              <span className="absolute left-4 top-6 z-10 -translate-x-1/2 md:left-1/2">
                {current && <span className="absolute inset-0 animate-ping rounded-full bg-mint-deep/60" />}
                <span className={`relative block h-3.5 w-3.5 rounded-full ring-4 ring-cream ${current ? "bg-mint-deep" : "bg-blush-deep"}`} />
              </span>
              <motion.div
                initial={{ opacity: 0, x: right ? 40 : -40, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease }}
                className={`ml-10 md:ml-0 ${right ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}
              >
                <div className={`inline-block w-full rounded-[1.5rem] p-6 text-left ${current ? "bg-mint" : "bg-paper ring-1 ring-line"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-muted">{it.period}</span>
                    {current && <span className="rounded-full bg-paper/80 px-2.5 py-0.5 text-[12px] text-ink-soft">Current</span>}
                  </div>
                  <h3 className="mt-2 font-serif text-[22px] leading-tight">{it.role}</h3>
                  <p className="text-[14px] text-rose">{it.org}</p>
                  {it.points?.length ? (
                    <ul className="mt-3 space-y-1 text-[14px] text-ink-soft">
                      {it.points.map((p) => (
                        <li key={p} className="flex gap-2">
                          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-blush-deep" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </motion.div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- Photo bento with gentle parallax ---------- */
type Tile = { src: string; caption: string; className: string };

function ParallaxTile({ t, i }: { t: Tile; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease, delay: (i % 3) * 0.08 }}
      className={`group relative overflow-hidden rounded-[1.5rem] bg-paper ${t.className}`}
    >
      <motion.img
        src={asset(t.src)}
        alt={t.caption}
        loading="lazy"
        style={{ y }}
        className="absolute inset-x-0 top-[-8%] h-[116%] w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
      <span className="absolute bottom-3 left-4 font-serif text-[17px] italic text-cream">{t.caption}</span>
    </motion.div>
  );
}

export function PhotoBento({ tiles }: { tiles: Tile[] }) {
  return (
    <div className="grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] md:grid-cols-4 md:gap-4">
      {tiles.map((t, i) => (
        <ParallaxTile key={t.src} t={t} i={i} />
      ))}
    </div>
  );
}
