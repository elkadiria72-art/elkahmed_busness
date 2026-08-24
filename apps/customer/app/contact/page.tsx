import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getSiteSettings } from "@/lib/data";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Elkahmed Business — email, phone or the contact form. We reply within one business day.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const contactItems = [
    { icon: Mail, label: "Email", value: settings.contactEmail, href: `mailto:${settings.contactEmail}` },
    { icon: Phone, label: "Phone", value: settings.contactPhone },
    { icon: MapPin, label: "Office", value: settings.address },
    { icon: Clock, label: "Working Hours", value: settings.workingHours },
  ];

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-primary-900 py-16 lg:py-20">
          <div className="container-site">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-400">
              Contact
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Let&rsquo;s talk about your project
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-primary-100/80">
              Questions, ideas or just saying hello — we would love to hear from
              you.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-5">
            {/* Contact info */}
            <div className="space-y-6 lg:col-span-2">
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 ring-1 ring-primary-100">
                      <Icon className="h-5 w-5 text-primary" aria-hidden />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                        {item.label}
                      </h2>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="mt-1 block text-sm font-medium text-neutral-800 transition-colors hover:text-primary"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm font-medium text-neutral-800">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-5 text-sm leading-relaxed text-neutral-600">
                Have a detailed project in mind? The{" "}
                <a href="/request" className="font-medium text-primary underline underline-offset-2 hover:text-accent-600">
                  project request form
                </a>{" "}
                gives us everything we need to prepare a proposal faster.
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
                <h2 className="text-xl font-bold text-primary-950">
                  Send us a message
                </h2>
                <p className="mt-1 mb-6 text-sm text-neutral-600">
                  Fill in the form and we will get back to you shortly.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
