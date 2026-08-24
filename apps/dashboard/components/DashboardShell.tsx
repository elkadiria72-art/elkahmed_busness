"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  LayoutDashboard,
  LogOut,
  Settings as SettingsIcon,
  Shapes,
} from "lucide-react";
import { useState } from "react";

import { NotificationsBell } from "@/components/NotificationsBell";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: Briefcase },
  { href: "/services", label: "Services", icon: Shapes },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function DashboardShell({
  userEmail,
  userId,
  children,
}: {
  userEmail: string;
  userId: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold tracking-tight text-primary-900">
            Elkahmed<span className="text-accent">.</span>
          </Link>
          <NotificationsBell userId={userId} />
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium",
                pathname === item.href
                  ? "bg-primary-50 text-primary"
                  : "text-neutral-600 hover:bg-neutral-50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-neutral-200 bg-white lg:flex">
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-5">
          <Link href="/" className="text-xl font-bold tracking-tight text-primary-900">
            Elkahmed<span className="text-accent">.</span>
          </Link>
          <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
            Admin
          </span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href))
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

        <div className="border-t border-neutral-200 p-4">
          <p className="truncate px-3 pb-2 text-xs text-neutral-500">{userEmail}</p>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-primary disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          {/* Desktop bell */}
          <div className="mb-2 flex justify-end max-lg:hidden">
            <NotificationsBell userId={userId} />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
