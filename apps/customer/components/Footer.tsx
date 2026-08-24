import Link from "next/link";
import { Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";

import { getSiteSettings } from "@/lib/data";
import { services } from "@/lib/mock-data";

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/projects", label: "Our Work" },
  { href: "/request", label: "Start a Project" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Client Portal" },
];

export async function Footer() {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();

  const socialEntries = (
    [
      ["facebook", Facebook],
      ["instagram", Instagram],
      ["linkedin", Linkedin],
      ["whatsapp", MessageCircle],
    ] as const
  ).filter(([key]) => Boolean(settings.socialLinks[key]));

  return (
    <footer className="bg-primary-950 text-neutral-300">
      <div className="container-site py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-1.5 text-xl font-bold tracking-tight">
              <span className="text-white">{settings.companyName.split(" ")[0] || "Elkahmed"}</span>
              <span className="text-accent">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
              We build digital experiences that move businesses forward — websites,
              web apps, marketplaces and dashboards crafted with care.
            </p>
            {socialEntries.length > 0 && (
              <div className="mt-5 flex gap-3">
                {socialEntries.map(([key, Icon]) => (
                  <a
                    key={key}
                    href={settings.socialLinks[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-neutral-400 ring-1 ring-white/10 transition-colors hover:bg-accent/15 hover:text-accent"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="mt-4 space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-neutral-400 transition-colors hover:text-accent"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Get in Touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-neutral-400">
              <li>
                <a href={`mailto:${settings.contactEmail}`} className="transition-colors hover:text-accent">
                  {settings.contactEmail}
                </a>
              </li>
              <li>{settings.contactPhone}</li>
              <li>{settings.address}</li>
            </ul>
            {settings.workingHours && (
              <p className="mt-4 text-xs leading-relaxed text-neutral-500">
                {settings.workingHours}
              </p>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-neutral-500">
            © {year} {settings.companyName}. All rights reserved.
          </p>
          <p className="text-xs text-neutral-500">Crafted with care in Cairo.</p>
        </div>
      </div>
    </footer>
  );
}
