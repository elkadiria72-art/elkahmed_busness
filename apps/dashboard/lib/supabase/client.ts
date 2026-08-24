import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/database.types";

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

/**
 * Authenticated browser client. All Storage uploads and table mutations from
 * the UI go through this client so RLS policies are enforced server-side.
 * Only the publishable (anon) key is used — never a service_role key.
 */
export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Copy .env.example to .env.local and fill in the values, then restart the dev server."
    );
  }

  if (!client) {
    client = createBrowserClient<Database>(url, anonKey);
  }
  return client;
}
