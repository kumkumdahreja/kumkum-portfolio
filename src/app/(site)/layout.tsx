import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CursorGlow, Intro, ScrollProgress } from "@/components/Effects";
import { getProfile } from "@/lib/content";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  const s = profile.socials;
  const abs = (p: string) => (/^https?:\/\//.test(p) ? p : `${SITE_URL}${p}`);

  // Structured data so Google understands who this site is about.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: profile.name,
        alternateName: [s.instagram.handle, s.food.handle],
        url: SITE_URL,
        image: abs(profile.photos.hero),
        email: `mailto:${profile.email}`,
        jobTitle: "Web Developer & Content Creator",
        description: `${profile.currently}. Café, food & lifestyle creator from ${profile.location}.`,
        worksFor: { "@type": "Organization", name: "Biz Emporia Consultancy Private Limited" },
        alumniOf: [
          { "@type": "CollegeOrUniversity", name: "GLA University" },
          { "@type": "CollegeOrUniversity", name: "Galgotias University" },
        ],
        address: { "@type": "PostalAddress", addressLocality: "Mathura", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
        knowsAbout: profile.skills,
        sameAs: [s.instagram.url, s.food.url, s.linkedin.url, s.github.url, s.linktree.url],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "en-IN",
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Intro />
      <ScrollProgress />
      <CursorGlow />
      <Nav firstName={profile.firstName} email={profile.email} />
      <main>{children}</main>
      <Footer profile={profile} />
    </>
  );
}
