import type { Metadata } from "next";
import Link from "next/link";
import { getCollabs, getMediaKit, getProfile, getProjects } from "@/lib/content";
import { counterParts } from "@/data/mediakit";
import { asset } from "@/lib/asset";
import { Blobs, FloatingShapes, SpinBadge, VelocityBand } from "@/components/Effects";
import { Counter, Reveal, SplitWords, Stagger, StaggerItem } from "@/components/Motion";
import { Button, Gallery, Marquee, PhotoStack, SectionHead, Tilt } from "@/components/ui";
import { ProjectCard } from "@/components/ProjectCard";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const revalidate = 3600; // refreshed instantly from /admin on save

export default async function Home() {
  const [profile, projects, collabs, mediakit] = await Promise.all([getProfile(), getProjects(), getCollabs(), getMediaKit()]);
  const featured = projects.filter((p) => p.featured);
  const names = collabs.map((c) => c.name);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate px-5 pb-16 pt-32 sm:pt-40">
        <Blobs />
        <FloatingShapes preset="hero" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1.15fr_1fr]">
          <div>
            <Reveal hero>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/70 px-3 py-1.5 text-[12px] text-ink-soft backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-deep opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-deep" />
                </span>
                Open to projects &amp; collabs
              </span>
            </Reveal>
            <SplitWords
              text="I build *websites* & make *café* content."
              className="display mt-6 text-[clamp(2.5rem,5.6vw,4.4rem)]"
              delay={0.15}
            />
            <Reveal hero delay={0.5}>
              <p className="mt-6 max-w-md text-[15px] text-ink-soft">
                {profile.name}, web developer and food &amp; lifestyle creator from Mathura.
              </p>
            </Reveal>
            <Reveal hero delay={0.65}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/work/">See my work</Button>
                <Button href="/media-kit/" variant="soft">Media kit</Button>
              </div>
            </Reveal>
          </div>
          <PhotoStack
            main={profile.photos.hero}
            side={profile.photos.stack}
            badge={<SpinBadge text="web developer · café creator · food lover · " />}
          />
        </div>
      </section>

      {/* Collab marquee */}
      <section className="py-6">
        <Reveal>
          <p className="mb-4 text-center text-[12px] text-muted">{collabs.length} cafés, restaurants &amp; brands</p>
        </Reveal>
        <Marquee items={names.slice(0, 22)} />
        <div className="mt-3">
          <Marquee items={names.slice(22)} reverse />
        </div>
      </section>

      {/* Bento */}
      <section className="relative isolate px-5 py-24">
        <FloatingShapes preset="section" />
        <div className="mx-auto max-w-6xl">
          <SectionHead label="Two sides" title={<>Two crafts, <em>one</em> person.</>} />
          <Stagger className="grid auto-rows-[minmax(12rem,auto)] gap-4 md:grid-cols-4">
            <StaggerItem className="md:col-span-2 md:row-span-2">
              <Link href="/work/" className="group flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] bg-lavender p-7 transition-transform duration-500 hover:-translate-y-1">
                <div>
                  <p className="label">Developer</p>
                  <p className="display mt-4 text-6xl"><Counter to={projects.length} /></p>
                  <p className="mt-1 text-[14px] text-ink-soft">websites &amp; apps shipped</p>
                </div>
                <div className="relative mt-8 h-44">
                  {featured.slice(0, 3).map((p, i) => (
                    <img
                      key={p.id}
                      src={asset(p.image)}
                      alt=""
                      className="absolute h-28 w-44 rounded-2xl sm:h-36 sm:w-56 object-cover object-top shadow-lg ring-4 ring-paper/70 transition-transform duration-700 group-hover:-translate-y-2"
                      style={{ left: `${i * 22}%`, top: `${i * 12}px`, rotate: `${(i - 1) * 4}deg`, transitionDelay: `${i * 60}ms` }}
                    />
                  ))}
                </div>
              </Link>
            </StaggerItem>

            <StaggerItem className="md:col-span-2">
              <Link href="/media-kit/" className="flex h-full flex-col justify-between rounded-[1.75rem] bg-blush p-7 transition-transform duration-500 hover:-translate-y-1">
                <p className="label">Creator</p>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="display text-5xl"><Counter {...counterParts(mediakit.views)} /></p>
                    <p className="mt-1 text-[14px] text-ink-soft">views in 30 days</p>
                  </div>
                  <span className="rounded-full bg-paper/70 px-3 py-1 text-[12px] text-rose">+{mediakit.viewsDelta}%</span>
                </div>
              </Link>
            </StaggerItem>

            <StaggerItem>
              <a href={profile.socials.food.url} target="_blank" rel="noopener" className="flex h-full flex-col justify-between rounded-[1.75rem] bg-butter p-7 transition-transform duration-500 hover:-translate-y-1">
                <p className="label">Food page</p>
                <div>
                  <p className="display break-words text-[clamp(1.3rem,1.9vw,1.6rem)]">{profile.socials.food.handle.replace("by", "​by")}</p>
                  <p className="mt-1 text-[13px] text-ink-soft">Plates I love ↗</p>
                </div>
              </a>
            </StaggerItem>

            <StaggerItem>
              <div className="flex h-full flex-col justify-between rounded-[1.75rem] bg-mint p-7">
                <p className="label">Collabs</p>
                <div>
                  <p className="display text-5xl"><Counter to={collabs.length} /></p>
                  <p className="mt-1 text-[13px] text-ink-soft">cafés &amp; brands</p>
                </div>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      <VelocityBand words={["websites", "reels", "cafés", "brands", "food", "code", "websites", "reels", "cafés", "brands", "food", "code"]} />

      {/* Selected work */}
      <section className="px-5 py-12">
        <div className="mx-auto max-w-6xl">
          <SectionHead label="Selected work" title={<>Recently <em>shipped.</em></>}>
            <Link href="/work/" className="underline decoration-blush-deep underline-offset-4 hover:text-rose">
              All {projects.length} projects →
            </Link>
          </SectionHead>
          <Stagger className="grid gap-6 sm:grid-cols-2">
            {featured.map((p) => (
              <StaggerItem key={p.id}>
                <Tilt>
                  <ProjectCard project={p} large />
                </Tilt>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24">
        <div className="mx-auto max-w-[74.5rem] px-5">
          <SectionHead label="On camera" title={<>Made for <em>the feed.</em></>}>
            <Link href="/media-kit/#reels" className="underline decoration-blush-deep underline-offset-4 hover:text-rose">
              Watch my reels →
            </Link>
          </SectionHead>
        </div>
        <div className="pl-5 sm:pl-[max(1.25rem,calc((100vw-72rem)/2))]">
          <Gallery photos={profile.photos.gallery} />
        </div>
      </section>
    </>
  );
}
