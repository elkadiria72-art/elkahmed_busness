"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export interface AdminCheck {
  isAdmin: boolean;
  userId: string | null;
}

/**
 * Client-side belt-and-braces check run before every mutation. The real
 * enforcement is RLS on the server — this only avoids pointless requests and
 * gives instant feedback if the session role changed mid-session.
 */
export async function ensureAdmin(): Promise<AdminCheck> {
  const supabase = getSupabaseBrowserClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { isAdmin: false, userId: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return { isAdmin: profile?.role === "admin", userId: user.id };
}
