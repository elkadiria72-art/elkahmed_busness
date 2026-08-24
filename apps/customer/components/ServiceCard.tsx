import Link from "next/link";
import {
  AppWindow,
  ArrowRight,
  Globe,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { ServiceIcon, Service } from "@/lib/types";
import { PriceTag } from "@/components/PriceTag";

const iconMap: Record<ServiceIcon, LucideIcon> = {
  globe: Globe,
  "app-window": AppWindow,
  "shopping-cart": ShoppingCart,
  "layout-dashboard": LayoutDashboard,
  package: Package,
  wrench: Wrench,
};

export function ServiceCard({ service }: { service: Service }) {
  const Icon = iconMap[service.icon];

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary ring-1 ring-primary-100">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-primary-950 group-hover:text-primary">
        {service.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">
        {service.tagline}
      </p>
      <div className="mt-4">
        <PriceTag
          price={service.price ?? null}
          discountPrice={service.discountPrice ?? null}
          currency={service.currency}
        />
      </div>
      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 transition-colors group-hover:text-accent-500">
        Learn more
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
