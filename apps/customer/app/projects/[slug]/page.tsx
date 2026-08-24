import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getProjectBySlug, getProjects } from "@/lib/data";

interface ProjectPageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found" };
  return { title: project.title, description: project.summary };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <>
      <Navbar />
      <main>
        {/* Header image */}
        <section className="bg-primary-950">
          <div className="container-site py-10 lg:py-14">
            <nav aria-label="Breadcrumb" className="text-sm text-primary-300">
              <Link href="/projects" className="transition-colors hover:text-accent">
                Projects
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">{project.title}</span>
            </nav>

            <div
              className={`relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-br ${project.gradient} shadow-card-hover`}
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]"
              />
              <div className="relative flex min-h-[280px] flex-col justify-end p-8 lg:min-h-[380px] lg:p-12">
                <span className="w-fit rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-primary-900 shadow-sm backdrop-blur">
                  {project.category}
                </span>
                <h1 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {project.title}
                </h1>
              </div>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-primary-300">
                  Client
                </dt>
                <dd className="mt-1 text-sm font-medium text-white">
                  {project.client}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-primary-300">
                  Year
                </dt>
                <dd className="mt-1 text-sm font-medium text-white">
                  {project.year}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-primary-300">
                  Category
                </dt>
                <dd className="mt-1 text-sm font-medium text-white">
                  {project.category}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Case study body */}
        <article className="container-site grid grid-cols-1 gap-12 py-16 lg:grid-cols-3 lg:py-20">
          <div className="space-y-16 lg:col-span-2">
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-primary-950">
                The Project
              </h2>
              <p className="mt-4 leading-relaxed text-neutral-600">
                {project.summary}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-primary-950">
                The Challenge
              </h2>
              <p className="mt-4 leading-relaxed text-neutral-600">
                {project.challenge}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-primary-950">
                The Solution
              </h2>
              <p className="mt-4 leading-relaxed text-neutral-600">
                {project.solution}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-primary-950">
                Features
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {project.features.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-medium text-neutral-700"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-primary-950">
                Preview
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                Screenshots and walkthroughs from the delivered product.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {project.gallery.map((label) => (
                  <figure
                    key={label}
                    className={`flex aspect-video items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-gradient-to-br ${project.gradient} p-6`}
                  >
                    <figcaption className="rounded-full bg-white/85 px-4 py-1.5 text-sm font-medium text-primary-900 backdrop-blur">
                      {label} — screenshot placeholder
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-primary-950">
                Technologies
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {project.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-700 ring-1 ring-inset ring-primary-100"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* CTA aside */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl bg-gradient-to-br from-primary-800 to-primary-600 p-6 shadow-card">
              <h2 className="text-xl font-bold text-white">
                Want something similar?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-primary-100/80">
                We can build a tailored version of this for your business — or
                something completely different that solves your exact problem.
              </p>
              <Button href="/request" variant="secondary" size="lg" className="mt-6 w-full">
                Start a Project
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Button>
              <p className="mt-3 text-center text-xs text-primary-200/70">
                Free consultation · No commitment
              </p>
            </div>
          </aside>
        </article>
      </main>
      <Footer />
    </>
  );
}
