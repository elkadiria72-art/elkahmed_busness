import type { LucideIcon } from "lucide-react";

export type ServiceIcon =
  | "globe"
  | "app-window"
  | "shopping-cart"
  | "layout-dashboard"
  | "package"
  | "wrench";

export interface ProcessStep {
  title: string;
  description: string;
}

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface Service {
  slug: string;
  title: string;
  icon: ServiceIcon;
  tagline: string;
  description: string;
  whatWeBuild: string[];
  included: string[];
  process: ProcessStep[];
  features: ServiceFeature[];
  exampleSlugs: string[];
  /** Pricing (null = Custom Quote). Mirrors the `services` table. */
  price?: number | null;
  discountPrice?: number | null;
  currency?: "MAD" | "EUR" | "USD";
}

export type ProjectCategory =
  | "Website"
  | "Web App"
  | "Marketplace"
  | "Dashboard"
  | "Digital Product";

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  "Website",
  "Web App",
  "Marketplace",
  "Dashboard",
  "Digital Product",
];

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  summary: string;
  client: string;
  year: number;
  /** Tailwind gradient classes used for the cover placeholder */
  gradient: string;
  challenge: string;
  solution: string;
  features: string[];
  technologies: string[];
  gallery: string[];
  featured?: boolean;
}

export type PortalProjectStatus =
  | "Request Submitted"
  | "Project Review"
  | "Discussion"
  | "Development"
  | "Testing"
  | "Delivered";

export const TIMELINE_STEPS: PortalProjectStatus[] = [
  "Request Submitted",
  "Project Review",
  "Discussion",
  "Development",
  "Testing",
  "Delivered",
];

export interface TimelineEntry {
  label: string;
  date?: string;
}

export interface PortalMessage {
  id: string;
  author: string;
  role: "You" | "Team";
  date: string;
  body: string;
}

export interface PortalFile {
  id: string;
  name: string;
  size: string;
  date: string;
}

export interface PortalUpdate {
  id: string;
  date: string;
  title: string;
  body: string;
}

export interface PortalProject {
  id: string;
  name: string;
  serviceType: string;
  status: PortalProjectStatus;
  /** Index into TIMELINE_STEPS for the current stage */
  currentStep: number;
  progress: number;
  deadline: string;
  lastUpdate: string;
  description: string;
  technologies: string[];
  messages: PortalMessage[];
  files: PortalFile[];
  updates: PortalUpdate[];
}
