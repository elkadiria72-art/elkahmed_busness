import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ServiceCard } from "@/components/ServiceCard";
import { getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web development, web applications, marketplaces, dashboards, digital products and custom solutions — everything we build at Elkahmed Business.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-primary-900 py-16 lg:py-20">
          <div className="container-site">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-400">
              Services
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              What we can build for you
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-primary-100/80">
              Six focused practices, one standard of quality. Pick a service to
              see exactly what is included and how we work.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="container-site grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
