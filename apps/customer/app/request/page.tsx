import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { RequestForm } from "./RequestForm";

export const metadata: Metadata = {
  title: "Request a Project",
  description:
    "Tell us about your idea — websites, web apps, marketplaces, dashboards and more. Get a free consultation and a detailed proposal.",
};

export default function RequestPage() {
  return (
    <>
      <Navbar />
      <main className="bg-neutral-50">
        <section className="container-site py-16 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">
              Start a Project
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
              Request a Project
            </h1>
            <p className="mt-4 text-neutral-600">
              Tell us what you need. We will review your request and respond
              within two business days with questions, a timeline and a quote.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
            <RequestForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
