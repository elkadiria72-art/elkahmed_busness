import type {
  PortalProject,
  Project,
  Service,
} from "./types";

/* -------------------------------------------------------------------------- */
/*                              CLIENT PORTAL                                 */
/* -------------------------------------------------------------------------- */

export const portalProjects: PortalProject[] = [
  {
    id: "prj-001",
    name: "Nova Commerce Marketplace",
    serviceType: "Marketplace Development",
    status: "Development",
    currentStep: 3,
    progress: 55,
    deadline: "2026-10-15",
    lastUpdate: "2026-08-18",
    description:
      "Multi-vendor marketplace platform with vendor onboarding, split payments and buyer-facing storefront. Currently in the development phase — core catalog and checkout are complete, vendor dashboards in progress.",
    technologies: ["Next.js", "Supabase", "Stripe Connect", "Tailwind CSS"],
    messages: [
      {
        id: "msg-1",
        author: "Sara (Elkahmed)",
        role: "Team",
        date: "2026-08-18",
        body: "Vendor dashboard beta is ready for your review. We used the sidebar layout you approved — let us know if the earnings chart should show weekly instead of monthly.",
      },
      {
        id: "msg-2",
        author: "You",
        role: "You",
        date: "2026-08-19",
        body: "Looks great! Weekly would be better for our sellers. One note: the payout table should highlight pending transfers.",
      },
      {
        id: "msg-3",
        author: "Omar (Elkahmed)",
        role: "Team",
        date: "2026-08-20",
        body: "Done — weekly toggle added and pending payouts now have an amber badge. Rolling into Friday's build.",
      },
    ],
    files: [
      {
        id: "file-1",
        name: "marketplace-spec-v3.pdf",
        size: "2.4 MB",
        date: "2026-07-02",
      },
      {
        id: "file-2",
        name: "vendor-dashboard-beta-notes.md",
        size: "18 KB",
        date: "2026-08-18",
      },
      {
        id: "file-3",
        name: "brand-assets.zip",
        size: "46 MB",
        date: "2026-07-10",
      },
    ],
    updates: [
      {
        id: "upd-1",
        date: "2026-08-18",
        title: "Vendor dashboard beta deployed to staging",
        body: "You can now log in as a test vendor at staging.nova-commerce.elkahmed.dev. Feedback welcome through the Messages tab.",
      },
      {
        id: "upd-2",
        date: "2026-08-05",
        title: "Checkout flow completed",
        body: "Buyer checkout including Stripe Connect split payments is complete and covered by automated tests.",
      },
      {
        id: "upd-3",
        date: "2026-07-21",
        title: "Sprint 4 started",
        body: "Focus for this sprint: vendor onboarding KYC screens and the commission rules engine.",
      },
    ],
  },
  {
    id: "prj-002",
    name: "MediBook Patient Portal",
    serviceType: "Web Application",
    status: "Testing",
    currentStep: 4,
    progress: 85,
    deadline: "2026-09-01",
    lastUpdate: "2026-08-20",
    description:
      "Patient booking and records portal for the MediBook clinic network. All features implemented; currently in QA across devices and accessibility review.",
    technologies: ["Next.js", "Supabase", "Twilio", "Tailwind CSS"],
    messages: [
      {
        id: "msg-1",
        author: "Lina (Elkahmed)",
        role: "Team",
        date: "2026-08-20",
        body: "QA round two is underway. We found and fixed a timezone edge case in reminder scheduling for evening appointments.",
      },
      {
        id: "msg-2",
        author: "You",
        role: "You",
        date: "2026-08-21",
        body: "Our reception team tested booking on iPads — worked flawlessly. Any chance we get the training doc before go-live?",
      },
    ],
    files: [
      {
        id: "file-1",
        name: "medibook-uat-checklist.xlsx",
        size: "94 KB",
        date: "2026-08-14",
      },
      {
        id: "file-2",
        name: "staff-training-guide-draft.pdf",
        size: "3.1 MB",
        date: "2026-08-19",
      },
    ],
    updates: [
      {
        id: "upd-1",
        date: "2026-08-20",
        title: "Accessibility audit passed (WCAG AA)",
        body: "Independent audit completed with zero critical findings. Full report attached in Files.",
      },
      {
        id: "upd-2",
        date: "2026-08-12",
        title: "Entered testing phase",
        body: "Feature work is complete. Two QA rounds scheduled before the September 1st launch window.",
      },
    ],
  },
  {
    id: "prj-003",
    name: "Atlas Real Estate Website",
    serviceType: "Web Development",
    status: "Delivered",
    currentStep: 5,
    progress: 100,
    deadline: "2026-06-30",
    lastUpdate: "2026-06-28",
    description:
      "Premium property showcase website delivered ahead of schedule. Includes CMS training materials and a 60-day support window that remains active until the end of August.",
    technologies: ["Next.js", "Mapbox", "Sanity CMS", "Tailwind CSS"],
    messages: [
      {
        id: "msg-1",
        author: "Sara (Elkahmed)",
        role: "Team",
        date: "2026-06-28",
        body: "Final handover complete — domain, DNS and CMS access are all under your accounts now. Support window runs through August 31st, just message us here if anything comes up.",
      },
    ],
    files: [
      {
        id: "file-1",
        name: "atlas-handover-pack.zip",
        size: "128 MB",
        date: "2026-06-28",
      },
      {
        id: "file-2",
        name: "cms-editor-guide.pdf",
        size: "5.8 MB",
        date: "2026-06-25",
      },
    ],
    updates: [
      {
        id: "upd-1",
        date: "2026-06-28",
        title: "Project delivered",
        body: "Website is live at atlas-properties.com. Handover pack and credentials transferred. Thank you for working with us!",
      },
      {
        id: "upd-2",
        date: "2026-06-24",
        title: "Final content loaded",
        body: "All 42 listings imported, virtual tours embedded and agent profiles published.",
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                                 SERVICES                                   */
/* -------------------------------------------------------------------------- */

export const services: Service[] = [
  {
    slug: "web-development",
    title: "Web Development",
    icon: "globe",
    tagline:
      "Fast, beautiful marketing sites that turn visitors into customers.",
    description:
      "Your website is often the first interaction people have with your business. We design and build modern, responsive websites that load fast, rank well and communicate your value clearly — whether you need a company site, a landing page or a full multi-page presence.",
    whatWeBuild: [
      "Company & business websites",
      "Landing pages & campaign microsites",
      "Personal brands & portfolios",
      "Blogs & content-driven sites",
      "Multi-language websites",
      "Website redesigns & migrations",
    ],
    included: [
      "Custom UI/UX design",
      "Mobile-first responsive build",
      "SEO-friendly structure & metadata",
      "Contact forms & integrations",
      "Analytics setup",
      "Performance optimization",
      "Deployment & hosting handover",
    ],
    process: [
      {
        title: "Discovery",
        description:
          "We learn about your business, audience and goals to define the site structure.",
      },
      {
        title: "Design",
        description:
          "We craft wireframes and high-fidelity designs aligned with your brand.",
      },
      {
        title: "Development",
        description:
          "We build the site with modern tooling, testing across devices as we go.",
      },
      {
        title: "Launch",
        description:
          "We deploy, connect your domain, verify analytics and hand over documentation.",
      },
    ],
    features: [
      {
        title: "Blazing performance",
        description:
          "Optimized assets, caching and modern frameworks keep load times under control.",
      },
      {
        title: "Responsive by default",
        description:
          "Pixel-tight layouts on phones, tablets and desktops — no compromises.",
      },
      {
        title: "SEO foundations",
        description:
          "Semantic markup, metadata and structured data baked in from day one.",
      },
      {
        title: "Easy to update",
        description:
          "Content managed in a way your team can actually maintain.",
      },
    ],
    exampleSlugs: ["atlas-realestate", "lms-academy"],
    price: 9500,
    discountPrice: null,
    currency: "MAD",
  },
  {
    slug: "web-applications",
    title: "Web Applications",
    icon: "app-window",
    tagline:
      "Custom web apps that automate workflows and power your operations.",
    description:
      "When off-the-shelf software doesn't fit, we build tailored web applications — from internal tools and booking systems to customer portals and SaaS products. Secure, scalable and designed around the way your team actually works.",
    whatWeBuild: [
      "SaaS products & platforms",
      "Customer & partner portals",
      "Internal tools & admin panels",
      "Booking & scheduling systems",
      "CRMs tailored to your workflow",
      "APIs & third-party integrations",
    ],
    included: [
      "Product scoping & user flows",
      "Authentication & role-based access",
      "Database design (Supabase/PostgreSQL)",
      "REST or realtime APIs",
      "Admin dashboard",
      "Testing & quality assurance",
      "Ongoing support options",
    ],
    process: [
      {
        title: "Scoping",
        description:
          "We map features into a pragmatic roadmap with clear milestones.",
      },
      {
        title: "Architecture",
        description:
          "Data models, auth strategy and infrastructure are planned up front.",
      },
      {
        title: "Iterative builds",
        description:
          "You review working software every sprint and steer priorities.",
      },
      {
        title: "Launch & iterate",
        description:
          "We ship to production and keep improving based on real usage.",
      },
    ],
    features: [
      {
        title: "Secure by design",
        description:
          "Row-level security, encrypted connections and best-practice auth flows.",
      },
      {
        title: "Realtime ready",
        description:
          "Live updates for dashboards, chats and notifications out of the box.",
      },
      {
        title: "Scales with you",
        description:
          "From ten users to ten thousand without a rewrite.",
      },
      {
        title: "You own it",
        description:
          "Full source code ownership and clean documentation on handover.",
      },
    ],
    exampleSlugs: ["medibook-portal", "insight-analytics"],
    price: 25000,
    discountPrice: null,
    currency: "MAD",
  },
  {
    slug: "marketplace-development",
    title: "Marketplace Development",
    icon: "shopping-cart",
    tagline:
      "Multi-vendor marketplaces that connect buyers and sellers seamlessly.",
    description:
      "Building a marketplace means solving two problems at once: an amazing buying experience and a powerful seller experience. We handle both — vendor onboarding, product management, payments, payouts and reviews — in one cohesive platform.",
    whatWeBuild: [
      "Multi-vendor marketplaces",
      "B2B & B2C commerce platforms",
      "Digital goods marketplaces",
      "Booking & rental marketplaces",
      "Service marketplaces",
      "Vendor dashboards & payout systems",
    ],
    included: [
      "Buyer storefront & search",
      "Seller/vendor portal",
      "Payments & split payouts",
      "Reviews & ratings system",
      "Order & dispute management",
      "Commission rules engine",
      "Notifications & emails",
    ],
    process: [
      {
        title: "Model design",
        description:
          "We define your commission model, vendor flow and marketplace rules.",
      },
      {
        title: "Core platform",
        description:
          "Catalog, checkout, payments and accounts are built first.",
      },
      {
        title: "Vendor tooling",
        description:
          "Dashboards for sellers to manage listings, orders and earnings.",
      },
      {
        title: "Growth phase",
        description:
          "Search tuning, reviews, promotions and analytics to fuel both sides.",
      },
    ],
    features: [
      {
        title: "Trust built-in",
        description:
          "Verified profiles, reviews and secure escrow-style payment flows.",
      },
      {
        title: "Split payments",
        description:
          "Automatic commission handling and payouts via Stripe Connect.",
      },
      {
        title: "Powerful search",
        description:
          "Filtering, categories and relevance tuning so buyers find what they need.",
      },
      {
        title: "Two-sided dashboards",
        description:
          "Clear insights for buyers, vendors and your admin team.",
      },
    ],
    exampleSlugs: ["nova-commerce", "foodfleet-app"],
    price: 45000,
    discountPrice: 38000,
    currency: "MAD",
  },
  {
    slug: "dashboards",
    title: "Dashboards",
    icon: "layout-dashboard",
    tagline:
      "Data-rich dashboards that make your numbers impossible to ignore.",
    description:
      "Stop exporting CSVs. We build custom dashboards that pull your data from wherever it lives — databases, APIs, spreadsheets — and present it through clear charts, tables and reports your team will check every morning.",
    whatWeBuild: [
      "Business intelligence dashboards",
      "KPI & metrics tracking tools",
      "Analytics platforms",
      "Reporting suites",
      "Operations monitoring panels",
      "Client-facing reporting portals",
    ],
    included: [
      "Data source integration",
      "Chart & visualization library",
      "Filters, segments & date ranges",
      "Exportable reports (PDF/CSV)",
      "Role-based access",
      "Scheduled email digests",
      "Performance tuning",
    ],
    process: [
      {
        title: "Metric definition",
        description:
          "We identify the KPIs that actually drive decisions in your business.",
      },
      {
        title: "Pipeline",
        description:
          "We connect and normalize your data sources into one reliable model.",
      },
      {
        title: "Visualization",
        description:
          "Charts, tables and alerts are designed for clarity at a glance.",
      },
      {
        title: "Refinement",
        description:
          "We tune performance and add drill-downs based on daily usage.",
      },
    ],
    features: [
      {
        title: "Live data",
        description:
          "Metrics refresh automatically — no stale weekly spreadsheets.",
      },
      {
        title: "Any source",
        description:
          "SQL databases, REST APIs, Stripe, Google Analytics and more.",
      },
      {
        title: "Drill-down detail",
        description:
          "Go from company-wide trends to individual records in two clicks.",
      },
      {
        title: "Share anywhere",
        description:
          "Permalinks, exports and scheduled reports for stakeholders.",
      },
    ],
    exampleSlugs: ["insight-analytics", "medibook-portal"],
  },
  {
    slug: "digital-products",
    title: "Digital Products",
    icon: "package",
    tagline:
      "Courses, memberships and digital products you can sell from day one.",
    description:
      "Turn your expertise into revenue. We build digital product platforms — online courses, membership sites, template stores and content libraries — complete with payments, gated content and a customer experience that keeps people coming back.",
    whatWeBuild: [
      "Online course platforms (LMS)",
      "Membership & subscription sites",
      "Template & asset stores",
      "E-book & download shops",
      "Community platforms",
      "Content libraries & archives",
    ],
    included: [
      "Course/membership structure design",
      "Payment & subscription integration",
      "Gated content & drip release",
      "Progress tracking",
      "Certificates & completion states",
      "Email sequences & onboarding",
      "Student/member dashboard",
    ],
    process: [
      {
        title: "Offer shaping",
        description:
          "We structure your content and pricing into a sellable product.",
      },
      {
        title: "Platform build",
        description:
          "Catalog, checkout, gating and member areas come together.",
      },
      {
        title: "Content loading",
        description:
          "We import your materials and configure the delivery schedule.",
      },
      {
        title: "Sell & grow",
        description:
          "Launch support, upsells and retention improvements over time.",
      },
    ],
    features: [
      {
        title: "Own your audience",
        description:
          "No platform fees or algorithm changes — your product, your rules.",
      },
      {
        title: "Frictionless checkout",
        description:
          "One-click purchases with cards, Apple Pay and Google Pay.",
      },
      {
        title: "Drip & gating",
        description:
          "Release lessons on schedule or unlock by completion.",
      },
      {
        title: "Insights",
        description:
          "See completion rates, popular content and churn signals.",
      },
    ],
    exampleSlugs: ["lms-academy", "nova-commerce"],
    price: 12000,
    discountPrice: 9500,
    currency: "MAD",
  },
  {
    slug: "custom-solutions",
    title: "Custom Solutions",
    icon: "wrench",
    tagline:
      "Have something unusual in mind? That's our favorite kind of project.",
    description:
      "Some projects don't fit a category — integrations between tools, migrating legacy systems, automation scripts or a product idea that's never been built before. Bring us the problem; we'll design the solution, however unconventional.",
    whatWeBuild: [
      "Legacy system modernization",
      "Third-party API integrations",
      "Workflow automation",
      "Data migration & cleanup tools",
      "Browser extensions & desktop tools",
      "Proof-of-concept prototypes",
    ],
    included: [
      "Technical discovery workshop",
      "Solution architecture document",
      "Phased implementation plan",
      "Integration testing",
      "Documentation & handover",
      "Team training options",
    ],
    process: [
      {
        title: "Understand",
        description:
          "A deep-dive session to understand systems, constraints and goals.",
      },
      {
        title: "Architect",
        description:
          "We propose options with trade-offs, costs and timelines.",
      },
      {
        title: "Build & validate",
        description:
          "Incremental delivery with validation against real scenarios.",
      },
      {
        title: "Handover",
        description:
          "Documentation, training and a maintenance plan you can rely on.",
      },
    ],
    features: [
      {
        title: "Tool-agnostic",
        description:
          "We recommend what fits — not what we happen to sell.",
      },
      {
        title: "Risk-first planning",
        description:
          "The riskiest parts are proven before the bulk is built.",
      },
      {
        title: "Clear documentation",
        description:
          "Your future developers will thank us — and so will you.",
      },
      {
        title: "Honest estimates",
        description:
          "Scoped phases mean no runaway budgets or surprise invoices.",
      },
    ],
    exampleSlugs: ["foodfleet-app", "atlas-realestate"],
    price: null,
    discountPrice: null,
    currency: "MAD",
  },
];

/* -------------------------------------------------------------------------- */
/*                                  PROJECTS                                  */
/* -------------------------------------------------------------------------- */

export const projects: Project[] = [
  {
    slug: "nova-commerce",
    title: "Nova Commerce Marketplace",
    category: "Marketplace",
    summary:
      "A multi-vendor e-commerce marketplace connecting independent artisans with thousands of shoppers across the region.",
    client: "Nova Retail Group",
    year: 2025,
    gradient: "from-primary-800 via-primary-600 to-accent-500",
    challenge:
      "Nova had hundreds of independent sellers but no unified place to sell. Vendors juggled social media DMs, spreadsheets and manual bank transfers, while buyers had no single destination to discover products. The group needed a platform that handled vendor onboarding, commissions and payouts without a large internal tech team.",
    solution:
      "We designed and built a full marketplace platform with self-service vendor onboarding, per-vendor storefronts and automated split payments via Stripe Connect. A tuned search experience, reviews and order tracking gave buyers confidence, while vendor dashboards exposed sales, inventory and earnings in real time.",
    features: [
      "Vendor onboarding & KYC",
      "Per-vendor storefronts",
      "Automated split payouts",
      "Advanced search & filters",
      "Reviews & ratings",
      "Order tracking",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Stripe Connect",
      "Tailwind CSS",
      "PostgreSQL",
    ],
    gallery: [
      "Homepage",
      "Vendor storefront",
      "Checkout flow",
      "Vendor dashboard",
    ],
    featured: true,
  },
  {
    slug: "insight-analytics",
    title: "Insight Analytics Dashboard",
    category: "Dashboard",
    summary:
      "A real-time analytics dashboard aggregating marketing, sales and support data for a growing SaaS company.",
    client: "Helio Software",
    year: 2025,
    gradient: "from-accent-600 via-primary-700 to-primary-900",
    challenge:
      "Helio's leadership made decisions from three disconnected tools and a weekly spreadsheet ritual. Data arrived late, disagreed with itself and required an analyst to interpret. They needed one live source of truth that non-technical managers could actually use.",
    solution:
      "We consolidated their data pipelines into a PostgreSQL warehouse and built a fast dashboard layer with role-based views for executives, marketers and support leads. Drill-downs go from company-wide KPIs to individual records, and scheduled PDF digests keep stakeholders who never log in informed.",
    features: [
      "Live KPI tracking",
      "Role-based views",
      "Drill-down analysis",
      "CSV & PDF export",
      "Scheduled digests",
      "Anomaly alerts",
    ],
    technologies: [
      "React",
      "TypeScript",
      "Recharts",
      "Node.js",
      "PostgreSQL",
      "Redis",
    ],
    gallery: [
      "Executive overview",
      "Funnel breakdown",
      "Segment explorer",
      "Report builder",
    ],
    featured: true,
  },
  {
    slug: "medibook-portal",
    title: "MediBook Patient Portal",
    category: "Web App",
    summary:
      "A patient booking and records portal for a private clinic network, cutting phone scheduling by 70%.",
    client: "MediBook Clinics",
    year: 2024,
    gradient: "from-primary-950 via-primary-800 to-primary-500",
    challenge:
      "Four clinics, one shared calendar and thousands of appointment calls per month. Reception staff were drowning, patients faced long hold times, and no-shows were eating revenue. The clinics needed self-service booking that respected doctor availability, room constraints and follow-up schedules.",
    solution:
      "We built a secure patient portal with identity verification, smart slot matching across all locations, automated SMS/email reminders and a practitioner view for managing availability. No-show rates dropped within the first month as reminders went out automatically.",
    features: [
      "Self-service booking",
      "Smart slot matching",
      "SMS & email reminders",
      "Patient records access",
      "Practitioner scheduling",
      "Multi-clinic support",
    ],
    technologies: [
      "Next.js",
      "Supabase",
      "Twilio",
      "TypeScript",
      "Tailwind CSS",
      "Vercel",
    ],
    gallery: [
      "Booking wizard",
      "Patient home",
      "Doctor schedule",
      "Reminder settings",
    ],
    featured: true,
  },
  {
    slug: "atlas-realestate",
    title: "Atlas Real Estate Website",
    category: "Website",
    summary:
      "A premium property showcase website for a boutique real estate agency, with virtual tour integration.",
    client: "Atlas Properties",
    year: 2024,
    gradient: "from-primary-700 via-primary-500 to-accent-400",
    challenge:
      "Atlas competes with national franchises whose sites dwarf theirs. Their old brochure site loaded slowly, looked dated on mobile and forced agents to email PDFs for every listing inquiry. They needed a premium digital presence that matched the caliber of their properties.",
    solution:
      "We crafted an image-led website with cinematic listing pages, interactive map search and integrated virtual tours. Lead capture forms route directly to agent phones, and the CMS lets staff publish new listings in minutes without touching code.",
    features: [
      "Interactive map search",
      "Virtual tour embeds",
      "Agent routing forms",
      "Editorial CMS",
      "Mortgage calculator",
      "Multilingual support",
    ],
    technologies: [
      "Next.js",
      "Mapbox",
      "Sanity CMS",
      "Tailwind CSS",
      "TypeScript",
    ],
    gallery: [
      "Listing grid",
      "Property page",
      "Map search",
      "Agent profiles",
    ],
  },
  {
    slug: "lms-academy",
    title: "LMS Academy Platform",
    category: "Digital Product",
    summary:
      "A course platform selling professional certification programs with drip content and progress certificates.",
    client: "Academy Pro",
    year: 2023,
    gradient: "from-accent-500 via-accent-600 to-primary-800",
    challenge:
      "Academy Pro sold courses through a generic platform that took 30% of every sale, hid student data and offered no control over the learning experience. With a catalog of twelve certification programs, they needed their own platform without losing the polish students expected.",
    solution:
      "We built a branded LMS with structured curricula, drip-released modules, quiz-gated progression and automatic certificates. Direct Stripe billing replaced platform fees, and instructors got analytics on completion rates to refine their material each cohort.",
    features: [
      "Structured curricula",
      "Drip content release",
      "Quiz & certifications",
      "Direct Stripe billing",
      "Instructor analytics",
      "Discussion forums",
    ],
    technologies: [
      "Next.js",
      "Supabase",
      "Stripe",
      "TypeScript",
      "Tailwind CSS",
    ],
    gallery: [
      "Course catalog",
      "Lesson player",
      "Certificate view",
      "Instructor stats",
    ],
  },
  {
    slug: "foodfleet-app",
    title: "FoodFleet Ordering App",
    category: "Web App",
    summary:
      "A group ordering web app for a restaurant chain with live kitchen status and pickup tracking.",
    client: "FoodFleet Restaurants",
    year: 2023,
    gradient: "from-primary-600 via-accent-500 to-accent-300",
    challenge:
      "Lunchtime queues were FoodFleet's biggest bottleneck. Office workers nearby wanted to order ahead for whole teams, but phone orders created errors and third-party apps took punishing commissions on already thin margins.",
    solution:
      "We shipped a lightweight PWA for group ordering: one person starts a cart, teammates add items from their phones, and the consolidated order goes straight to the kitchen display. Live status updates track preparation through pickup, all commission-free.",
    features: [
      "Group cart ordering",
      "Kitchen display system",
      "Live prep status",
      "Pickup time slots",
      "Repeat order shortcuts",
      "Zero commission model",
    ],
    technologies: [
      "React",
      "Firebase",
      "PWA",
      "TypeScript",
      "Tailwind CSS",
    ],
    gallery: [
      "Menu browsing",
      "Group cart",
      "Kitchen display",
      "Pickup tracker",
    ],
  },
];

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}
