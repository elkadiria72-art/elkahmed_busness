import { notFound } from "next/navigation";

import { ServiceEditor } from "@/components/ServiceEditor";
import { createSupabaseServerClient, requireAdmin } from "@/lib/supabase/server";
import type { Service } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit Service" };

interface ServicePageProps {
  params: { id: string };
}

export default async function ServiceEditPage({ params }: ServicePageProps) {
  // Defense in depth: layout gate + per-page re-check before any data access.
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) notFound();

  const supabase = createSupabaseServerClient();

  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!service) notFound();

  return <ServiceEditor service={service as Service} />;
}
