"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { categories, type Project, type ProjectCategory } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

export function WorkGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<ProjectCategory | "all">("all");
  const list = active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      <div className="no-scrollbar -mx-5 mb-10 overflow-x-auto px-5">
        <div className="inline-flex gap-1 rounded-full border border-line bg-paper/70 p-1 backdrop-blur" role="toolbar" aria-label="Filter projects">
          {categories.map((c) => {
            const count = c.id === "all" ? projects.length : projects.filter((p) => p.category === c.id).length;
            const on = active === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                aria-pressed={on}
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-[13px] transition-colors ${on ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                {on && (
                  <motion.span
                    layoutId="work-filter"
                    className="absolute inset-0 -z-10 rounded-full bg-lavender"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {c.label}
                <span className="ml-1.5 text-[11px] text-muted">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.ul layout className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: Math.min(i, 8) * 0.03 }}
            >
              <ProjectCard project={p} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
}
