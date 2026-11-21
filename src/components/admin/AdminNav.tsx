"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { signOut } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/deals", label: "Collab tracker" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/collabs", label: "Brands & cafés" },
  { href: "/admin/reels", label: "Reels" },
  { href: "/admin/media-kit", label: "Media kit" },
  { href: "/admin/profile", label: "About & profile" },
];

export function AdminNav() {
  const path = usePathname() || "/admin";
  const isActive = (href: string) => (href === "/admin" ? path === "/admin" || path === "/admin/" : path.startsWith(href));

  return (
    <aside className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between px-5 py-4 md:block md:px-6 md:py-7">
        <Link href="/admin" className="font-serif text-2xl leading-none">
          Kumkum<span className="text-rose">.</span>
          <span className="ml-2 align-middle text-[11px] font-sans uppercase tracking-widest text-muted">admin</span>
        </Link>
        <div className="flex gap-2 md:hidden">
          <a href="/" target="_blank" className="rounded-full bg-paper px-3 py-1.5 text-[12px] ring-1 ring-line">Site ↗</a>
        </div>
      </div>
      <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 md:block md:space-y-1 md:px-4" aria-label="Admin">
        {links.map((l) => {
          const on = isActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`relative block whitespace-nowrap rounded-full px-4 py-2 text-[14px] transition-colors ${on ? "text-ink" : "text-muted hover:text-ink"}`}
            >
              {on && <motion.span layoutId="admin-nav" className="absolute inset-0 -z-10 rounded-full bg-blush" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="hidden space-y-2 px-6 pt-8 md:block">
        <a href="/" target="_blank" className="block text-[13px] text-muted hover:text-rose">View website ↗</a>
        <form action={signOut}>
          <button className="text-[13px] text-muted hover:text-rose">Sign out</button>
        </form>
      </div>
    </aside>
  );
}
