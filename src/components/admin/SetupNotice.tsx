import Link from "next/link";

/** Shown at /admin until the Supabase environment variables are set. */
export function SetupNotice() {
  const steps = [
    ["Create a free Supabase project", "supabase.com → New project (any name, region: Mumbai)."],
    ["Create the tables", "SQL Editor → paste supabase/schema.sql → Run. Then paste supabase/seed.sql → Run."],
    ["Create your login", "Authentication → Users → Add user (your email + a password). Then run supabase/make-admin.sql."],
    ["Connect the site", "Project Settings → API: copy the URL and publishable (anon) key into .env.local and into Vercel → Settings → Environment Variables."],
    ["Restart & sign in", "Restart npm run dev (or redeploy on Vercel) and open /admin."],
  ];
  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <p className="font-serif text-4xl">
        Admin setup<span className="text-rose">.</span>
      </p>
      <p className="mt-3 text-[15px] text-ink-soft">
        The dashboard needs your Supabase project. Until then the website keeps using the content in <code>src/data</code>, so nothing is broken.
      </p>
      <ol className="mt-8 space-y-3">
        {steps.map(([t, d], i) => (
          <li key={t} className="flex gap-4 rounded-[1.5rem] bg-paper p-5 ring-1 ring-line">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blush font-serif">{i + 1}</span>
            <span>
              <span className="block font-medium">{t}</span>
              <span className="text-[14px] text-ink-soft">{d}</span>
            </span>
          </li>
        ))}
      </ol>
      <Link href="/" className="mt-8 inline-block text-[14px] text-muted underline underline-offset-4 hover:text-rose">
        ← Back to the website
      </Link>
    </main>
  );
}
