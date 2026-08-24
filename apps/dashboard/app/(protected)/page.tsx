import { RequestsLive } from "@/components/RequestsLive";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  // Role was already verified by the protected layout — safe to query.
  const supabase = createSupabaseServerClient();

  const { data: requests } = await supabase
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-primary-950 sm:text-3xl">
          Overview
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Incoming project requests — updates arrive in real time.
        </p>
      </header>

      <RequestsLive initialRequests={requests ?? []} />
    </div>
  );
}
