import type { Metadata } from "next";

import "./globals.css";

// Site content (settings, services, projects) is managed from the dashboard —
// render dynamically so edits go live immediately instead of at rebuild time.
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    default: "Elkahmed Business — Digital Experiences That Move Businesses Forward",
    template: "%s | Elkahmed Business",
  },
  description:
    "We build websites, web applications, marketplaces and dashboards that move businesses forward. Explore our services and start your project today.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
