import type { Project } from "@/data/projects";
import { asset } from "@/lib/asset";

export function ProjectCard({ project: p, large = false }: { project: Project; large?: boolean }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener"
      className="group block"
      aria-label={`${p.title}: open project`}
    >
      <div className={`relative overflow-hidden rounded-[1.5rem] bg-paper ring-1 ring-line aspect-[16/10]`}>
        <img
          src={asset(p.image)}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
        />
        <span className="absolute right-3 top-3 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-paper/90 text-sm opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          ↗
        </span>
        {p.status === "in-progress" && (
          <span className="absolute left-3 top-3 rounded-full bg-butter px-2.5 py-1 text-[11px]">In progress</span>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4 px-1">
        <h3 className={`font-serif ${large ? "text-2xl" : "text-xl"} leading-tight`}>{p.title}</h3>
        <span className="shrink-0 text-[11px] text-muted">{p.stack.join(" · ")}</span>
      </div>
      <p className="mt-1 px-1 text-[13px] text-muted">
        {p.kind} · {p.summary}
      </p>
    </a>
  );
}
