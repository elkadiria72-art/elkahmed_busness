import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PriceTag } from "@/components/PriceTag";
import { ProjectCard } from "@/components/ProjectCard";
import { getServiceBySlug, getServices, getProjectsBySlugs } from "@/lib/data";

interface ServicePageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) return { title: "Service Not Found" };
  return { title: service.title, description: service.tagline };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const service = await getServiceBySlug(params.slug);
  if (!service) notFound();

  const examples = await getProjectsBySlugs(service.exampleSlugs);

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="bg-primary-900 py-16 lg:py-20">
          <div className="container-site">
            <nav aria-label="Breadcrumb" className="text-sm text-primary-200/70">
              <Link href="/services" className="transition-colors hover:text-accent">
                Services
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">{service.title}</span>
            </nav>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {service.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-primary-100/80">
              {service.description}
            </p>
          </div>
        </section>

        <div className="container-site grid grid-cols-1 gap-12 py-16 lg:grid-cols-3 lg:py-20">
          {/* Main column */}
          <div className="space-y-16 lg:col-span-2">
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-primary-950">
                What we build
              </h2>
              <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                {service.whatWeBuild.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15">
                      <Check className="h-3.5 w-3.5 text-accent-600" aria-hidden />
                    </span>
                    <span className="text-sm text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-primary-950">
                How it works
              </h2>
              <ol className="mt-6 space-y-6 border-l-2 border-neutral-100 pl-6">
                {service.process.map((step, index) => (
                  <li key={step.title} className="relative">
                    <span className="absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-accent bg-white" />
                    <h3 className="text-base font-semibold text-primary-950">
                      <span className="mr-2 text-sm font-bold text-accent-600">
                        Step {index + 1}
                      </span>
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-primary-950">
                Features
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {service.features.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-xl border border-neutral-200 bg-white p-5 shadow-card"
                  >
                    <h3 className="text-base font-semibold text-primary-950">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {examples.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold tracking-tight text-primary-950">
                  Examples
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                  Related projects delivered for clients like you.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {examples.map((project) => (
                    <ProjectCard key={project.slug} project={project} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Aside */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
              <h2 className="text-lg font-semibold text-primary-950">
                What&rsquo;s included
              </h2>
              <ul className="mt-4 space-y-3">
                {service.included.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent-600"
                      aria-hidden
                    />
                    <span className="text-sm text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-lg bg-primary-50 p-4 ring-1 ring-primary-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                  Pricing
                </p>
                <div className="mt-1.5">
                  <PriceTag
                    price={service.price ?? null}
                    discountPrice={service.discountPrice ?? null}
                    currency={service.currency}
                  />
                </div>
                <p className="mt-1.5 text-xs text-neutral-500">
                  Every project is scoped individually — you only pay for what
                  you need.
                </p>
              </div>

              <Button href="/request" size="lg" className="mt-6 w-full">
                Request This Service
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Button>
              <p className="mt-3 text-center text-xs text-neutral-500">
                Free consultation · Reply within 48 hours
              </p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
