"use client";

import { getSupabaseBrowserClient } from "@elkahmed/supabase";
import { CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/Button";

const inputClasses =
  "mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const needOptions = [
  "Website",
  "Web App",
  "Marketplace",
  "Dashboard",
  "Digital Product",
  "Other",
] as const;

const budgetRanges = [
  "Under $1,000",
  "$1,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000 – $25,000",
  "$25,000+",
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Inserts into the `requests` table through the anon client. RLS allows
 * anonymous inserts only with status='new' (the DB default) — everything
 * else stays admin-only, so this can never be used to spam statuses.
 */
async function submitProjectRequest(input: {
  name: string;
  email: string;
  phone: string;
  company: string | null;
  need: string;
  message: string;
  budget: string | null;
  deadline: string | null;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("requests").insert(input);
    if (error) {
      if (error.message.includes("permission denied")) {
        return {
          ok: false,
          error:
            "We could not submit your request because of a server configuration issue. " +
            "Please try again later or email us directly.",
        };
      }
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (submitError) {
    return {
      ok: false,
      error:
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again.",
    };
  }
}

export function RequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Read fields synchronously — event.currentTarget is released after awaits.
    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const company = String(formData.get("company") ?? "").trim();
    const need = String(formData.get("need") ?? "");
    const message = String(formData.get("idea") ?? "").trim();
    const budget = String(formData.get("budget") ?? "");
    const deadline = String(formData.get("deadline") ?? "");

    setError(null);

    if (!name || !email || !phone || !need || !message || !budget) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (message.length < 10) {
      setError("Please describe your idea in at least 10 characters.");
      return;
    }

    setSubmitting(true);
    const result = await submitProjectRequest({
      name,
      email,
      phone,
      company: company || null,
      need,
      message,
      budget,
      deadline: deadline || null,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-accent" aria-hidden />
        <h2 className="mt-4 text-xl font-bold text-primary-950">
          Request received!
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-600">
          Thank you — your project request has been sent to our team. We will
          review it and reply within two business days.
        </p>
        <div className="mt-6 rounded-xl bg-primary-50 p-5 ring-1 ring-primary-100">
          <p className="text-sm font-semibold text-primary-950">
            Want to follow your request in real time?
          </p>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600">
            Create an account to track progress, chat with the team and access
            files in the client portal.
          </p>
          <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/register" size="sm">
              Create an Account
            </Button>
            <Button href="/" variant="ghost" size="sm">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-neutral-800">
          Name <span className="text-accent-600">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={120}
          placeholder="Your full name"
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-neutral-800">
          Email <span className="text-accent-600">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={160}
          placeholder="you@company.com"
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="phone" className="text-sm font-medium text-neutral-800">
          Phone <span className="text-accent-600">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          maxLength={40}
          placeholder="+20 …"
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="company" className="text-sm font-medium text-neutral-800">
          Company{" "}
          <span className="text-xs font-normal text-neutral-400">(optional)</span>
        </label>
        <input
          id="company"
          name="company"
          type="text"
          maxLength={160}
          placeholder="Company or brand name"
          className={inputClasses}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="need" className="text-sm font-medium text-neutral-800">
          What do you need? <span className="text-accent-600">*</span>
        </label>
        <select id="need" name="need" required defaultValue="" className={inputClasses}>
          <option value="" disabled>
            Select a service…
          </option>
          {needOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="idea" className="text-sm font-medium text-neutral-800">
          Tell us about your idea <span className="text-accent-600">*</span>
        </label>
        <textarea
          id="idea"
          name="idea"
          rows={5}
          required
          minLength={10}
          maxLength={2000}
          placeholder="Goals, features, anything that helps us understand the vision…"
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="budget" className="text-sm font-medium text-neutral-800">
          Budget <span className="text-accent-600">*</span>
        </label>
        <select
          id="budget"
          name="budget"
          required
          defaultValue=""
          className={inputClasses}
        >
          <option value="" disabled>
            Select a range…
          </option>
          {budgetRanges.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="deadline" className="text-sm font-medium text-neutral-800">
          Deadline
        </label>
        <input
          id="deadline"
          name="deadline"
          type="date"
          className={inputClasses}
        />
        <p className="mt-1.5 text-xs text-neutral-400">
          Leave empty if flexible.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700 ring-1 ring-inset ring-red-100 sm:col-span-2"
        >
          {error}
        </p>
      )}

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Request"}
        </Button>
        <p className="mt-3 text-center text-xs text-neutral-500">
          By submitting you agree to be contacted about your request.
        </p>
      </div>
    </form>
  );
}
