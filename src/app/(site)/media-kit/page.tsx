import type { Metadata } from "next";
import { getCollabs, getMediaKit, getProfile, getReels, namesBy } from "@/lib/content";
import { compact, counterParts, nonFollowerShare, totalInteractions } from "@/data/mediakit";
import { asset } from "@/lib/asset";
import { Blobs, FloatingShapes, SpinBadge, VelocityBand } from "@/components/Effects";
import { Bar, Counter, Reveal, SplitWords, Stagger, StaggerItem } from "@/components/Motion";
import { Button, Gallery, Marquee, PrintButton, SectionHead } from "@/components/ui";
import { ReelsShowcase } from "@/components/Reels";

export async function generateMetadata(): Promise<Metadata> {
  const [mk, collabs] = await Promise.all([getMediaKit(), getCollabs()]);
  const title = "Media Kit · Kumkum Dahreja (@kumkum_dahreja) · Café & Food Creator";
  const description = `Instagram media kit for café, food & lifestyle creator Kumkum Dahreja: ${compact(mk.views)} views in 30 days (+${Math.round(mk.viewsDelta)}%), audience across Delhi NCR, Agra, Vrindavan & Mathura, ${collabs.length} brand and café collaborations, and packages.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/media-kit/" },
    openGraph: { title, description, url: "/media-kit/" },
    twitter: { title, description },
  };
}

const tones: Record<string, string> = {
  blush: "bg-blush",
  lavender: "bg-lavender",
  mint: "bg-mint",
  butter: "bg-butter",
};

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[1.75rem] bg-paper p-6 ring-1 ring-line ${className}`}>{children}</div>;
}

export const revalidate = 3600; // refreshed instantly from /admin on save

