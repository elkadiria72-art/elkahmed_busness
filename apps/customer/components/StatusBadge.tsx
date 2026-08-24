import type { PortalProjectStatus } from "@/lib/types";

const statusStyles: Record<PortalProjectStatus, string> = {
  "Request Submitted": "bg-neutral-100 text-neutral-700 ring-neutral-300",
  "Project Review": "bg-blue-50 text-blue-700 ring-blue-200",
  Discussion: "bg-violet-50 text-violet-700 ring-violet-200",
  Development: "bg-amber-50 text-amber-700 ring-amber-200",
  Testing: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

interface StatusBadgeProps {
  status: PortalProjectStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {status}
    </span>
  );
}
