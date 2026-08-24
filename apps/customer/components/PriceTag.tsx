import { cn } from "@/lib/utils";

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

export function formatPublicPrice(
  amount: number,
  currency: "MAD" | "EUR" | "USD"
): string {
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  if (currency === "MAD") return `${formatted} MAD`;
  return `${currency === "EUR" ? "€" : "$"}${formatted}`;
}

interface PriceTagProps {
  price?: number | null;
  discountPrice?: number | null;
  currency?: "MAD" | "EUR" | "USD";
}

/**
 * Canonical price rendering for the public site. The dashboard's pricing
 * preview uses identical markup so admins see exactly what will ship.
 */
export function PriceTag({ price, discountPrice, currency = "MAD" }: PriceTagProps) {
  if (price === null || price === undefined) {
    return <span className="text-sm font-semibold text-primary">Custom Quote</span>;
  }

  const onSale =
    discountPrice !== null &&
    discountPrice !== undefined &&
    discountPrice < price;

  return (
    <span className="inline-flex items-center gap-2">
      {onSale && <SaleBadge />}
      {onSale ? (
        <>
          <span className="text-base font-bold text-primary">
            {formatPublicPrice(discountPrice!, currency)}
          </span>
          <span className="text-sm font-medium text-neutral-400 line-through">
            {formatPublicPrice(price, currency)}
          </span>
        </>
      ) : (
        <span className="text-base font-bold text-primary">
          {formatPublicPrice(price, currency)}
        </span>
      )}
    </span>
  );
}
