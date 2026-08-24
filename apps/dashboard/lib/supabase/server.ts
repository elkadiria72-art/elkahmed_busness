import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/lib/database.types";

/**
 * Server component / route-handler client. Uses the anon key — the session
 * user's JWT is attached automatically from cookies, so every query is still
 * subject to RLS. The service_role key is never used in this app.
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — safe to ignore because
            // middleware refreshes sessions before they expire.
          }
        },
      },
    }
  );
}

export interface AdminGuardResult {
  isAdmin: boolean;
  userId: string | null;
  email: string | null;
}

/**
 * Server-side admin gate. Returns minimal identity info only after the role
 * check completes; callers must not run any other queries before this.
 */
export async function requireAdmin(): Promise<AdminGuardResult> {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isAdmin: false, userId: null, email: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    isAdmin: profile?.role === "admin",
    userId: user.id,
    email: user.email ?? null,
  };
}
