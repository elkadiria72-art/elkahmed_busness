import Link from "next/link";
import { formatPrice } from "@/components/Price";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = { title: "Services" };

export default async function ServicesPage() {
  // Role verified by the protected layout.
  const supabase = createSupabaseServerClient();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("title", { ascending: true });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-primary-950 sm:text-3xl">
          Services
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Content and pricing shown on the public site.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {(services ?? []).length === 0 && (
          <p className="rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-400 sm:col-span-2">
            No services in the database yet.
          </p>
        )}
        {(services ?? []).map((service) => {
          const onSale =
            service.price !== null &&
            service.discount_price !== null &&
            service.discount_price < service.price;
          return (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <h2 className="font-semibold text-primary-950">{service.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                {service.tagline}
              </p>
              <p className="mt-3 text-sm font-bold text-primary">
                {service.price !== null
                  ? onSale
                    ? `${formatPrice(service.discount_price, service.currency)} (sale)`
                    : formatPrice(service.price, service.currency)
                  : "Custom Quote"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
