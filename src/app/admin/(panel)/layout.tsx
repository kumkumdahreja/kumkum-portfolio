import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../actions";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) return <SetupNotice />;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) {
    return (
      <main className="grid min-h-screen place-items-center px-5 text-center">
        <div className="max-w-md">
          <p className="font-serif text-3xl">Almost there</p>
          <p className="mt-3 text-[14px] text-ink-soft">
            You&apos;re signed in as <b>{user.email}</b>, but this account isn&apos;t an admin yet. Run{" "}
            <code className="rounded bg-paper px-1.5 py-0.5">supabase/make-admin.sql</code> in the Supabase SQL editor, then refresh.
          </p>
          <form action={signOut} className="mt-6">
            <button className="rounded-full bg-ink px-5 py-2.5 text-[14px] text-cream">Sign out</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="md:flex">
      <AdminNav />
      <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
