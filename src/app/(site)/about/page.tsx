import type { Metadata } from "next";
import { getCollabs, getProfile, getProjects } from "@/lib/content";
import { asset } from "@/lib/asset";
import { Blobs, FloatingShapes } from "@/components/Effects";
import { Counter, Reveal, SplitWords, Stagger, StaggerItem } from "@/components/Motion";
import { FloatChips, PhotoBento, Polaroids, Timeline } from "@/components/AboutBits";
import { Button, SectionHead } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const title = "About Kumkum Dahreja · Web Developer, Creator & Event Anchor";
  const description = `${profile.currently}, café & food creator and former Abacus Society president from Mathura. Experience, education (MCA, BCA), skills, leadership and resume.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/about/" },
    openGraph: { title, description, url: "/about/", type: "profile", images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Kumkum Dahreja, web developer and café, food & lifestyle creator" }] },
    twitter: { title, description, images: ["/og.jpg"] },
  };
}

export const revalidate = 3600; // refreshed instantly from /admin on save

export default async function AboutPage() {
  const [profile, projects, collabs] = await Promise.all([getProfile(), getProjects(), getCollabs()]);
  const { certificates, designWork, education, experience, leadership, skills } = profile;
  const s = profile.socials;
  const links = [
    { ...s.instagram, label: "Instagram" },
    { ...s.food, label: "Food page" },
    { ...s.linkedin, label: "LinkedIn" },
    { ...s.github, label: "GitHub" },
    { ...s.linktree, label: "Linktree" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate px-5 pb-12 pt-32 sm:pt-40">
        <Blobs className="opacity-80" />
        <FloatingShapes preset="hero" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal hero><p className="label">About me</p></Reveal>
            <SplitWords text="Hi, I'm *Kumkum.*" className="display mt-4 text-[clamp(2.6rem,6vw,4.6rem)]" delay={0.1} />
            <Reveal hero delay={0.35}>
              <p className="mt-5 font-serif text-[clamp(1.25rem,2.2vw,1.6rem)] italic leading-snug text-rose">
                &ldquo;{profile.bio}&rdquo;
              </p>
            </Reveal>
            <Reveal hero delay={0.5}>
              <p className="mt-5 max-w-md text-ink-soft">
                {profile.currently} by day, café &amp; food creator the rest of the time. Studying {profile.studying.replace(",", " at")}.
              </p>
            </Reveal>
            <FloatChips
              chips={[
                { label: "Web developer", tone: "bg-lavender" },
                { label: "Café hopper", tone: "bg-blush" },
                { label: "Food lover", tone: "bg-butter" },
                { label: "Event anchor", tone: "bg-mint" },
                { label: "Mathura", tone: "bg-sky" },
              ]}
            />
            <Reveal hero delay={0.7}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={asset(profile.resumeUrl)} external>Resume PDF</Button>
                <Button href={`mailto:${profile.email}?subject=Job%20opportunity`} variant="soft">Hire me</Button>
              </div>
            </Reveal>
          </div>
          <Polaroids
            items={[
              { src: "/images/photos/kumkum-1330-sm.jpg", caption: "street style", x: 0, y: 4, r: -8 },
              { src: "/images/events/9.jpg", caption: "on stage", x: 50, y: 0, r: 7 },
              { src: "/images/photos/kumkum-0202-sm.jpg", caption: "café days", x: 25, y: 36, r: -2 },
            ]}
          />
        </div>
      </section>

      {/* Numbers */}
      <section className="px-5 py-10">
        <Stagger className="mx-auto grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { n: <Counter to={2} suffix="+ yrs" />, l: "building for the web", bg: "bg-lavender" },
            { n: <Counter to={projects.length} />, l: "websites & apps shipped", bg: "bg-blush" },
            { n: <Counter to={collabs.length} />, l: "café & brand collabs", bg: "bg-butter" },
            { n: <Counter to={300} suffix="+" />, l: "students at my events", bg: "bg-mint" },
          ].map((k, i) => (
            <StaggerItem key={i} className={`rounded-[1.75rem] p-6 transition-transform duration-500 hover:-translate-y-1 hover:rotate-[-1deg] ${k.bg}`}>
              <p className="display text-[clamp(2rem,3.6vw,2.8rem)]">{k.n}</p>
              <p className="mt-1 text-[13px] text-ink-soft">{k.l}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Experience */}
      <section className="relative isolate px-5 py-20">
        <FloatingShapes preset="section" />
        <div className="mx-auto max-w-5xl">
          <SectionHead label="Experience" title={<>My journey <em>so far.</em></>}>
            From UI/UX intern to full-time web developer in two years.
          </SectionHead>
          <Timeline items={experience} />
        </div>
      </section>

      {/* Off the clock */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead label="Off the clock" title={<>When I&apos;m not <em>coding.</em></>}>
            Cafés, food, festive looks and a mic in my hand.
          </SectionHead>
          <PhotoBento
            tiles={[
              { src: "/images/photos/kumkum-0099-sm.jpg", caption: "café hopping", className: "col-span-2 row-span-2" },
              { src: "/images/events/10.jpg", caption: "hosting tech events", className: "col-span-2" },
              { src: "/images/photos/kumkum-0588-sm.jpg", caption: "food diaries", className: "row-span-2" },
              { src: "/images/photos/kumkum-0863-sm.jpg", caption: "festive days", className: "row-span-2" },
              { src: "/images/events/3.jpg", caption: "campus fests", className: "col-span-2 md:col-span-1 md:row-span-2" },
              { src: "/images/photos/kumkum-1458-sm.jpg", caption: "golden hour", className: "md:row-span-2" },
              { src: "/images/events/6.jpg", caption: "on the podium", className: "md:col-span-2" },
            ]}
          />
        </div>
      </section>

      {/* Learning */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead label="Learning" title={<>Always <em>levelling up.</em></>} />
          <div className="grid gap-4 md:grid-cols-3">
            {education.map((e, i) => (
              <Reveal key={e.degree} delay={i * 0.1}>
                <div className={`group relative h-full overflow-hidden rounded-[1.75rem] p-7 ${i ? "bg-mint" : "bg-lavender"}`}>
                  <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-paper/40 transition-transform duration-700 group-hover:scale-150" />
                  <p className="relative text-[13px] text-ink-soft">{e.period}{i === 0 ? " · in progress" : ""}</p>
                  <p className="display relative mt-6 text-5xl">{e.degree}</p>
                  <p className="relative mt-1 text-[14px] text-ink-soft">{e.school}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <div className="h-full rounded-[1.75rem] bg-paper p-7 ring-1 ring-line">
                <p className="text-[13px] text-muted">Toolkit</p>
                <Stagger className="mt-4 flex flex-wrap gap-1.5" gap={0.03}>
                  {skills.map((sk) => (
                    <StaggerItem key={sk} className="rounded-full bg-cream px-3 py-1 text-[13px] text-ink-soft transition-colors hover:bg-blush">
                      {sk}
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </Reveal>
          </div>
          <Stagger className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {certificates.map((c) => (
              <StaggerItem key={c.title} className="rounded-[1.5rem] bg-paper p-5 ring-1 ring-line transition-transform duration-500 hover:-translate-y-1">
                <p className="text-[12px] text-muted">{c.issuer}{c.year ? ` · ${c.year}` : ""}</p>
                <p className="mt-2 font-serif text-[17px] leading-snug">{c.title}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Leadership */}
      <section className="relative isolate px-5 py-20">
        <FloatingShapes preset="soft" />
        <div className="mx-auto max-w-6xl">
          <SectionHead label="Leadership" title={<>Beyond the <em>code.</em></>}>
            Society president, editorial co-head and event organiser at GLA University.
          </SectionHead>
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {leadership.map((l) => (
              <StaggerItem key={l.role} className="group relative aspect-[16/10] overflow-hidden rounded-[1.75rem]">
                <img src={asset(l.image)} alt={l.role} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                  <p className="text-[12px] text-cream/75">{l.org} · {l.period}</p>
                  <p className="mt-1 font-serif text-2xl">{l.role}</p>
                  <p className="mt-1 text-[14px] text-cream/85">{l.highlight}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Design + links */}
      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <Reveal>
            <p className="label">Graphic design</p>
            <ul className="mt-5 border-t border-line">
              {designWork.map((dw) => (
                <li key={dw.title} className="border-b border-line">
                  <a href={asset(dw.file)} download={dw.download} className="group flex items-center justify-between py-4 text-[15px] hover:text-rose">
                    {dw.title}
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-butter transition-transform group-hover:translate-y-0.5">↓</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="label">Find me everywhere</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full border border-line bg-paper px-4 py-2.5 text-[14px] transition-all hover:-translate-y-0.5 hover:border-blush-deep hover:bg-blush"
                >
                  {l.label} <span className="text-muted">↗</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
