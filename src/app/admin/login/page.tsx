import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  if (!isSupabaseConfigured) return <SetupNotice />;
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5">
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blush opacity-80 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-lavender opacity-80 blur-3xl" />
      <div className="relative w-full max-w-sm rounded-[2rem] bg-paper/90 p-8 shadow-xl ring-1 ring-line backdrop-blur">
        <p className="font-serif text-3xl">
          Kumkum<span className="text-rose">.</span>
        </p>
        <p className="mt-1 text-[14px] text-muted">Sign in to your dashboard</p>
        <LoginForm />
      </div>
    </main>
  );
}
