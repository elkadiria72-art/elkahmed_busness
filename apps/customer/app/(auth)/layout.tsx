import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-primary-900"
            >
              Elkahmed<span className="text-accent">.</span>
            </Link>
            <p className="mt-1 text-sm text-neutral-500">Client Portal</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
            {children}
          </div>
        </div>
      </div>
      <p className="pb-6 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} Elkahmed Business ·{" "}
        <Link href="/" className="hover:text-primary">
          Back to website
        </Link>
      </p>
    </div>
  );
}