export default async function MediaKitPage() {
  const [profile, mk, collabs, reels] = await Promise.all([getProfile(), getMediaKit(), getCollabs(), getReels()]);
  const s = profile.socials;
  const byCategory = (c: "cafe" | "brand" | "modelling" | "ugc") => namesBy(collabs, c);
  const cafes = byCategory("cafe");
  const brands = byCategory("brand");
  const nf = nonFollowerShare(mk);
  const half = Math.ceil(cafes.length / 2);
  const maxAge = Math.max(...mk.audience.age.map((a) => a.value));
  const maxCity = Math.max(...mk.audience.cities.map((a) => a.value));

  return (
    <>
      {/* Hero */}
      <section className="relative isolate px-5 pb-16 pt-36 sm:pt-44 print:pb-4">
        <Blobs />
        <FloatingShapes preset="hero" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.2fr_1fr] print:grid-cols-[1.5fr_1fr] print:gap-6">
          <div>
            <Reveal hero><p className="label">Media kit · {mk.period}</p></Reveal>
            <SplitWords text="Café, food & *lifestyle* content." className="display mt-4 text-[clamp(2.5rem,5.6vw,4.4rem)]" delay={0.1} />
            <Reveal hero delay={0.4}>
              <div className="mt-6 flex flex-wrap gap-2">
                {[s.instagram, s.food].map((h) => (
                  <a
                    key={h.handle}
                    href={h.url}
                    target="_blank"
                    rel="noopener"
                    className="rounded-full border border-line bg-paper/70 px-4 py-2 text-[13px] backdrop-blur transition-colors hover:border-blush-deep"
                  >
                    {h.handle} <span className="text-muted">· {h.label}</span>
                  </a>
                ))}
              </div>
            </Reveal>
            <Reveal hero delay={0.55}>
              <div className="no-print mt-8 flex flex-wrap gap-3">
                <Button href={`mailto:${profile.email}?subject=Collaboration%20enquiry`}>Work with me</Button>
                <PrintButton />
              </div>
            </Reveal>
          </div>
          <Reveal hero delay={0.2}>
            <div className="relative mx-auto w-full max-w-sm print:max-w-[210px]">
              <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl ring-4 ring-paper">
                <img src={asset(profile.photos.kit)} alt="Kumkum Dahreja, café and lifestyle creator" fetchPriority="high" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -left-8 sm:-left-12">
                <SpinBadge text="café · food · lifestyle · ugc · " />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Headline numbers */}
      <section className="px-5">
        <Stagger className="mx-auto grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-4 print:grid-cols-4">
          {[
            { v: <Counter {...counterParts(mk.views)} />, l: "views · 30 days", d: `+${Math.round(mk.viewsDelta)}%`, bg: "bg-blush" },
            { v: <Counter {...counterParts(mk.reach)} />, l: "accounts reached", d: `+${Math.round(mk.reachDelta)}%`, bg: "bg-lavender" },
            { v: <Counter to={nf} suffix="%" />, l: "from non-followers", bg: "bg-mint" },
            { v: <Counter {...counterParts(Math.max(0, ...mk.topReels))} />, l: "top reel views", bg: "bg-butter" },
          ].map((k, i) => (
            <StaggerItem key={i} className={`rounded-[1.75rem] p-6 ${k.bg}`}>
              <p className="display text-[clamp(2.2rem,4vw,3.2rem)]">{k.v}</p>
              <div className="mt-2 flex items-center justify-between text-[12px] text-ink-soft">
                <span>{k.l}</span>
                {k.d && <span className="rounded-full bg-paper/70 px-2 py-0.5 text-rose">{k.d}</span>}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Performance */}
      <section className="px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead label="Performance" title={<>Reels do the <em>heavy lifting.</em></>} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 sm:[&>*:last-child:nth-child(odd)]:col-span-2 lg:[&>*:last-child:nth-child(odd)]:col-span-1 print:[&>*]:col-span-1">
            <Reveal>
              <Card className="h-full">
                <p className="text-[13px] text-muted">Views by format</p>
                <ul className="mt-5 space-y-3">
                  {mk.formats.map((f) => (
                    <Bar key={f.label} label={f.label} value={f.views} max={mk.formats[0].views} display={compact(f.views)} />
                  ))}
                </ul>
              </Card>
            </Reveal>
            <Reveal delay={0.1}>
              <Card className="h-full">
                <p className="text-[13px] text-muted">Who&apos;s watching</p>
                <p className="display mt-4 text-5xl"><Counter to={nf} suffix="%" /></p>
                <p className="text-[13px] text-ink-soft">of views come from non-followers</p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-ink/[0.05]">
                  <div className="h-full rounded-full bg-lavender-deep" style={{ width: `${nf}%` }} />
                </div>
              </Card>
            </Reveal>
            <Reveal delay={0.2}>
              <Card className="h-full">
                <p className="text-[13px] text-muted">Top reels · 180 days</p>
                <ul className="mt-5 space-y-3">
                  {mk.topReels.map((v, i) => (
                    <Bar key={i} label={`Reel ${i + 1}`} value={v} max={mk.topReels[0]} display={compact(v)} tone="bg-mint-deep" />
                  ))}
                </ul>
              </Card>
            </Reveal>
          </div>
          <Reveal>
            <p className="mt-4 text-[12px] text-muted">
              {mk.profileVisits.toLocaleString("en-IN")} profile visits · {mk.followers} followers (+{mk.followersDelta}%) · {compact(totalInteractions(mk))} interactions in 30 days
            </p>
          </Reveal>
        </div>
      </section>

      {/* Audience */}
      <section className="px-5 pb-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead label="Audience" title={<>Young, local, <em>bilingual.</em></>} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 sm:[&>*:last-child:nth-child(odd)]:col-span-2 lg:[&>*:last-child:nth-child(odd)]:col-span-1 print:[&>*]:col-span-1">
            <Reveal>
              <Card className="h-full">
                <p className="text-[13px] text-muted">Age</p>
                <ul className="mt-5 space-y-3">
                  {mk.audience.age.map((a) => (
                    <Bar key={a.label} label={a.label} value={a.value} max={maxAge} display={`${a.value}%`} tone="bg-lavender-deep" />
                  ))}
                </ul>
              </Card>
            </Reveal>
            <Reveal delay={0.1}>
              <Card className="h-full">
                <p className="text-[13px] text-muted">Top cities</p>
                <ul className="mt-5 space-y-3">
                  {mk.audience.cities.map((a) => (
                    <Bar key={a.label} label={a.label} value={a.value} max={maxCity} display={`${a.value}%`} />
                  ))}
                </ul>
              </Card>
            </Reveal>
            <Reveal delay={0.2}>
              <Card className="flex h-full flex-col gap-6">
                <div>
                  <p className="text-[13px] text-muted">Gender</p>
                  <div className="mt-4 flex h-9 overflow-hidden whitespace-nowrap rounded-full text-[12px] print:text-[10px]">
                    {mk.audience.gender.map((g, i) => (
                      <div key={g.label} className={`grid place-items-center ${i ? "bg-blush" : "bg-sky"}`} style={{ flexGrow: g.value, flexBasis: 0 }}>
                        {g.label} {g.value}%
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[13px] text-muted">Languages</p>
                  <p className="mt-2 text-[14px]">{mk.audience.languages.slice(0, 2).map((l) => `${l.label} ${Math.round(l.value)}%`).join(" · ")}</p>
                </div>
                <div>
                  <p className="text-[13px] text-muted">Most active</p>
                  <p className="mt-2 text-[14px]">{mk.audience.activeHours} · {mk.audience.activeDays.join(", ")}</p>
                </div>
                <div>
                  <p className="text-[13px] text-muted">Country</p>
                  <p className="mt-2 text-[14px]">{mk.audience.countries[0]?.label} {mk.audience.countries[0]?.value}%</p>
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Collabs */}
      <section className="pb-24">
        <div className="mx-auto max-w-[74.5rem] px-5">
          <SectionHead label="Collaborations" title={<><Counter to={collabs.length} /> brands &amp; <em>venues.</em></>} />
          <Stagger className="mb-8 flex flex-wrap gap-2">
            {brands.map((b) => (
              <StaggerItem key={b} className="rounded-full bg-lavender px-5 py-2.5 font-serif text-xl">
                {b}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <Marquee items={cafes.slice(0, half)} />
        <div className="mt-3">
          <Marquee items={[...cafes.slice(half), ...byCategory("modelling"), ...byCategory("ugc")]} reverse />
        </div>
      </section>

      {/* Featured reels */}
      <section id="reels" className="relative isolate scroll-mt-28 px-5 pb-24">
        <FloatingShapes preset="section" />
        <div className="mx-auto max-w-6xl">
          <SectionHead label="Featured reels" title={<>Tap to <em>watch.</em></>}>
            {reels.length} favourites from cafés, brands, modelling and UGC. And many more on Instagram.
          </SectionHead>
          <ReelsShowcase reels={reels} />
        </div>
      </section>

      {/* Gallery */}
      <section className="no-print pb-24">
        <div className="mx-auto max-w-[74.5rem] px-5">
          <SectionHead label="On camera" title={<>Made for <em>the feed.</em></>}>Drag to explore →</SectionHead>
        </div>
        <div className="pl-5 sm:pl-[max(1.25rem,calc((100vw-72rem)/2))]">
          <Gallery photos={profile.photos.gallery} />
        </div>
      </section>

      <VelocityBand words={["café features", "brand reels", "UGC", "modelling", "food", "café features", "brand reels", "UGC", "modelling", "food"]} baseVelocity={2.5} />

      {/* Packages */}
      <section className="relative isolate px-5 pt-10">
        <FloatingShapes preset="soft" />
        <div className="mx-auto max-w-6xl">
          <SectionHead label="Packages" title={<>Ways to <em>work together.</em></>}>
            Rates on request. Every package can be tailored.
          </SectionHead>
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-4">
            {mk.packages.map((p) => (
              <StaggerItem key={p.title} className={`group flex flex-col rounded-[1.75rem] p-6 transition-transform duration-500 hover:-translate-y-1 ${tones[p.tone]}`}>
                <h3 className="font-serif text-2xl">{p.title}</h3>
                <ul className="mt-4 flex-1 space-y-1.5 text-[13px] text-ink-soft">
                  {p.items.map((it) => <li key={it}>— {it}</li>)}
                </ul>
                <a
                  href={`mailto:${profile.email}?subject=${encodeURIComponent(p.title + " enquiry")}`}
                  className="mt-6 inline-flex items-center justify-between rounded-full bg-paper/80 px-4 py-2.5 text-[13px] transition-colors group-hover:bg-paper"
                >
                  Ask for rates <span>↗</span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
