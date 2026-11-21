import { createClient } from "@/lib/supabase/server";
import { profileBundle } from "@/data/profile";
import { saveProfile } from "../../actions";
import { JsonEditor } from "@/components/admin/JsonEditor";

export default async function ProfileAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_profile").select("data").eq("id", 1).maybeSingle();
  const current = { ...profileBundle, ...(data?.data ?? {}) };

  return (
    <>
      <p className="label">About &amp; profile</p>
      <h1 className="display mt-2 text-[clamp(2rem,4vw,3rem)]">
        Your <em>details.</em>
      </h1>
      <p className="mt-2 max-w-2xl text-[14px] text-muted">
        Bio, current job, links, photos, experience, education, leadership and your resume PDF. Use “Upload file” next to any image or PDF.
      </p>
      <div className="mt-8">
        <JsonEditor initial={current} action={saveProfile} hint="Saving updates Home, About, Contact and the footer." />
      </div>
    </>
  );
}
