import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./types";

/**
 * Public (anon) credentials — injected at build/dev time via environment.
 * Placeholder empty strings keep the module importable before .env is set up;
 * never hardcode real keys here.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let browserClient: SupabaseClient<Database> | undefined;

/**
 * Returns a singleton Supabase browser client typed against the `Database`
 * schema. Instantiated lazily so importing this module never throws while
 * the env vars are still placeholder values.
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> {
  if (!browserClient) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn(
        "[@elkahmed/supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set. " +
          "Add them to your .env.local before making any requests."
      );
    }
    browserClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return browserClient;
}
