// Public site address for SEO (canonical links, sitemap, social previews).
// On Vercel this is detected automatically; set NEXT_PUBLIC_SITE_URL to override
// (e.g. when a custom domain is added later).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "Kumkum Dahreja";

export const DEFAULT_DESCRIPTION =
  "Kumkum Dahreja is a web developer and café, food & lifestyle content creator from Mathura, India. Explore her websites, Instagram reels, brand collaborations and media kit.";

export const KEYWORDS = [
  "Kumkum Dahreja",
  "kumkum_dahreja",
  "platesbykumkum",
  "web developer Mathura",
  "Next.js developer India",
  "React developer",
  "freelance web developer",
  "food blogger Mathura",
  "food blogger Vrindavan",
  "café content creator Delhi NCR",
  "Instagram influencer Mathura",
  "UGC creator India",
  "influencer media kit",
  "Biz Emporia Consultancy",
];
