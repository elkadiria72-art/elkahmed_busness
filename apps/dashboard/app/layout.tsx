import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard | Elkahmed Business",
    template: "%s | Elkahmed Business",
  },
  description: "Elkahmed Business admin dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-800 antialiased">{children}</body>
    </html>
  );
}
