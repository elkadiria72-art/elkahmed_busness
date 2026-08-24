import { cn } from "@/lib/utils";

/**
 * Price display shared look-and-feel with the public site's <PriceTag />.
 * Shows a gold "Sale" badge whenever discount_price is set and lower than
 * price — exactly how it renders on apps/customer.
 */
export function SaleBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-950",
        className
      )}
    >
      Sale
    </span>
  );
}

export function formatPrice(
  amount: number | null,
  currency: "MAD" | "EUR" | "USD"
): string {
  if (amount === null) return "";
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  if (currency === "MAD") return `${formatted} MAD`;
  return `${currency === "EUR" ? "€" : "$"}${formatted}`;
}

interface DashboardPricePreviewProps {
  price: number | null;
  discountPrice: number | null;
  currency: "MAD" | "EUR" | "USD";
}

export function PricePreview({
  price,
  discountPrice,
  currency,
}: DashboardPricePreviewProps) {
  const onSale =
    price !== null && discountPrice !== null && discountPrice < price;

  return (
    <span className="inline-flex items-center gap-2">
      {onSale && <SaleBadge />}
      {onSale ? (
        <>
          <span className="text-lg font-bold text-primary">
            {formatPrice(discountPrice, currency)}
          </span>
          <span className="text-sm font-medium text-neutral-400 line-through">
            {formatPrice(price, currency)}
          </span>
        </>
      ) : (
        <span className="text-lg font-bold text-primary">
          {price !== null ? formatPrice(price, currency) : "Custom Quote"}
        </span>
      )}
    </span>
  );
}
