"use client";

import { useMemo, useState } from "react";
import { LayoutGrid } from "lucide-react";

import { ProjectCard } from "@/components/ProjectCard";
import { cn } from "@/lib/utils";
import { PROJECT_CATEGORIES } from "@/lib/types";
import type { Project } from "@/lib/types";

const filters = ["All", ...PROJECT_CATEGORIES] as const;

type Filter = (typeof filters)[number];

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Filter>("All");

  const visible = useMemo(
    () =>
      active === "All"
        ? projects
        : projects.filter((project) => project.category === active),
    [active, projects]
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <LayoutGrid className="mr-1 h-4 w-4 text-neutral-400" aria-hidden />
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active === filter
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-neutral-600 ring-1 ring-neutral-200 hover:bg-neutral-50 hover:text-primary"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center text-sm text-neutral-500">
          No projects in this category yet — but we would love this one to be
          first.{" "}
        </p>
      )}
    </div>
  );
}
