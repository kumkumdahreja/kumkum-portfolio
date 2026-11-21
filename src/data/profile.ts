/**
 * Content layer
 * -------------
 * Everything the site shows lives in src/data. Each file mirrors a table
 * from the planned admin-panel database (Supabase):
 *   profile.ts    -> profile_resume
 *   projects.ts   -> dev_projects
 *   collabs.ts    -> social_collabs
 *   mediakit.ts   -> mediakit_config
 * When the admin panel is built, these imports get swapped for database
 * reads; the components don't need to change.
 */

export const profile = {
  name: "Kumkum Dahreja",
  firstName: "Kumkum",
  location: "Mathura, India",
  roles: ["Web developer", "Café & food creator"],
  email: "kumkumdahrejawork@gmail.com",
  resumeUrl: "/files/Kumkum-dahreja-resume.pdf",
  currently: "Web Developer at Biz Emporia Consultancy",
  bio: "Life's too short for boring hair & basic bios ✨",
  studying: "MCA, Galgotias University (Online)",
  socials: {
    instagram: {
      handle: "@kumkum_dahreja",
      label: "Lifestyle",
      url: "https://www.instagram.com/kumkum_dahreja?igsh=enF5MHI3dTl6N21t",
    },
    food: {
      handle: "@platesbykumkum",
      label: "Food",
      url: "https://www.instagram.com/platesbykumkum?evlk=dXYzOWt4YzU4bTVu",
    },
    linkedin: { handle: "in/kumkumdahreja", url: "https://linkedin.com/in/kumkumdahreja" },
    github: { handle: "kumkumdahreja", url: "https://github.com/kumkumdahreja" },
    linktree: { handle: "linktr.ee/kumkum_dahreja", url: "https://linktr.ee/kumkum_dahreja" },
  },
  photos: {
    hero: "/images/photos/kumkum-1346.jpg",
    kit: "/images/photos/kumkum-0108.jpg",
    stack: [
      "/images/photos/kumkum-0588-sm.jpg",
      "/images/photos/kumkum-1458-sm.jpg",
      "/images/photos/kumkum-0571-sm.jpg",
    ],
    gallery: [
      { src: "/images/photos/kumkum-0588-sm.jpg", alt: "Digging into a café meal" },
      { src: "/images/photos/kumkum-0571-sm.jpg", alt: "Café drinks shoot" },
      { src: "/images/photos/kumkum-1458-sm.jpg", alt: "Sunlit café portrait" },
      { src: "/images/photos/kumkum-0099-sm.jpg", alt: "Café lifestyle shoot" },
      { src: "/images/photos/kumkum-0863-sm.jpg", alt: "Festive lehenga look" },
      { src: "/images/photos/kumkum-1330-sm.jpg", alt: "Street portrait" },
      { src: "/images/photos/kumkum-0202-sm.jpg", alt: "Rooftop café look" },
      { src: "/images/photos/kumkum-0216-sm.jpg", alt: "Evening café portrait" },
    ],
  },
};

export const experience: { role: string; org: string; period: string; points?: string[] }[] = [
  {
    role: "Web Developer",
    org: "Biz Emporia Consultancy Pvt. Ltd.",
    period: "Jun 2026 – now",
  },
  {
    role: "Web Developer Engineer",
    org: "CODEC Networks",
    period: "Feb – May 2026",
  },
  {
    role: "Website Developer (Executive)",
    org: "The Branding Studio",
    period: "Nov 2025 – Jan 2026",
    points: [
      "Promoted from intern to executive.",
      "Built the Adarsh World School website for parents and staff.",
      "Designed and shipped the studio's own Next.js website.",
    ],
  },
  {
    role: "Website Developer Intern",
    org: "The Branding Studio",
    period: "Aug – Nov 2025",
    points: [
      "Built the Healin.health platform and its custom CMS.",
      "Maintained and optimised sites for long-term clients.",
    ],
  },
  {
    role: "Front End Developer Intern",
    org: "Turning Point Infotech",
    period: "Jun – Aug 2025",
    points: ["Responsive interfaces, UI/UX implementation, performance and accessibility."],
  },
  {
    role: "Full Stack Developer",
    org: "WebPy SEO Club",
    period: "Jan – May 2025",
    points: ["Delivered 5+ live tourism, e-commerce and portfolio sites."],
  },
  {
    role: "UI/UX Designer",
    org: "Founders Gang",
    period: "Nov 2024 – Jan 2025",
    points: ["Interfaces, wireframes and prototypes in Figma, plus usability testing."],
  },
];

export const education = [
  { degree: "MCA", school: "Galgotias University (Online)", period: "2025 – 2027" },
  { degree: "BCA", school: "GLA University, Mathura", period: "2022 – 2025" },
];

export const certificates = [
  { title: "Frontend Development with JavaScript & React.js", issuer: "Microsoft Learn & GDSC", year: "2023" },
  { title: "Cyber Security Essentials", issuer: "Cisco Networking Academy", year: "2024" },
  { title: "Introduction to MongoDB", issuer: "MongoDB University", year: "2024" },
  { title: "Fundamentals of Digital Marketing", issuer: "Google Digital Garage", year: "" },
];

export const skills = [
  "React", "Next.js", "TypeScript", "JavaScript", "Tailwind", "PHP",
  "WordPress", "Shopify", "Figma", "Android Studio", "MongoDB", "SEO",
];

export const leadership = [
  {
    role: "President",
    org: "Abacus Society, GLA University",
    period: "2024 – 25",
    image: "/images/events/abacus-events.jpg",
    highlight: "Led 30 members · monthly Codathon with 300+ participants",
  },
  {
    role: "Editorial Co-head",
    org: "GLA Alumni Association",
    period: "2024 – 25",
    image: "/images/events/Alumni.jpg",
    highlight: "Alumni newsletter, interviews and event anchoring",
  },
  {
    role: "HackVision Hackathon",
    org: "Organiser",
    period: "Nov 2024",
    image: "/images/events/hackathon.jpg",
    highlight: "50+ participants · 10 hours · 3 winning teams",
  },
  {
    role: "Mega Job Fair",
    org: "Ceremonies lead",
    period: "Apr 2024",
    image: "/images/events/job-fair.jpg",
    highlight: "40+ companies · 300+ jobs · 1000+ students",
  },
];

export const designWork = [
  { title: "Presentation decks", file: "/files/presentation_file.pdf", download: "Presentation_KumkumDahreja.pdf" },
  { title: "LinkedIn covers", file: "/files/linkedin_covers.pdf", download: "LinkedInCovers_KumkumDahreja.pdf" },
  { title: "Social media posts", file: "/files/social_media_posts.pdf", download: "SocialMediaPosts_KumkumDahreja.pdf" },
];

/** Everything the About/Home/Contact pages need, as one object (mirrors `site_profile.data`). */
export const profileBundle = {
  ...profile,
  experience,
  education,
  certificates,
  skills,
  leadership,
  designWork,
};

export type SiteProfile = typeof profileBundle;
