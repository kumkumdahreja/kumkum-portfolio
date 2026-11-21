# Kumkum Dahreja · Portfolio, Media Kit & Admin

Personal site + private dashboard for Kumkum Dahreja, web developer and café, food & lifestyle creator.

**Stack:** Next.js 15 · React 19 · Tailwind CSS 4 · Motion · Supabase (database, login, file storage) · hosted on Vercel.

- Public site: Home · Work · Media kit · About · Contact
- Private admin: `/admin` (Overview, Collab tracker, Projects, Brands & cafés, Reels, Media kit, About & profile)

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000  ·  admin at /admin
```

Without Supabase keys the site uses the content in `src/data/` and `/admin` shows a setup guide.

## One-time setup (about 10 minutes)

1. **Supabase** → [supabase.com](https://supabase.com) → sign up (Continue with GitHub) → New project (free plan, region Mumbai).
2. **Your login** → Authentication → Users → *Add user* → *Create new user* (email + password, tick *Auto Confirm User*).
3. **Tables + your data** → SQL Editor → New query → paste all of `supabase/setup.sql` → Run.
   (It creates the tables and security rules, imports every current project, collab, reel, media-kit number and profile detail, and makes your login the admin. If you used a different email than `kumkumdahrejawork@gmail.com`, change it in the last lines first.)
4. **Keys** → Project Settings → API Keys / Data API. Copy `.env.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...   (the publishable / anon key, never the secret/service key)
   ```
5. **Vercel** → Import the GitHub repo → add the same two variables (plus optional `CRON_SECRET`) → Deploy.
   In Supabase → Authentication → URL Configuration, set the Site URL to your Vercel address.

## How updating works

| You do this in /admin | The website does this |
|---|---|
| Mark a project **Delivered** | It appears on the Work page automatically (switch it off any time) |
| Toggle **Feature on Home** | Shows it in "Recently shipped" |
| Save this month's **Media kit** numbers | Media kit + Home update, growth % and "K" formatting worked out |
| Add a **reel** by pasting its link | Cover is fetched, reel appears in "Tap to watch" |
| Edit **About & profile** | Home, About, Contact and footer update |
| Track **deals, deliverables, payments** | Nothing. These stay private in the admin |

Every save refreshes the live site straight away.

## SEO (Google)

Built in: page titles & descriptions, canonical links, Open Graph/Twitter share images, `Person` structured data (name, job, Mathura, Instagram/LinkedIn/GitHub links), `sitemap.xml`, `robots.txt` (admin hidden), web manifest and icons. The site URL is detected from Vercel automatically.

After the site is live:
1. [Google Search Console](https://search.google.com/search-console) → Add property → *URL prefix* → your Vercel URL.
2. Choose *HTML tag* verification, copy the `content="..."` value, add it in Vercel as `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, redeploy, then click *Verify*.
3. Sitemaps → submit `sitemap.xml`. Then URL Inspection → *Request indexing* for the home page.
4. Put the site link in your Instagram bio, Linktree, LinkedIn and GitHub profile; links from your own profiles help Google connect your name to the site.

## Privacy

Money, deliverables, dates and contacts live in private tables (`project_private`, `deals`) protected by Supabase Row Level Security. Only accounts listed in `admins` can read them; the public website never queries them.

## Notes

- `vercel.json` runs a daily ping (`/api/keepalive`) so the free Supabase project doesn't pause for inactivity.
- `npm run seed:generate` rebuilds `supabase/seed.sql` from `src/data/` if you ever need a fresh import.
- Full-size original photos live in `photos-original/` (git-ignored, not published).

## Contact

kumkumdahrejawork@gmail.com · [Instagram](https://www.instagram.com/kumkum_dahreja) · [Food page](https://www.instagram.com/platesbykumkum) · [LinkedIn](https://linkedin.com/in/kumkumdahreja) · [GitHub](https://github.com/kumkumdahreja) · [Linktree](https://linktr.ee/kumkum_dahreja)
