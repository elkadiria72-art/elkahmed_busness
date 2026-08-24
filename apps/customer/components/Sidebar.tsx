"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface PortalNavItem {
  label: string;
  href?: string;
  icon: typeof LayoutDashboard;
  soon?: boolean;
}

const navItems: PortalNavItem[] = [
  { label: "Dashboard", href: "/portal", icon: LayoutDashboard },
  { label: "My Projects", href: "/portal#projects", icon: FolderKanban },
  { label: "Messages", icon: MessageSquare, soon: true },
  { label: "Files", icon: FileText, soon: true },
  { label: "Profile", icon: User, soon: true },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        if (item.soon || !item.href) {
          return (
            <span
              key={item.label}
              className="flex cursor-default select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400"
            >
              <Icon className="h-5 w-5" aria-hidden />
              {item.label}
              <span className="ml-auto rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                Soon
              </span>
            </span>
          );
        }
        const isActive =
          item.href === "/portal"
            ? pathname === "/portal"
            : pathname.startsWith(item.href.split("#")[0]) &&
              item.href !== "/portal";
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary-50 text-primary"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-primary"
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold tracking-tight text-primary-900">
            Elkahmed<span className="text-accent">.</span>
          </Link>
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary">
            Client Portal
          </span>
        </div>
        <div className="overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <NavList />
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-neutral-200 bg-white lg:flex">
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-5">
          <Link href="/" className="text-xl font-bold tracking-tight text-primary-900">
            Elkahmed<span className="text-accent">.</span>
          </Link>
          <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
            Portal
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <NavList />
        </div>

        <div className="border-t border-neutral-200 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg p-2 hover:bg-neutral-50">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-accent">
              AK
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-primary-950">
                Ahmed Kahmed
              </p>
              <p className="truncate text-xs text-neutral-500">
                ahmed@client.com
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-primary"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </Link>
        </div>
      </aside>
    </>
  );
}
