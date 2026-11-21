import Link from "next/link";
import type { SiteProfile } from "@/data/profile";
import { asset } from "@/lib/asset";
import { CopyEmail } from "./ui";
import { FloatingShapes } from "./Effects";

export function Footer({ profile }: { profile: SiteProfile }) {
  const s = profile.socials;
  return (
    <footer className="no-print relative mt-24 overflow-hidden px-4 pb-8">
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-cream sm:px-12">
        <FloatingShapes preset="soft" />
        <p className="label !text-cream/50">Let&apos;s talk</p>
        <h2 className="display mt-4 text-[clamp(2.2rem,6vw,4.5rem)]">
          Have something <em className="!text-blush-deep">in mind?</em>
        </h2>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full bg-blush px-5 py-3 text-sm text-ink transition-transform hover:-translate-y-0.5"
          >
            {profile.email}
          </a>
          <CopyEmail dark email={profile.email} />
        </div>

        <div className="mt-14 grid gap-8 border-t border-cream/10 pt-8 text-[13px] sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-cream/40">Pages</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-cream/80">
              <Link href="/work/" className="hover:text-blush">Work</Link>
              <Link href="/media-kit/" className="hover:text-blush">Media kit</Link>
              <Link href="/about/" className="hover:text-blush">About</Link>
              <Link href="/contact/" className="hover:text-blush">Contact</Link>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-cream/40">Instagram</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-cream/80">
              <a href={s.instagram.url} target="_blank" rel="noopener" className="hover:text-blush">{s.instagram.handle}</a>
              <a href={s.food.url} target="_blank" rel="noopener" className="hover:text-blush">{s.food.handle}</a>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-cream/40">Elsewhere</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-cream/80">
              <a href={s.linkedin.url} target="_blank" rel="noopener" className="hover:text-blush">LinkedIn</a>
              <a href={s.github.url} target="_blank" rel="noopener" className="hover:text-blush">GitHub</a>
              <a href={s.linktree.url} target="_blank" rel="noopener" className="hover:text-blush">Linktree</a>
              <a href={asset(profile.resumeUrl)} download className="hover:text-blush">Resume ↓</a>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-4 flex max-w-6xl justify-between px-2 text-[12px] text-muted">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>{profile.location}</span>
      </div>
    </footer>
  );
}
