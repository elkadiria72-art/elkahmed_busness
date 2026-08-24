import { AccessDenied } from "@/components/AccessDenied";
import { DashboardShell } from "@/components/DashboardShell";
import { requireAdmin } from "@/lib/supabase/server";

/**
 * Server-side admin gate for every protected page. The role check runs BEFORE
 * any other query or data fetch — non-admins get the empty "Access Denied"
 * screen and nothing else.
 */
export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isAdmin, userId, email } = await requireAdmin();

  if (!isAdmin || !userId || !email) {
    return <AccessDenied />;
  }

  return (
    <DashboardShell userEmail={email} userId={userId}>
      {children}
    </DashboardShell>
  );
}
