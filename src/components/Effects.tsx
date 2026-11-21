"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Extra delay for hero animations on a fresh page load, so they play after
 * the intro curtain lifts. Client-side navigations get no delay.
 */
export const introDelay = () =>
  typeof window !== "undefined" && performance.now() < 2500 ? 1.1 : 0;

/** Short opening curtain on full page loads (pure CSS, so it never blocks). */
export function Intro() {
  return (
    <div aria-hidden className="intro no-print">
      <div className="intro-dots">
        <span className="bg-blush-deep" />
        <span className="bg-lavender-deep" />
        <span className="bg-mint-deep" />
      </div>
      <p className="intro-name font-serif">
        Kumkum<span className="text-rose">.</span>
      </p>
    </div>
  );
}

/** Thin pastel progress line at the top of the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="no-print fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-blush-deep via-lavender-deep to-mint-deep"
      style={{ scaleX }}
    />
  );
}

/** Soft pastel glow that trails the cursor (desktop only). */
export function CursorGlow() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 80, damping: 20 });
  const sy = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX - 160);
      y.set(e.clientY - 160);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      className="no-print pointer-events-none fixed left-0 top-0 z-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(231,161,167,0.22),rgba(163,151,220,0.12)_45%,transparent_70%)] blur-2xl"
      style={{ x: sx, y: sy }}
    />
  );
}

/** Drifting pastel blobs for hero backgrounds. */
export function Blobs({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`no-print pointer-events-none absolute inset-0 -z-10 ${className}`}>
      <div className="animate-blob absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-blush opacity-80 blur-3xl" />
      <div className="animate-blob absolute right-[-6rem] top-10 h-[24rem] w-[24rem] rounded-full bg-lavender opacity-80 blur-3xl [animation-delay:-6s]" />
      <div className="animate-blob absolute bottom-[-8rem] left-1/3 h-[22rem] w-[22rem] rounded-full bg-mint opacity-70 blur-3xl [animation-delay:-12s]" />
    </div>
  );
}

/* ---------- Floating decorative shapes ---------- */
type ShapeKind = "sparkle" | "ring" | "dot" | "squiggle" | "flower";
type Shape = { kind: ShapeKind; top: string; left: string; size: number; color: string; speed: number; dur: number };

function ShapeSvg({ kind, size, color }: { kind: ShapeKind; size: number; color: string }) {
  switch (kind) {
    case "sparkle":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" />
        </svg>
      );
    case "ring":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case "dot":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <circle cx="12" cy="12" r="12" />
        </svg>
      );
    case "squiggle":
      return (
        <svg width={size * 1.8} height={size} viewBox="0 0 44 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
          <path d="M2 12 Q 7 2 12 12 T 22 12 T 32 12 T 42 12" />
        </svg>
      );
    case "flower":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="12" cy="6" rx="3.6" ry="5.6" transform={`rotate(${r} 12 12)`} />
          ))}
          <circle cx="12" cy="12" r="3" fill="#fff" />
        </svg>
      );
  }
}

const presets: Record<string, Shape[]> = {
  hero: [
    { kind: "sparkle", top: "18%", left: "4%", size: 26, color: "#e7a1a7", speed: 60, dur: 7 },
    { kind: "ring", top: "70%", left: "8%", size: 30, color: "#a397dc", speed: 120, dur: 9 },
    { kind: "flower", top: "12%", left: "52%", size: 28, color: "#dfb94a", speed: 90, dur: 11 },
    { kind: "squiggle", top: "82%", left: "46%", size: 20, color: "#6fb596", speed: 40, dur: 8 },
    { kind: "sparkle", top: "8%", left: "92%", size: 18, color: "#a397dc", speed: 140, dur: 6 },
    { kind: "dot", top: "58%", left: "95%", size: 12, color: "#e7a1a7", speed: 80, dur: 7 },
  ],
  section: [
    { kind: "sparkle", top: "6%", left: "90%", size: 22, color: "#a397dc", speed: 80, dur: 8 },
    { kind: "flower", top: "70%", left: "-1%", size: 24, color: "#e7a1a7", speed: 120, dur: 10 },
    { kind: "dot", top: "40%", left: "97%", size: 10, color: "#6fb596", speed: 60, dur: 6 },
  ],
  soft: [
    { kind: "ring", top: "10%", left: "93%", size: 26, color: "#dfb94a", speed: 90, dur: 9 },
    { kind: "sparkle", top: "80%", left: "2%", size: 20, color: "#6fb596", speed: 70, dur: 7 },
  ],
};

function FloatingShape({ s }: { s: Shape }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1500], [0, -s.speed]);
  return (
    <motion.div className="absolute" style={{ top: s.top, left: s.left, y }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 0.85, scale: 1, y: [0, -12, 0], rotate: [0, s.kind === "squiggle" ? 6 : 25, 0] }}
        transition={{
          opacity: { duration: 0.8, delay: 0.4 },
          scale: { type: "spring", stiffness: 120, damping: 12, delay: 0.4 },
          y: { duration: s.dur, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: s.dur * 1.3, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <ShapeSvg kind={s.kind} size={s.size} color={s.color} />
      </motion.div>
    </motion.div>
  );
}

export function FloatingShapes({ preset = "hero" }: { preset?: keyof typeof presets }) {
  return (
    <div aria-hidden className="no-print pointer-events-none absolute inset-0 -z-[5] hidden sm:block">
      {presets[preset].map((s, i) => (
        <FloatingShape key={i} s={s} />
      ))}
    </div>
  );
}

/* ---------- Spinning circular text badge ---------- */
export function SpinBadge({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div aria-hidden className={`no-print grid h-28 w-28 place-items-center rounded-full bg-paper shadow-lg ${className}`}>
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute h-28 w-28"
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path id="badge-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text fontSize="10.2" letterSpacing="2" fill="#544a46" style={{ fontFamily: "var(--font-body)", textTransform: "uppercase" }}>
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </motion.svg>
      <motion.svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="#e7a1a7"
        animate={{ rotate: -360, scale: [1, 1.15, 1] }}
        transition={{ rotate: { duration: 16, repeat: Infinity, ease: "linear" }, scale: { duration: 2.4, repeat: Infinity } }}
      >
        <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" />
      </motion.svg>
    </div>
  );
}

/* ---------- Big word band that speeds up / reverses with scroll ---------- */
const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

export function VelocityBand({ words, baseVelocity = 3 }: { words: string[]; baseVelocity?: number }) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    baseX.set(baseX.get() + move);
  });

  const row = (hidden?: boolean) => (
    <span className="flex shrink-0 items-center" aria-hidden={hidden}>
      {words.map((w, i) => (
        <span key={i} className="flex items-center">
          <span className={`font-serif text-[clamp(2.4rem,6vw,4.5rem)] ${i % 2 ? "italic text-rose" : ""}`}>{w}</span>
          <svg width="28" height="28" viewBox="0 0 24 24" className="mx-6 shrink-0" fill={["#e7a1a7", "#a397dc", "#6fb596", "#dfb94a"][i % 4]}>
            <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" />
          </svg>
        </span>
      ))}
    </span>
  );

  return (
    <div className="no-print overflow-hidden py-6" aria-label={words.join(", ")}>
      <motion.div className="flex w-max whitespace-nowrap" style={{ x }}>
        {row()}
        {row(true)}
      </motion.div>
    </div>
  );
}
