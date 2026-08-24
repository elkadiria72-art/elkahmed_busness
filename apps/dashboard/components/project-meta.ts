import type { ProjectStatus } from "@/lib/database.types";

export const PROJECT_STATUSES: ProjectStatus[] = [
  "Request Submitted",
  "Project Review",
  "Discussion",
  "Development",
  "Testing",
  "Delivered",
];

export const PROJECT_CATEGORIES = [
  "Website",
  "Web App",
  "Marketplace",
  "Dashboard",
  "Digital Product",
] as const;
