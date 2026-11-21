// Mirrors the planned `dev_projects` table.
export type ProjectCategory = "web" | "shopify" | "wordpress" | "app" | "design";

export type Project = {
  id: string;
  title: string;
  kind: string;
  category: ProjectCategory;
  image: string;
  url: string;
  summary: string;
  stack: string[];
  featured?: boolean;
  status?: "live" | "in-progress";
};

export const categories: { id: ProjectCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "shopify", label: "Shopify" },
  { id: "wordpress", label: "WordPress" },
  { id: "app", label: "App" },
  { id: "design", label: "Design" },
];

const img = (f: string) => `/images/projects/${f}`;

export const projects: Project[] = [
  { id: "mysticvibe", title: "Mystic Vibe", kind: "Hotel & banquet", category: "web", image: img("mysticvibe.jpg"), url: "https://www.mysticvibe.in/", summary: "Venue booking with packages, gallery and WhatsApp enquiries.", stack: ["PHP", "JS"], featured: true },
  { id: "tulip", title: "Tulip Hospitality", kind: "Travel & stays", category: "web", image: img("tulip-hospitality.jpg"), url: "https://www.tuliphospitality.in/", summary: "Boutique villa stays in Ramgarh & Nainital.", stack: ["PHP", "JS"], featured: true },
  { id: "bartkart", title: "BartKart", kind: "Android app", category: "app", image: img("bartkart.jpg"), url: "https://play.google.com/store/apps/details?id=com.bartkart", summary: "Barter, rent and sell items locally. Live on Google Play.", stack: ["Android"], featured: true },
  { id: "tbs", title: "The Branding Studio", kind: "Agency", category: "web", image: img("tbs.jpg"), url: "https://the-branding-studio-37jd.vercel.app/", summary: "Agency website on Next.js and Tailwind.", stack: ["Next.js", "TS"], featured: true },
  { id: "healin", title: "Healin.health", kind: "Health-tech", category: "web", image: img("healin-health-website.jpg"), url: "https://healin.health/", summary: "Wellness platform with integrated services.", stack: ["PHP", "JS"] },
  { id: "healin-cms", title: "Healin CMS", kind: "Internal tool", category: "web", image: img("healin-cms.jpg"), url: "https://app.healin.health/login", summary: "Custom CMS for health data and services.", stack: ["Next.js", "React"] },
  { id: "aws", title: "Adarsh World School", kind: "Education", category: "web", image: img("aws.jpg"), url: "https://adarshworldschool.co.in/", summary: "School portal built for parents and staff.", stack: ["HTML", "JS"] },
  { id: "golden-triangle", title: "Golden Triangle Tours", kind: "Tourism", category: "web", image: img("golden-triangle.jpg"), url: "https://www.goldentriangletourspackage.com/", summary: "Tour booking with forms and live chat.", stack: ["HTML", "JS"] },
  { id: "noida-airport", title: "Noida Airport", kind: "Information", category: "web", image: img("noida-airport.jpg"), url: "https://noida-airport.com/", summary: "Guide to the new international airport.", stack: ["HTML", "JS"] },
  { id: "explore-india", title: "Explore India Voyages", kind: "Tourism", category: "web", image: img("explore-india.jpg"), url: "https://exploreindiavoyages.com/", summary: "Tour operator with destination guides.", stack: ["PHP"] },
  { id: "building-guru", title: "My Building Guru", kind: "Construction", category: "web", image: img("building-guru.jpg"), url: "https://mybuildingguru.com/", summary: "Service website for construction work.", stack: ["PHP", "JS"] },
  { id: "ess-kicks", title: "ESS Kicks", kind: "E-commerce", category: "shopify", image: img("ess-kicks.jpg"), url: "https://esskicks.com/", summary: "Store for premium footwear.", stack: ["Shopify"] },
  { id: "pragya", title: "Pragya Stationery", kind: "E-commerce", category: "shopify", image: img("pragya-stationery.jpg"), url: "https://www.pragyaonline.com/?pb=0", summary: "Online store for a stationery brand.", stack: ["Shopify"] },
  { id: "sanskriti", title: "Sanskriti Gems", kind: "Portfolio", category: "wordpress", image: img("sanskriti-gems.jpg"), url: "https://sanskritigems.com/", summary: "Handcrafted Zardozi products.", stack: ["WordPress"] },
  { id: "taxi", title: "Chaudhary Taxi", kind: "Travel", category: "wordpress", image: img("taxi-service.jpg"), url: "https://chaudharytaxiservice.com/", summary: "Tourism and transport bookings.", stack: ["WordPress"] },
  { id: "classical", title: "Classical Holidays", kind: "Tourism", category: "wordpress", image: img("classical-holidays.jpg"), url: "https://classicalholidaysindia.com/", summary: "Detailed holiday packages.", stack: ["WordPress"] },
  { id: "figma", title: "Figma Designs", kind: "UI/UX", category: "design", image: img("my-figma-designs.jpg"), url: "https://www.figma.com/design/3bKY4GKsNzeYZUlIoM1ryr/My-Designs?node-id=0-1", summary: "Personal UI/UX concepts.", stack: ["Figma"] },
];
