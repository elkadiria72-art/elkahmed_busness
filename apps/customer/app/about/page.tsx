import {
  Award,
  Eye,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Target,
} from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Elkahmed Business — our mission, our values and why clients trust us with their most important digital projects.",
};

const values = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    description:
      "Honest timelines, transparent pricing and advice that serves your interest — even when it means a smaller project for us.",
  },
  {
    icon: Award,
    title: "Quality",
    description:
      "We sweat the details others skip: performance, accessibility and maintainable code you can build on for years.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "You see what we see. Weekly updates, a client portal and open roadmaps mean you are never left guessing.",
  },
  {
    icon: HeartHandshake,
    title: "Partnership",
    description:
      "Your wins are our wins. We measure success by the outcomes our work creates for your business.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-primary-900 py-16 lg:py-20">
          <div className="container-site">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-400">
              About Us
            </p>
            <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              A studio built on craft, clarity and long-term thinking
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-primary-100/80">
              Elkahmed Business is a digital agency helping companies of every
              size design, build and grow their presence online.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 lg:py-20">
          <div className="container-site grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 ring-1 ring-primary-100">
                <Target className="h-6 w-6 text-primary" aria-hidden />
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-primary-950 sm:text-3xl">
                Our Mission
              </h2>
              <p className="mt-4 leading-relaxed text-neutral-600">
                To make world-class digital products accessible to ambitious
                businesses — combining agency-level craft with the focus and
                responsiveness of a dedicated team.
              </p>
              <p className="mt-4 leading-relaxed text-neutral-600">
                We believe great software is built at the intersection of design,
                engineering and honest communication. Every project we take on is
                an opportunity to prove that.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-primary-800 to-primary-600 p-8 shadow-card lg:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <Lightbulb className="h-6 w-6 text-accent" aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-bold text-white">Our Story</h3>
              <p className="mt-3 leading-relaxed text-primary-100/80">
                Founded in Cairo, Elkahmed Business started with a simple
                observation: local businesses deserved the same quality of digital
                products as global brands. Today we serve clients across the
                region and beyond — with the same obsession over detail we had on
                day one.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-neutral-50 py-16 lg:py-20">
          <div className="container-site">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">
                Our Values
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
                What we stand for
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10">
                      <Icon className="h-5 w-5 text-accent-600" aria-hidden />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-primary-950">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-14 text-center">
              <Button href="/request" size="lg">
                Work With Us
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
