"use client";

import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { ImageUploader } from "@/components/ImageUploader";
import { PricePreview } from "@/components/Price";
import { ensureAdmin } from "@/lib/admin-client";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { hasErrors, parseAmount, type FieldErrors } from "@/lib/validation";
import type { Service } from "@/lib/database.types";

const inputClasses =
  "mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const CURRENCIES = ["MAD", "EUR", "USD"] as const;

export function ServiceEditor({ service }: { service: Service }) {
  const supabase = getSupabaseBrowserClient();

  const [title, setTitle] = useState(service.title);
  const [tagline, setTagline] = useState(service.tagline);
  const [description, setDescription] = useState(service.description ?? "");
  const [imageUrl, setImageUrl] = useState<string[]>(service.image_url ? [service.image_url] : []);
  const [priceInput, setPriceInput] = useState(service.price?.toString() ?? "");
  const [discountInput, setDiscountInput] = useState(service.discount_price?.toString() ?? "");
  const [currency, setCurrency] = useState<Service["currency"]>(service.currency);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const price = priceInput.trim() === "" ? null : parseAmount(priceInput);
  const discountPrice =
    discountInput.trim() === "" ? null : parseAmount(discountInput);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!title.trim()) next.title = "Title is required.";
    if (Number.isNaN(price)) {
      next.price = "Enter a valid non-negative amount (e.g. 9500 or 1250.50).";
    }
    if (Number.isNaN(discountPrice)) {
      next.discountPrice = "Enter a valid amount or leave empty.";
    }
    // Sale logic only applies when the discount is strictly lower.
    if (
      !next.price &&
      !next.discountPrice &&
      price !== null &&
      discountPrice !== null &&
      discountPrice >= price
    ) {
      next.discountPrice =
        "Discount must be lower than the regular price — otherwise no Sale badge is shown.";
    }
    return next;
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const validation = validate();
    setErrors(validation);
    if (hasErrors(validation)) return;

    const { isAdmin } = await ensureAdmin();
    if (!isAdmin) {
      setMessage({ kind: "error", text: "Not authorized — sign in again." });
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("services")
      .update({
        title: title.trim(),
        tagline: tagline.trim(),
        description: description.trim() || null,
        image_url: imageUrl[0] ?? null,
        price,
        discount_price: discountPrice,
        currency,
        updated_at: new Date().toISOString(),
      })
      .eq("id", service.id);
    setSaving(false);

    setMessage(
      error
        ? { kind: "error", text: error.message }
        : { kind: "ok", text: "Service saved — changes are live on the public site." }
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-primary-950 sm:text-3xl">
          Edit Service
        </h1>
        <p className="mt-1 font-mono text-xs text-neutral-400">/{service.slug}</p>
      </header>

      <form
        onSubmit={handleSave}
        className="space-y-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-card sm:p-8"
        noValidate
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="s-title" className="text-sm font-medium text-neutral-800">
              Title *
            </label>
            <input
              id="s-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className={inputClasses}
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="s-tagline" className="text-sm font-medium text-neutral-800">
              Tagline
            </label>
            <input
              id="s-tagline"
              value={tagline}
              onChange={(event) => setTagline(event.target.value)}
              className={inputClasses}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="s-description" className="text-sm font-medium text-neutral-800">
              Description
            </label>
            <textarea
              id="s-description"
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={inputClasses}
            />
          </div>
        </div>

        {/* Service image — uploads to services/{id}/ in elkahmed-assets. */}
        <ImageUploader
          label="Service image"
          folder={`services/${service.id}`}
          value={imageUrl}
          onChange={setImageUrl}
          multiple={false}
        />

        {/* Pricing — mirrors exactly how prices render on the public site. */}
        <fieldset className="rounded-xl border border-neutral-200 p-5">
          <legend className="px-1.5 text-sm font-semibold text-primary-950">Pricing</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="s-price" className="text-sm font-medium text-neutral-800">
                Price *
              </label>
              <input
                id="s-price"
                inputMode="decimal"
                value={priceInput}
                onChange={(event) => setPriceInput(event.target.value)}
                placeholder="e.g. 9500"
                className={inputClasses}
              />
              {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
            </div>
            <div>
              <label htmlFor="s-discount" className="text-sm font-medium text-neutral-800">
                Discount price
              </label>
              <input
                id="s-discount"
                inputMode="decimal"
                value={discountInput}
                onChange={(event) => setDiscountInput(event.target.value)}
                placeholder="Optional"
                className={inputClasses}
              />
              {errors.discountPrice && (
                <p className="mt-1 text-xs text-red-600">{errors.discountPrice}</p>
              )}
            </div>
            <div>
              <label htmlFor="s-currency" className="text-sm font-medium text-neutral-800">
                Currency
              </label>
              <select
                id="s-currency"
                value={currency}
                onChange={(event) =>
                  setCurrency(event.target.value as Service["currency"])
                }
                className={inputClasses}
              >
                {CURRENCIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-neutral-50 p-4 ring-1 ring-neutral-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Public site preview
            </p>
            <div className="mt-2">
              <PricePreview price={price} discountPrice={discountPrice} currency={currency} />
            </div>
          </div>
        </fieldset>

        {message && (
          <p
            role="status"
            className={
              message.kind === "ok"
                ? "rounded-lg bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-100"
                : "rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700 ring-1 ring-inset ring-red-100"
            }
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Save Changes
        </button>
      </form>
    </div>
  );
}
