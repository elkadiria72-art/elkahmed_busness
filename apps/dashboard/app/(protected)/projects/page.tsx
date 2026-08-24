import Link from "next/link";
import { Plus } from "lucide-react";

import { StatusBadge } from "@/components/StatusBadge";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  // Role verified by the protected layout.
  const supabase = createSupabaseServerClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary-950 sm:text-3xl">
            Projects
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Manage active and delivered client work.
          </p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" aria-hidden />
          New Project
        </Link>
      </header>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-5 py-3 font-medium">Project</th>
              <th className="px-5 py-3 font-medium">Client</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {(projects ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-neutral-400">
                  No projects yet.
                </td>
              </tr>
            )}
            {(projects ?? []).map((project) => (
              <tr key={project.id} className="hover:bg-neutral-50/60">
                <td className="px-5 py-3.5 font-medium text-primary-950">
                  <Link href={`/projects/${project.id}`} className="hover:text-accent-600">
                    {project.title}
                  </Link>
                </td>
                <td className="px-5 py-3.5 text-neutral-600">{project.client}</td>
                <td className="px-5 py-3.5 text-neutral-600">{project.category}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-5 py-3.5 text-xs text-neutral-500">
                  {formatDate(project.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
