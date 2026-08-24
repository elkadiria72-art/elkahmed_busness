"use client";

import { Check, Copy, Loader2, ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";

import { Tabs } from "@/components/Tabs";
import {
  ASSETS_BUCKET,
  buildObjectPath,
  extractPublicPath,
  removePublicAssets,
  uploadToBucket,
} from "@/lib/storage";
import { ensureAdmin } from "@/lib/admin-client";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { hasErrors, isEmail, requiredString, type FieldErrors } from "@/lib/validation";
import type { Settings, SocialLinks } from "@/lib/database.types";

const TABS = ["Company Info", "Admin Users", "Security"] as const;
type Tab = (typeof TABS)[number];

const inputClasses =
  "mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const SOCIAL_FIELDS = [
  { key: "facebook", label: "Facebook URL", placeholder: "https://facebook.com/elkahmed" },
  { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/elkahmed" },
  { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/elkahmed" },
  { key: "whatsapp", label: "WhatsApp Number", placeholder: "+212600000000" },
] as const;

interface SettingsModuleProps {
  userId: string;
  userEmail: string;
  initialSettings: Settings | null;
}

export function SettingsModule({ userId, userEmail, initialSettings }: SettingsModuleProps) {
  const [tab, setTab] = useState<Tab>("Company Info");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-primary-950 sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Changes apply to the public site immediately.
        </p>
      </header>

      <Tabs tabs={[...TABS]} active={tab} onChange={(next) => setTab(next as Tab)} />

      <div className="pb-10">
        {tab === "Company Info" && <CompanyInfoTab initialSettings={initialSettings} />}
        {tab === "Admin Users" && <AdminUsersTab currentUserId={userId} />}
        {tab === "Security" && <SecurityTab userEmail={userEmail} />}
      </div>
    </div>
  );
}

/* ---------------------------- Company info tab ----------------------------- */

function CompanyInfoTab({ initialSettings }: { initialSettings: Settings | null }) {
  const supabase = getSupabaseBrowserClient();
  const settingsId = initialSettings?.id ?? 1;

  const [companyName, setCompanyName] = useState(initialSettings?.company_name ?? "");
  const [contactEmail, setContactEmail] = useState(initialSettings?.contact_email ?? "");
  const [contactPhone, setContactPhone] = useState(initialSettings?.contact_phone ?? "");
  const [address, setAddress] = useState(initialSettings?.address ?? "");
  const [workingHours, setWorkingHours] = useState(initialSettings?.working_hours ?? "");
  const [socials, setSocials] = useState<SocialLinks>(initialSettings?.social_links ?? {});

  const [logoUrl, setLogoUrl] = useState<string | null>(initialSettings?.logo_url ?? null);
  const [logoUploading, setLogoUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function guardAdmin(): Promise<boolean> {
    const { isAdmin } = await ensureAdmin();
    if (!isAdmin) {
      setMessage({ kind: "error", text: "Not authorized — sign in again." });
      return false;
    }
    return true;
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!requiredString(companyName)) next.companyName = "Company name is required.";
    if (!isEmail(contactEmail)) next.contactEmail = "Enter a valid email address.";
    return next;
  }

  async function handleLogo(file: File | null) {
    if (!file) return;
    setMessage(null);

    if (!(await guardAdmin())) return;
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ kind: "error", text: "Logo must be under 5 MB." });
      return;
    }

    setLogoUploading(true);
    try {
      // Upload to elkahmed-assets at logo/{timestamp}-{filename}.
      const path = buildObjectPath("logo", file.name);
      const result = await uploadToBucket(ASSETS_BUCKET, path, file);
      if (!result.ok) {
        setMessage({ kind: "error", text: result.error });
        return;
      }

      // UPDATE settings.logo_url with the public URL.
      const { error } = await supabase
        .from("settings")
        .update({ logo_url: result.ref })
        .eq("id", settingsId);

      if (error) {
        setMessage({ kind: "error", text: error.message });
        return;
      }

      // Clean up the previous logo object so Storage doesn't accumulate.
      const oldPath = logoUrl ? extractPublicPath(logoUrl) : null;
      if (logoUrl && oldPath && oldPath.startsWith("logo/")) {
        await removePublicAssets([logoUrl]);
      }

      setLogoUrl(result.ref);
      setMessage({ kind: "ok", text: "Logo updated — live on the public site." });
    } finally {
      setLogoUploading(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const validation = validate();
    setErrors(validation);
    if (hasErrors(validation)) return;

    if (!(await guardAdmin())) return;

    setSaving(true);
    // Only non-empty social fields are persisted; empty inputs are removed.
    const cleanedSocials = Object.fromEntries(
      Object.entries(socials).filter(([, value]) => value?.trim())
    ) as SocialLinks;

    const { error } = await supabase
      .from("settings")
      .update({
        company_name: companyName.trim(),
        contact_email: contactEmail.trim(),
        contact_phone: contactPhone.trim(),
        address: address.trim(),
        working_hours: workingHours.trim(),
        social_links: cleanedSocials,
        updated_at: new Date().toISOString(),
      })
      .eq("id", settingsId);
    setSaving(false);

    setMessage(
      error
        ? { kind: "error", text: error.message }
        : { kind: "ok", text: "Settings saved — the public site reflects them now." }
    );
  }

  return (
    <form
      onSubmit={handleSave}
      className="space-y-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-card sm:p-8"
      noValidate
    >
      {/* Logo */}
      <div className="flex flex-wrap items-center gap-5">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
          {logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={logoUrl} alt="Company logo preview" className="h-full w-full object-contain" />
          ) : (
            <span className="text-xl font-bold text-primary">E.</span>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-800">Company logo</p>
          <p className="text-xs text-neutral-500">
            PNG/SVG/WebP recommended · stored in “elkahmed-assets/logo”
          </p>
          <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 px-3.5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-primary hover:text-primary">
            {logoUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Uploading…
              </>
            ) : (
              "Upload new logo"
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={(event) => void handleLogo(event.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="text-sm font-medium text-neutral-800">
            Company name *
          </label>
          <input
            id="c-name"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            required
            className={inputClasses}
          />
          {errors.companyName && (
            <p className="mt-1 text-xs text-red-600">{errors.companyName}</p>
          )}
        </div>
        <div>
          <label htmlFor="c-email" className="text-sm font-medium text-neutral-800">
            Contact email *
          </label>
          <input
            id="c-email"
            type="email"
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            required
            className={inputClasses}
          />
          {errors.contactEmail && (
            <p className="mt-1 text-xs text-red-600">{errors.contactEmail}</p>
          )}
        </div>
        <div>
          <label htmlFor="c-phone" className="text-sm font-medium text-neutral-800">
            Contact phone
          </label>
          <input
            id="c-phone"
            type="tel"
            value={contactPhone}
            onChange={(event) => setContactPhone(event.target.value)}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="c-hours" className="text-sm font-medium text-neutral-800">
            Working hours
          </label>
          <input
            id="c-hours"
            value={workingHours}
            onChange={(event) => setWorkingHours(event.target.value)}
            placeholder="Sunday – Thursday, 9am – 6pm"
            className={inputClasses}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="c-address" className="text-sm font-medium text-neutral-800">
            Address
          </label>
          <input
            id="c-address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      {/* Social links */}
      <fieldset>
        <legend className="text-sm font-semibold text-primary-950">Social links</legend>
        <p className="mt-0.5 text-xs text-neutral-400">
          Empty fields are removed — only filled links are shown on the site.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SOCIAL_FIELDS.map((field) => (
            <div key={field.key}>
              <label htmlFor={`social-${field.key}`} className="text-sm font-medium text-neutral-800">
                {field.label}
              </label>
              <input
                id={`social-${field.key}`}
                type="url"
                inputMode={field.key === "whatsapp" ? "tel" : "url"}
                value={socials[field.key] ?? ""}
                onChange={(event) =>
                  setSocials((current) => ({ ...current, [field.key]: event.target.value }))
                }
                placeholder={field.placeholder}
                className={inputClasses}
              />
            </div>
          ))}
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
        Save Settings
      </button>
    </form>
  );
}

/* ----------------------------- Admin users tab ----------------------------- */

interface AdminRow {
  id: string;
  email: string;
  full_name: string | null;
}

function AdminUsersTab({ currentUserId }: { currentUserId: string }) {
  const supabase = getSupabaseBrowserClient();
  const [admins, setAdmins] = useState<AdminRow[] | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const emailForSql = inviteEmail.trim() || "new.admin@example.com";
  const sqlSnippet = `-- Promote an existing auth user to admin:\nUPDATE public.profiles\nSET role = 'admin'\nWHERE id = (\n  SELECT id FROM auth.users WHERE email = '${emailForSql}'\n);`;

  if (admins === null) {
    void (async () => {
      const { isAdmin } = await ensureAdmin();
      if (!isAdmin) {
        setAdmins([]);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .eq("role", "admin")
        .order("email");
      setAdmins(data ?? []);
    })();
  }

  async function copySql() {
    try {
      await navigator.clipboard.writeText(sqlSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Current admins */}
      <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-5 py-3 font-medium">Admin</th>
              <th className="px-5 py-3 font-medium">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {(admins ?? []).map((admin) => (
              <tr key={admin.id}>
                <td className="px-5 py-3.5">
                  <span className="font-medium text-primary-950">
                    {admin.full_name || "—"}
                    {admin.id === currentUserId && (
                      <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent-700">
                        You
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-neutral-600">{admin.email}</td>
              </tr>
            ))}
            {admins !== null && admins.length === 0 && (
              <tr>
                <td colSpan={2} className="px-5 py-8 text-center text-neutral-400">
                  No admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Invite flow — deliberately NOT a client-side user creation call:
          creating users requires elevated privileges we never expose in the
          browser. The safe path is register + SQL promotion below. */}
      <section className="rounded-xl border border-accent/40 bg-accent/5 p-6">
        <h2 className="flex items-center gap-2 text-base font-semibold text-primary-950">
          <ShieldCheck className="h-5 w-5 text-accent-600" aria-hidden />
          Invite an Admin
        </h2>
        <ol className="mt-3 list-inside list-decimal space-y-1.5 text-sm leading-relaxed text-neutral-700">
          <li>
            Ask the person to create their account normally via{" "}
            <code className="rounded bg-white px-1.5 py-0.5 text-xs font-semibold text-primary ring-1 ring-neutral-200">
              /register
            </code>{" "}
            on the customer site.
          </li>
          <li>Run the SQL below in the Supabase SQL editor to promote them.</li>
          <li>They can then sign in to this dashboard immediately.</li>
        </ol>

        <div className="mt-4 max-w-md">
          <label htmlFor="invite-email" className="text-sm font-medium text-neutral-800">
            New admin&rsquo;s email
          </label>
          <input
            id="invite-email"
            type="email"
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
            placeholder="colleague@elkahmed.com"
            className={inputClasses}
          />
        </div>

        <div className="relative mt-4">
          <pre className="overflow-x-auto rounded-lg bg-primary-950 p-4 pr-12 text-xs leading-relaxed text-emerald-200">
            {sqlSnippet}
          </pre>
          <button
            type="button"
            onClick={() => void copySql()}
            aria-label="Copy SQL"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            {copied ? (
              <Check className="h-4 w-4" aria-hidden />
            ) : (
              <Copy className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------ Security tab ------------------------------- */

function SecurityTab({ userEmail }: { userEmail: string }) {
  const supabase = getSupabaseBrowserClient();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (password.length < 8) {
      setMessage({ kind: "error", text: "Password must be at least 8 characters." });
      return;
    }
    if (password !== confirm) {
      setMessage({ kind: "error", text: "Passwords do not match." });
      return;
    }

    const { isAdmin } = await ensureAdmin();
    if (!isAdmin) {
      setMessage({ kind: "error", text: "Not authorized — sign in again." });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setMessage({ kind: "error", text: error.message });
      return;
    }
    setPassword("");
    setConfirm("");
    setMessage({
      kind: "ok",
      text: "Password updated. Other sessions may be signed out.",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-card"
      noValidate
    >
      <div>
        <h2 className="text-base font-semibold text-primary-950">Change password</h2>
        <p className="mt-0.5 text-xs text-neutral-500">Signed in as {userEmail}</p>
      </div>

      <div>
        <label htmlFor="new-password" className="text-sm font-medium text-neutral-800">
          New password
        </label>
        <input
          id="new-password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="confirm-password" className="text-sm font-medium text-neutral-800">
          Confirm new password
        </label>
        <input
          id="confirm-password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          placeholder="Repeat password"
          className={inputClasses}
        />
      </div>

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
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-50"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        Update Password
      </button>
    </form>
  );
}
