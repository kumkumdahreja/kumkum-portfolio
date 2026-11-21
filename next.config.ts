import type { NextConfig } from "next";

// Hosted on Vercel: pages are cached and refreshed instantly when you save in /admin.
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    serverActions: { bodySizeLimit: "8mb" }, // image/PDF uploads from the admin
  },
  // Old page addresses from the previous static site keep working.
  async redirects() {
    const map: [string, string][] = [
      ["/index.html", "/"],
      ["/projects.html", "/work/"],
      ["/creator.html", "/media-kit/"],
      ["/services.html", "/"],
      ["/resume.html", "/about/"],
      ["/extracurricular.html", "/about/"],
      ["/graphic-design.html", "/about/"],
      ["/contact.html", "/contact/"],
      ["/assets/Kumkum-dahreja-resume.pdf", "/files/Kumkum-dahreja-resume.pdf"],
    ];
    return map.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
