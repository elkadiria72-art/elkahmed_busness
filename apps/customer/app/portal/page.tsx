import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, MessageSquare } from "lucide-react";

import { StatusBadge } from "@/components/StatusBadge";
import { Timeline } from "@/components/Timeline";
import { getPortalProjects } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { TIMELINE_STEPS } from "@/lib/types";
import type { TimelineEntry } from "@/lib/types";

const stats = [
  { label: "Active projects", value: "3", icon: FileText },
  { label: "Awaiting your feedback", value: "1", icon: MessageSquare },
  { label: "Files shared", value: "8", icon: CalendarDays },
];

function buildTimelineEntries(
  currentIndex: number,
  lastUpdate: string
): TimelineEntry[] {
  return TIMELINE_STEPS.map((label, index) => {
    if (index < currentIndex) {
      return { label, date: "Completed" };
    }
    if (index === currentIndex) {
      return { label, date: `Since ${formatDate(lastUpdate)}` };
    }
    return { label };
  });
}

export default async function PortalOverviewPage() {
  const projects = await getPortalProjects();
  // Demo timeline state mirrors the most advanced project
  const furthest = Math.max(...projects.map((project) => project.currentStep));
  const reference = projects.find((project) => project.currentStep === furthest);
  const timelineSteps = buildTimelineEntries(furthest, reference?.lastUpdate ?? new Date().toISOString());

  return (
    <div className="space-y-10">
      {/* Welcome */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-primary-950 sm:text-3xl">
          Welcome back, Ahmed
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Here&rsquo;s what&rsquo;s happening with your projects today.
        </p>
      </header>

      {/* Quick stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-card"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 ring-1 ring-primary-100">
                <Icon className="h-5 w-5 text-primary" aria-hidden />
              </div>
              <div>
                <p className="text-xl font-bold text-primary-950">{stat.value}</p>
                <p className="text-xs text-neutral-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Projects + timeline */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <section id="projects" className="space-y-4 xl:col-span-2">
          <h2 className="text-lg font-bold text-primary-950">My Projects</h2>
          {projects.map((project) => (
            <article
              key={project.id}
              className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-primary-950">{project.name}</h3>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {project.serviceType}
                  </p>
                </div>
                <StatusBadge status={project.status} />
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Progress</span>
                  <span className="font-semibold text-primary">{project.progress}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4">
                <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                  Deadline {formatDate(project.deadline)} · Updated{" "}
                  {formatDate(project.lastUpdate)}
                </span>
                <Link
                  href={`/portal/projects/${project.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-accent-600 transition-colors hover:text-accent-500"
                >
                  View details
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </section>

        <aside className="xl:sticky xl:top-10 xl:self-start">
          <h2 className="text-lg font-bold text-primary-950">Project Progress</h2>
          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
            <Timeline steps={timelineSteps} currentIndex={furthest} />
            <p className="mt-6 border-t border-neutral-100 pt-4 text-xs leading-relaxed text-neutral-500">
              Every project moves through these six stages. You will get an
              update in the portal each time a stage completes.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
