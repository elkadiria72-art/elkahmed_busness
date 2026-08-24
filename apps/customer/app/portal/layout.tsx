import type { Metadata } from "next";

import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Client Portal",
};

export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
