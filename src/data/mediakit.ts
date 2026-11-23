// Mirrors the `mediakit_snapshots` table (one snapshot per month).
// This file is the fallback used until Supabase is connected; after that,
// update the numbers from /admin/media-kit.
export const mediakit = {
  period: "22 Oct – 22 Nov 2026",
  views: 150843,
  viewsDelta: 148.9,
  reach: 93172,
  reachDelta: 320.6,
  followers: 797,
  followersDelta: 3.4,
  profileVisits: 2596,
  linkTaps: 42,
  followerViews: 26142,
  nonFollowerViews: 124276,
  formats: [
    { label: "Reels", views: 55800, interactions: 2500 },
    { label: "Stories", views: 14900, interactions: 815 },
    { label: "Posts", views: 10500, interactions: 406 },
  ],
  topReels: [109000, 71000, 12200, 6300, 3900, 3600], // views, last 180 days
  audience: {
    gender: [
      { label: "Men", value: 65 },
      { label: "Women", value: 35 },
    ],
    age: [
      { label: "13–17", value: 2.8 },
      { label: "18–24", value: 39.3 },
      { label: "25–34", value: 42.3 },
      { label: "35–44", value: 9.7 },
      { label: "45–54", value: 3.7 },
      { label: "55–64", value: 1.1 },
      { label: "65+", value: 1.1 },
    ],
    cities: [
      { label: "Mathura", value: 6.9 },
      { label: "Vrindavan", value: 6.9 },
      { label: "Delhi", value: 6.9 },
      { label: "Agra", value: 6.4 },
      { label: "Greater Noida", value: 6.1 },
    ],
    languages: [
      { label: "English", value: 49.4 },
      { label: "Hindi", value: 47.6 },
      { label: "Bengali", value: 1.0 },
      { label: "Gujarati", value: 1.0 },
      { label: "Marathi", value: 0.3 },
    ],
    countries: [
      { label: "India", value: 95.6 },
      { label: "USA", value: 0.9 },
      { label: "Pakistan", value: 0.9 },
      { label: "Bangladesh", value: 0.5 },
      { label: "Saudi Arabia", value: 0.4 },
    ],
    activeHours: "6 – 9 PM",
    activeDays: ["Tue", "Wed", "Thu"],
  },
  packages: [
    { title: "Café feature", items: ["1 Reel at your venue", "2 Stories", "Collab post"], tone: "blush" },
    { title: "Brand reel", items: ["1 dedicated Reel", "Stories + link", "Honest review"], tone: "lavender" },
    { title: "UGC video", items: ["Vertical video", "For your ads", "No post on my page"], tone: "mint" },
    { title: "Modelling", items: ["Beauty & fashion", "Product shoots", "Delhi NCR · Agra"], tone: "butter" },
  ],
};

export type MediaKit = typeof mediakit;

/** 150843 -> "150.8K", 109000 -> "109K", 799 -> "799" */
export const compact = (n: number) => {
  if (n < 1000) return `${n}`;
  const k = Math.round(n / 100) / 10;
  return `${Number.isInteger(k) ? k : k.toFixed(1)}K`;
};

/** Props for <Counter> so it counts up to the compact form. */
export const counterParts = (n: number) => {
  if (n < 1000) return { to: n, decimals: 0, suffix: "" };
  const k = Math.round(n / 100) / 10;
  return { to: k, decimals: Number.isInteger(k) ? 0 : 1, suffix: "K" };
};

export const totalInteractions = (m: MediaKit) => m.formats.reduce((a, f) => a + f.interactions, 0);
export const nonFollowerShare = (m: MediaKit) =>
  Math.round((m.nonFollowerViews / Math.max(1, m.nonFollowerViews + m.followerViews)) * 100);
