import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Case studies of websites, web apps, marketplaces, dashboards and digital products built by Elkahmed Business.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-primary-900 py-16 lg:py-20">
          <div className="container-site">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-400">
              Our Work
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Projects that moved businesses forward
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-primary-100/80">
              Real products for real clients. Filter by category and click any
              project to read the full case study.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="container-site">
            <ProjectsGrid projects={projects} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
