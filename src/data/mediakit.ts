// Mirrors the `mediakit_snapshots` table (one snapshot per month).
// This file is the fallback used until Supabase is connected; after that,
// update the numbers from /admin/media-kit.
export const mediakit = {
  period: "21 Oct – 21 Nov 2026",
  views: 77617,
  viewsDelta: 65.2,
  reach: 30307,
  reachDelta: 78.3,
  followers: 799,
  followersDelta: 3.6,
  profileVisits: 2451,
  linkTaps: 41,
  followerViews: 24041,
  nonFollowerViews: 53177,
  formats: [
    { label: "Reels", views: 53300, interactions: 2400 },
    { label: "Stories", views: 14500, interactions: 798 },
    { label: "Posts", views: 9300, interactions: 331 },
  ],
  topReels: [109000, 14100, 12200, 6200, 5900, 3900], // views, last 180 days
  audience: {
    gender: [
      { label: "Men", value: 65 },
      { label: "Women", value: 34 },
    ],
    age: [
      { label: "13–17", value: 2.8 },
      { label: "18–24", value: 39.6 },
      { label: "25–34", value: 42.4 },
      { label: "35–44", value: 9.4 },
      { label: "45–54", value: 3.7 },
      { label: "55+", value: 2.2 },
    ],
    cities: [
      { label: "Delhi", value: 7.5 },
      { label: "Vrindavan", value: 6.4 },
      { label: "Agra", value: 6.4 },
      { label: "Greater Noida", value: 6.4 },
      { label: "Mathura", value: 6.2 },
    ],
    languages: [
      { label: "English", value: 50.1 },
      { label: "Hindi", value: 47.1 },
      { label: "Gujarati", value: 1.0 },
    ],
    countries: [
      { label: "India", value: 95.5 },
      { label: "USA", value: 0.9 },
      { label: "Pakistan", value: 0.9 },
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

/** 77617 -> "77.6K", 109000 -> "109K", 799 -> "799" */
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
