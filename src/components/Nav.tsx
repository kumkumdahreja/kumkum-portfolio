"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/work/", label: "Work" },
  { href: "/media-kit/", label: "Media kit" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

const norm = (p: string) => (p.endsWith("/") ? p : `${p}/`);

export function Nav({ firstName, email }: { firstName: string; email: string }) {
  const pathname = norm(usePathname() || "/");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="no-print fixed inset-x-0 top-3 z-50 px-4">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`mx-auto flex max-w-5xl items-center justify-between rounded-full border px-2 py-2 pl-5 backdrop-blur-xl transition-[background,border-color,box-shadow] duration-500 ${
          scrolled
            ? "border-line bg-paper/80 shadow-[0_8px_30px_-12px_rgba(43,37,35,0.15)]"
            : "border-transparent bg-paper/50"
        }`}
        aria-label="Main"
      >
        <Link href="/" className="font-serif text-xl leading-none tracking-tight">
          {firstName}
          <span className="text-rose">.</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative block rounded-full px-4 py-2 text-[13px] transition-colors ${
                    active ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-blush"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <a
          href={`mailto:${email}`}
          className="hidden rounded-full bg-ink px-4 py-2 text-[13px] text-cream transition-transform hover:-translate-y-0.5 md:block"
        >
          Say hi
        </a>

        <button
          className="grid h-10 w-10 place-items-center rounded-full bg-blush md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="relative block h-3 w-4">
            <motion.span
              className="absolute left-0 top-0 h-[1.5px] w-4 rounded bg-ink"
              animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className="absolute bottom-0 left-0 h-[1.5px] w-4 rounded bg-ink"
              animate={open ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
            />
          </span>
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="mx-auto mt-2 max-w-5xl rounded-3xl border border-line bg-paper/95 p-3 backdrop-blur-xl md:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            >
              {links.map((l) => (
                <motion.li
                  key={l.href}
                  variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
                >
                  <Link
                    href={l.href}
                    className={`block rounded-2xl px-4 py-3 font-serif text-2xl ${
                      pathname === l.href ? "bg-blush" : ""
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            <a
              href={`mailto:${email}`}
              className="mt-2 block rounded-2xl bg-ink px-4 py-3 text-center text-sm text-cream"
            >
              Say hi
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
