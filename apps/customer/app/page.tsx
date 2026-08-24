import {
  ArrowRight,
  HeartHandshake,
  MessageSquare,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ProjectCard } from "@/components/ProjectCard";
import { ServiceCard } from "@/components/ServiceCard";
import { getFeaturedProjects, getServices } from "@/lib/data";

const processSteps = [
  {
    number: "01",
    title: "Request",
    description:
      "Tell us about your idea through the project request form — goals, scope and timeline.",
  },
  {
    number: "02",
    title: "Review",
    description:
      "We analyze your requirements and come back with a clear proposal, timeline and quote.",
  },
  {
    number: "03",
    title: "Development",
    description:
      "We build in iterative sprints with regular demos, so you see progress every week.",
  },
  {
    number: "04",
    title: "Delivery",
    description:
      "We launch, hand over documentation and stay available for support as you grow.",
  },
];

const differentiators = [
  {
    icon: ShieldCheck,
    title: "Quality First",
    description:
      "Clean architecture, tested code and reviews on every release — no shortcuts.",
  },
  {
    icon: MessageSquare,
    title: "Clear Communication",
    description:
      "Weekly updates and a client portal where you can follow every step.",
  },
  {
    icon: Rocket,
    title: "On-Time Delivery",
    description:
      "Realistic timelines we actually hit. Milestones you can plan your business around.",
  },
  {
    icon: HeartHandshake,
    title: "Long-Term Partner",
    description:
      "We stick around after launch with support and improvements as you scale.",
  },
];

export default async function HomePage() {
  const [services, featuredProjects] = await Promise.all([
    getServices(),
    getFeaturedProjects(),
  ]);

  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-primary-900">
          <div
            aria-hidden
            className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-primary-400/20 blur-3xl"
          />
          <div className="container-site relative py-24 lg:py-32">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-300">
              Digital Agency &amp; Product Studio
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              We Build Digital Experiences That{" "}
              <span className="text-accent">Move Businesses Forward</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-100/80">
              From high-converting websites to complex web applications and
              marketplaces, Elkahmed Business turns ambitious ideas into products
              your customers will love.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button href="/projects" variant="secondary" size="lg">
                Explore Our Work
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Button>
              <Button
                href="/request"
                size="lg"
                variant="ghost"
                className="border-white/30 text-white hover:border-white/60 hover:text-white"
              >
                Start a Project
              </Button>
            </div>

            <dl className="mt-16 grid max-w-xl grid-cols-3 gap-8 border-t border-white/10 pt-8">
              <div>
                <dt className="text-sm text-primary-200/70">Projects delivered</dt>
                <dd className="mt-1 text-2xl font-bold text-white">40+</dd>
              </div>
              <div>
                <dt className="text-sm text-primary-200/70">Happy clients</dt>
                <dd className="mt-1 text-2xl font-bold text-white">25+</dd>
              </div>
              <div>
                <dt className="text-sm text-primary-200/70">Core services</dt>
                <dd className="mt-1 text-2xl font-bold text-white">6</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Services preview */}
        <section className="py-20 lg:py-24">
          <div className="container-site">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">
                Our Services
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
                Everything you need to win online
              </h2>
              <p className="mt-4 text-neutral-600">
                Six focused services covering the full journey — from your first
                landing page to platforms serving thousands of users.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button href="/services" variant="ghost" size="lg">
                View All Services
              </Button>
            </div>
          </div>
        </section>

        {/* Featured projects */}
        <section className="bg-neutral-50 py-20 lg:py-24">
          <div className="container-site">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">
                  Featured Projects
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
                  Work we are proud of
                </h2>
              </div>
              <Button href="/projects">View All Projects</Button>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 lg:py-24">
          <div className="container-site">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">
                How We Work
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
                A simple, transparent process
              </h2>
              <p className="mt-4 text-neutral-600">
                Four clear steps from first message to final delivery — with no
                surprises along the way.
              </p>
            </div>
            <ol className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step) => (
                <li key={step.number} className="relative">
                  <span className="text-sm font-bold tracking-widest text-accent-600">
                    {step.number}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-primary-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Why Elkahmed */}
        <section className="bg-primary-950 py-20 lg:py-24">
          <div className="container-site">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent-500">
                Why Elkahmed
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                A partner, not just a vendor
              </h2>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {differentiators.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                      <Icon className="h-6 w-6 text-accent" aria-hidden />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 lg:py-24">
          <div className="container-site">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-800 to-primary-600 px-6 py-16 text-center shadow-card-hover sm:px-16">
              <div
                aria-hidden
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/25 blur-3xl"
              />
              <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Have an idea? Let&rsquo;s turn it into reality.
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-primary-100/80">
                Tell us what you need and get a free consultation plus a detailed
                proposal within two business days.
              </p>
              <div className="relative mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Button href="/request" variant="secondary" size="lg">
                  Start a Project
                </Button>
                <Button
                  href="/contact"
                  size="lg"
                  variant="ghost"
                  className="border-white/30 text-white hover:border-white/60 hover:text-white"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
