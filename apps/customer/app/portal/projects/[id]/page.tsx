import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/StatusBadge";
import { getPortalProject, getPortalProjects } from "@/lib/data";
import { formatDate } from "@/lib/utils";

import { ProjectTabs } from "./ProjectTabs";

interface PortalProjectPageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const projects = await getPortalProjects();
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({
  params,
}: PortalProjectPageProps): Promise<Metadata> {
  const project = await getPortalProject(params.id);
  return { title: project ? `${project.name} — Client Portal` : "Client Portal" };
}

export default async function PortalProjectPage({
  params,
}: PortalProjectPageProps) {
  const project = await getPortalProject(params.id);
  if (!project) notFound();

  return (
    <div className="space-y-8">
      <Link
        href="/portal"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to dashboard
      </Link>

      <header className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary-950">
              {project.name}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">{project.serviceType}</p>
          </div>
          <StatusBadge status={project.status} />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Overall progress</span>
            <span className="font-semibold text-primary">{project.progress}%</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-neutral-100 pt-5 sm:grid-cols-2">
          <div className="flex items-center gap-2.5 text-sm text-neutral-600">
            <CalendarDays className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
            <dt className="text-neutral-500">Deadline:</dt>
            <dd className="font-medium text-neutral-800">
              {formatDate(project.deadline)}
            </dd>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-neutral-600">
            <Clock3 className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
            <dt className="text-neutral-500">Last update:</dt>
            <dd className="font-medium text-neutral-800">
              {formatDate(project.lastUpdate)}
            </dd>
          </div>
        </dl>
      </header>

      <ProjectTabs project={project} />
    </div>
  );
}
