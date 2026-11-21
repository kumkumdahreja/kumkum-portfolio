"use client";

import Link from "next/link";
import { AnimatePresence, motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { introDelay } from "./Effects";
import { asset } from "@/lib/asset";

/* ---------- Buttons ---------- */
export function Button({
  href,
  children,
  variant = "dark",
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "soft";
  external?: boolean;
}) {
  const cls =
    variant === "dark"
      ? "bg-ink text-cream"
      : "bg-paper text-ink border border-line";
  const inner = (
    <Magnetic>
    <motion.span
      whileTap={{ scale: 0.95 }}
      className={`group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium ${cls}`}
    >
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
    </motion.span>
    </Magnetic>
  );
  if (external || href.startsWith("mailto:") || href.startsWith("http"))
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener">
        {inner}
      </a>
    );
  return <Link href={href}>{inner}</Link>;
}

/* ---------- Magnetic wrapper: follows the cursor a little ---------- */
export function Magnetic({ children, strength = 0.25 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 15 });
  const y = useSpring(0, { stiffness: 220, damping: 15 });
  return (
    <motion.span
      ref={ref}
      className="inline-block"
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/* ---------- Section heading ---------- */
export function SectionHead({ label, title, children }: { label: string; title: React.ReactNode; children?: React.ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="label">{label}</p>
        <h2 ref={ref} className={`display mt-3 text-[clamp(2rem,4.4vw,3.3rem)] ${inView ? "hl-on" : ""}`}>{title}</h2>
      </motion.div>
      {children && <div className="max-w-sm text-[14px] text-ink-soft">{children}</div>}
    </div>
  );
}

/* ---------- Copy email ---------- */
export function CopyEmail({ dark = false, email }: { dark?: boolean; email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      /* clipboard blocked: user can still use the mailto link */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button
      onClick={copy}
      className={`relative overflow-hidden rounded-full border px-5 py-3 text-sm transition-colors ${
        dark ? "border-cream/20 text-cream hover:border-cream/50" : "border-line bg-paper text-ink hover:border-ink/30"
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "y" : "n"}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="block"
        >
          {copied ? "Copied ✓" : "Copy email"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/* ---------- Print / PDF ---------- */
export function PrintButton() {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-full border border-line bg-paper px-5 py-3 text-[13px]"
    >
      Save as PDF <span>↓</span>
    </motion.button>
  );
}

/* ---------- Marquee ---------- */
export function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={hidden}>
      {items.map((it, i) => (
        <li
          key={i}
          className="whitespace-nowrap rounded-full border border-line bg-paper/70 px-4 py-2 text-[13px] text-ink-soft"
        >
          {it}
        </li>
      ))}
    </ul>
  );
  return (
    <>
    <ul className="hidden flex-wrap gap-1.5 px-5 print:flex">
      {items.map((it, i) => (
        <li key={i} className="rounded-full border border-line px-3 py-1 text-[11px] text-ink-soft">{it}</li>
      ))}
    </ul>
    <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)] print:hidden">
      <div
        className={`animate-marquee flex w-max group-hover:[animation-play-state:paused] ${
          reverse ? "[animation-direction:reverse]" : ""
        }`}
      >
        {row()}
        {row(true)}
      </div>
    </div>
    </>
  );
}

/* ---------- Tilt card (subtle 3D on hover) ---------- */
export function Tilt({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-5, 5]), { stiffness: 200, damping: 20 });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Fanned photo stack ---------- */
export function PhotoStack({ main, side, badge }: { main: string; side: string[]; badge?: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  const [d] = useState(() => introDelay());
  const [spread, setSpread] = useState(0.55);
  useEffect(() => {
    const fit = () => setSpread(window.innerWidth < 640 ? 0.3 : window.innerWidth < 1024 ? 0.4 : 0.55);
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  const spots = [
    { x: -150, y: 40, r: -10 },
    { x: 150, y: 70, r: 9 },
  ];
  return (
    <div
      className="relative mx-auto aspect-[4/5] w-full max-w-[22rem]"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      {side.slice(0, 2).map((src, i) => (
        <motion.img
          key={src}
          src={asset(src)}
          alt=""
          className="absolute inset-0 m-auto h-[70%] w-[62%] rounded-3xl object-cover shadow-xl ring-4 ring-paper"
          initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: 1,
            x: hover && spread > 0.5 ? spots[i].x * 1.15 : spots[i].x * spread,
            y: spots[i].y,
            rotate: hover ? spots[i].r * 1.4 : spots[i].r,
          }}
          transition={{ type: "spring", stiffness: 120, damping: 16, delay: hover ? 0 : d + 0.5 + i * 0.1 }}
        />
      ))}
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-[2rem] shadow-2xl ring-4 ring-paper"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: hover ? 1.02 : 1, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.8, delay: d },
          scale: { type: "spring", stiffness: 150, damping: 18 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <img src={asset(main)} alt="Kumkum Dahreja" fetchPriority="high" className="h-full w-full object-cover" />
      </motion.div>
      {badge && <div className="absolute -bottom-8 -left-8 z-10 sm:-left-12">{badge}</div>}
    </div>
  );
}

/* ---------- Draggable photo strip ---------- */
export function Gallery({ photos }: { photos: { src: string; alt: string }[] }) {
  const track = useRef<HTMLDivElement>(null);
  return (
    <div ref={track} className="overflow-hidden">
      <motion.ul
        drag="x"
        dragConstraints={track}
        dragElastic={0.08}
        className="flex w-max cursor-grab items-start gap-4 active:cursor-grabbing"
      >
        {photos.map((p, i) => (
          <motion.li
            key={p.src}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.7 }}
            className={`overflow-hidden rounded-3xl ${i % 2 ? "mt-10" : ""}`}
          >
            <img
              src={asset(p.src)}
              alt={`Kumkum Dahreja: ${p.alt}`}
              draggable={false}
              loading="lazy"
              className="h-72 w-56 object-cover transition-transform duration-700 hover:scale-105 sm:h-80 sm:w-60"
            />
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
