import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * TEMPORARY debug endpoint — shows exactly what the server-side admin gate
 * sees for the current session. Delete before production.
 */
export async function GET() {
  const supabase = createSupabaseServerClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (!userData?.user) {
    return NextResponse.json({
      signedIn: false,
      userError: userError?.message ?? null,
    });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("id", userData.user.id)
    .maybeSingle();

  return NextResponse.json({
    signedIn: true,
    authUserEmail: userData.user.email,
    authUserId: userData.user.id,
    profile,
    profileError: profileError?.message ?? null,
    isAdmin: profile?.role === "admin",
    projectRef: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0]
      : null,
  });
}
