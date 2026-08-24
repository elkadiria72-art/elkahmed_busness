import { notFound } from "next/navigation";

import { ProjectDetail } from "@/components/ProjectDetail";
import { createSupabaseServerClient, requireAdmin } from "@/lib/supabase/server";
import type { FileRow, Message, Project } from "@/lib/database.types";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: { id: string };
}

export const metadata = { title: "Project" };

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  // Defense in depth: the layout already gated non-admins; re-verify before
  // touching data on this page too.
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) notFound();

  const supabase = createSupabaseServerClient();

  const [projectResult, messagesResult, filesResult] = await Promise.all([
    supabase.from("projects").select("*").eq("id", params.id).maybeSingle(),
    supabase
      .from("messages")
      .select("*")
      .eq("project_id", params.id)
      .order("created_at", { ascending: true })
      .limit(200),
    supabase
      .from("files")
      .select("*")
      .eq("project_id", params.id)
      .order("created_at", { ascending: false }),
  ]);

  if (!projectResult.data) notFound();

  return (
    <ProjectDetail
      project={projectResult.data as Project}
      initialMessages={(messagesResult.data ?? []) as Message[]}
      initialFiles={(filesResult.data ?? []) as FileRow[]}
    />
  );
}
