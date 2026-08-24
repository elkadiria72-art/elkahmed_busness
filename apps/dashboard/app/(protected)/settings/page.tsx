import { SettingsModule } from "@/components/SettingsModule";
import { createSupabaseServerClient, requireAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  // Re-verify admin before reading anything — even though the layout gated
  // non-admins already. No data is fetched until this passes.
  const guard = await requireAdmin();
  if (!guard.isAdmin || !guard.userId || !guard.email) {
    throw new Error("Unauthorized");
  }

  const supabase = createSupabaseServerClient();

  // Singleton row (id = 1, enforced by CHECK constraint).
  const { data: settings } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();

  return (
    <SettingsModule
      userId={guard.userId}
      userEmail={guard.email}
      initialSettings={settings ?? null}
    />
  );
}
