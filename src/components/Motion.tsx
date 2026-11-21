"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { introDelay } from "./Effects";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fade + lift + un-blur when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  hero = false,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** Part of the first screen: waits for the intro curtain on fresh loads. */
  hero?: boolean;
}) {
  const [extra] = useState(() => (hero ? introDelay() : 0));
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease, delay: delay + extra }}
    >
      {children}
    </motion.div>
  );
}

/** Container that staggers its <StaggerItem> children. */
export function Stagger({
  children,
  className,
  gap = 0.08,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
  as?: "div" | "ul";
}) {
  const Comp = as === "ul" ? motion.ul : motion.div;
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } },
      }}
    >
      {children}
    </Comp>
  );
}

/** Headline that rises in word by word. Wrap words in *stars* to italicise them. */
export function SplitWords({
  text,
  className,
  delay = 0,
  as = "h1",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2";
}) {
  const Tag = as === "h1" ? motion.h1 : motion.h2;
  const words = text.split(" ");
  const [extra] = useState(() => (as === "h1" ? introDelay() : 0));
  const [lit, setLit] = useState(false);
  return (
    <Tag
      className={`${className ?? ""} ${lit ? "hl-on" : ""}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      onViewportEnter={() => setTimeout(() => setLit(true), (delay + extra) * 1000 + 300)}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: delay + extra } } }}
      aria-label={text.replaceAll("*", "")}
    >
      {words.map((w, i) => {
        const italic = w.startsWith("*") && w.includes("*", 1);
        const clean = w.replaceAll("*", "");
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden>
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "110%", rotate: 4 },
                show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease } },
              }}
            >
              {italic ? <em>{clean}</em> : clean}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}

/** Number that counts up when visible. */
export function Counter({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) =>
    `${prefix}${v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`
  );
  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration: 1.6, ease });
    return () => controls.stop();
  }, [inView, mv, to]);
  const final = `${prefix}${to.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
  return (
    <>
      <motion.span ref={ref} className={`tabular print:hidden ${className ?? ""}`}>
        {text}
      </motion.span>
      <span className={`tabular hidden print:inline ${className ?? ""}`}>{final}</span>
    </>
  );
}

/** Single horizontal bar that grows when visible. */
export function Bar({
  label,
  value,
  max,
  display,
  tone = "bg-blush-deep",
  muted = false,
}: {
  label: string;
  value: number;
  max: number;
  display: string;
  tone?: string;
  muted?: boolean;
}) {
  const pct = Math.max(2, (value / max) * 100);
  return (
    <li className="grid grid-cols-[5.5rem_1fr_3.2rem] items-center gap-3 text-[13px]" title={`${label}: ${display}`}>
      <span className={`truncate ${muted ? "text-muted" : "text-ink-soft"}`}>{label}</span>
      <span className="h-2 overflow-hidden rounded-full bg-ink/[0.05]">
        <motion.span
          className={`print-bar block h-full rounded-full ${muted ? "bg-ink/20" : tone}`}
          style={{ ["--w" as string]: `${pct}%` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease, delay: 0.1 }}
        />
      </span>
      <span className="tabular text-right font-medium text-ink">{display}</span>
    </li>
  );
}
