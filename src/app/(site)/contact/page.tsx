import type { Metadata } from "next";
import { getProfile } from "@/lib/content";
import { Blobs, FloatingShapes } from "@/components/Effects";
import { Reveal, SplitWords, Stagger, StaggerItem } from "@/components/Motion";
import { CopyEmail } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const title = "Contact Kumkum Dahreja · Brand Collabs, Websites & Jobs";
  const description = `Email ${profile.email} for brand collaborations, café features, UGC, website projects or job opportunities. Based in Mathura, India.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/contact/" },
    openGraph: { title, description, url: "/contact/", images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Kumkum Dahreja, web developer and café, food & lifestyle creator" }] },
    twitter: { title, description, images: ["/og.jpg"] },
  };
}

const topics = [
  { label: "Website or app", subject: "Website project", bg: "bg-lavender" },
  { label: "Brand collab", subject: "Brand collaboration", bg: "bg-blush" },
  { label: "Café feature", subject: "Café feature enquiry", bg: "bg-butter" },
  { label: "Job opportunity", subject: "Job opportunity", bg: "bg-mint" },
];

export const revalidate = 3600; // refreshed instantly from /admin on save

export default async function ContactPage() {
  const profile = await getProfile();
  const s = profile.socials;
  const socials = [s.instagram, s.food, { ...s.linkedin, label: "LinkedIn" }, { ...s.github, label: "GitHub" }, { ...s.linktree, label: "Linktree" }];
  return (
    <section className="relative isolate px-5 pb-8 pt-36 sm:pt-44">
      <Blobs />
      <FloatingShapes preset="hero" />
      <div className="mx-auto max-w-6xl">
        <Reveal hero><p className="label">Contact</p></Reveal>
        <SplitWords text="Let's make something *lovely.*" className="display mt-4 text-[clamp(2.5rem,5.6vw,4.4rem)]" delay={0.1} />

        <Reveal hero delay={0.4}>
          <a
            href={`mailto:${profile.email}`}
            className="mt-10 inline-block break-all font-serif text-[clamp(1.6rem,4.4vw,3rem)] underline decoration-blush-deep decoration-2 underline-offset-8 transition-colors hover:text-rose"
          >
            {profile.email}
          </a>
          <div className="mt-6">
            <CopyEmail email={profile.email} />
          </div>
        </Reveal>

        <p className="label mt-20">What&apos;s it about?</p>
        <Stagger className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((t) => (
            <StaggerItem key={t.label}>
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent(t.subject)}`}
                className={`group flex h-32 flex-col justify-between rounded-[1.5rem] p-5 transition-transform duration-500 hover:-translate-y-1 ${t.bg}`}
              >
                <span className="font-serif text-2xl">{t.label}</span>
                <span className="text-[12px] text-ink-soft">Email ↗</span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>

        <p className="label mt-16">Elsewhere</p>
        <Stagger className="mt-5 flex flex-wrap gap-2">
          {socials.map((x) => (
            <StaggerItem key={x.handle}>
              <a
                href={x.url}
                target="_blank"
                rel="noopener"
                className="block rounded-full border border-line bg-paper px-4 py-2 text-[13px] transition-colors hover:border-blush-deep"
              >
                {x.handle} <span className="text-muted">· {x.label}</span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
