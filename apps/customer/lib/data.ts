/**
 * Single data-access layer for the whole site.
 *
 * Every page and component reads through these functions — never import from
 * `mock-data` directly. When you're ready to connect Supabase, replace the
 * bodies of these functions with queries using `getSupabaseBrowserClient()`
 * (or a server client) from `@elkahmed/supabase`. No page or component code
 * needs to change.
 */

import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  getSupabaseBrowserClient,
} from "@elkahmed/supabase";

import {
  getFeaturedProjects as getFeaturedProjectsFromMock,
  portalProjects,
  projects,
  services,
} from "./mock-data";
import type { PortalProject, Project, Service } from "./types";

/* -------------------------------------------------------------------------- */
/*                              SITE SETTINGS                                 */
/* -------------------------------------------------------------------------- */

export interface SiteSettings {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  workingHours: string;
  logoUrl: string | null;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    whatsapp?: string;
  };
}

/** Fallbacks used until the `settings` row is configured (or env is unset). */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: "Elkahmed Business",
  contactEmail: "hello@elkahmed.com",
  contactPhone: "+20 (0) 100 000 0000",
  address: "Cairo, Egypt",
  workingHours: "Sunday – Thursday, 9am – 6pm",
  logoUrl: null,
  socialLinks: {},
};

/**
 * Reads the singleton `settings` row (public read via RLS). Falls back to
 * defaults when Supabase is not configured yet or the query fails, so the
 * public site always renders.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return DEFAULT_SITE_SETTINGS;

  try {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
    if (!data) return DEFAULT_SITE_SETTINGS;

    return {
      companyName: data.company_name || DEFAULT_SITE_SETTINGS.companyName,
      contactEmail: data.contact_email || DEFAULT_SITE_SETTINGS.contactEmail,
      contactPhone: data.contact_phone || DEFAULT_SITE_SETTINGS.contactPhone,
      address: data.address || DEFAULT_SITE_SETTINGS.address,
      workingHours: data.working_hours || DEFAULT_SITE_SETTINGS.workingHours,
      logoUrl: data.logo_url,
      socialLinks: data.social_links ?? {},
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

/* -------------------------------------------------------------------------- */
/*                                 SERVICES                                   */
/* -------------------------------------------------------------------------- */

export async function getServices(): Promise<Service[]> {
  // TODO(supabase): .from("services").select("*")
  return services;
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  // TODO(supabase): .from("services").select("*").eq("slug", slug).single()
  return services.find((service) => service.slug === slug);
}

export async function getProjects(): Promise<Project[]> {
  // TODO(supabase): .from("projects").select("*")
  return projects;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return getFeaturedProjectsFromMock();
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  return projects.find((project) => project.slug === slug);
}

export async function getProjectsBySlugs(slugs: string[]): Promise<Project[]> {
  const set = new Set(slugs);
  return projects.filter((project) => set.has(project.slug));
}

/* ------------------------------ Client portal ----------------------------- */

export async function getPortalProjects(): Promise<PortalProject[]> {
  // TODO(supabase): filter by the signed-in user's customer id.
  return portalProjects;
}

export async function getPortalProject(
  id: string
): Promise<PortalProject | undefined> {
  return portalProjects.find((project) => project.id === id);
}
