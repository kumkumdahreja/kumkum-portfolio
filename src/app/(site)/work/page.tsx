import type { Metadata } from "next";
import { Blobs, FloatingShapes } from "@/components/Effects";
import { Reveal, SplitWords } from "@/components/Motion";
import { WorkGrid } from "@/components/WorkGrid";
import { getProjects } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const projects = await getProjects();
  const title = "Work · Websites, Stores & Apps by Kumkum Dahreja";
  const description = `${projects.length} websites, Shopify & WordPress stores and apps built by Kumkum Dahreja for hotels, schools, travel brands, health-tech and e-commerce. Next.js, React, PHP and more.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/work/" },
    openGraph: { title, description, url: "/work/", images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Kumkum Dahreja, web developer and café, food & lifestyle creator" }] },
    twitter: { title, description, images: ["/og.jpg"] },
  };
}

export const revalidate = 3600; // refreshed instantly from /admin on save

export default async function WorkPage() {
  const projects = await getProjects();
  return (
    <>
      <section className="relative isolate px-5 pb-12 pt-36 sm:pt-44">
        <Blobs className="opacity-70" />
        <FloatingShapes preset="soft" />
        <div className="mx-auto max-w-6xl">
          <Reveal hero>
            <p className="label">Work · {projects.length} projects</p>
          </Reveal>
          <SplitWords text="Things I've *built.*" className="display mt-4 text-[clamp(2.5rem,5.6vw,4.4rem)]" delay={0.1} />
          <Reveal hero delay={0.4}>
            <p className="mt-5 max-w-md text-ink-soft">Hotels, schools, travel, health-tech, stores and an app.</p>
          </Reveal>
        </div>
      </section>
      <section className="px-5 pb-12">
        <div className="mx-auto max-w-6xl">
          <WorkGrid projects={projects} />
        </div>
      </section>
    </>
  );
}
