"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { ImageUploader } from "@/components/ImageUploader";
import { ensureAdmin } from "@/lib/admin-client";
import {
  ASSETS_BUCKET,
  buildObjectPath,
  uploadToBucket,
} from "@/lib/storage";
import { hasErrors, requiredString, type FieldErrors } from "@/lib/validation";

import type { ProjectStatus } from "@/lib/database.types";
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/components/project-meta";

const inputClasses =
  "mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

interface StagedImage {
  file: File;
  previewUrl: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [images, setImages] = useState<StagedImage[]>([]);

  function validate(formData: FormData): FieldErrors {
    const next: FieldErrors = {};
    if (!requiredString(formData.get("title"))) next.title = "Title is required.";
    if (!requiredString(formData.get("client"))) next.client = "Client is required.";
    if (!requiredString(formData.get("category"))) next.category = "Pick a category.";
    return next;
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const formData = new FormData(event.currentTarget);
    const validation = validate(formData);
    if (hasErrors(validation)) {
      setErrors(validation);
      return;
    }
    setErrors({});

    const { isAdmin } = await ensureAdmin();
    if (!isAdmin) {
      setSubmitError("Your session lost admin rights — please sign in again.");
      return;
    }

    setCreating(true);
    try {
      const supabase = (await import("@/lib/supabase/client")).getSupabaseBrowserClient();

      // 1. Create the row first so we have an id for the storage folder.
      const { data: project, error: insertError } = await supabase
        .from("projects")
        .insert({
          title: requiredString(formData.get("title")),
          client: requiredString(formData.get("client")),
          category: requiredString(formData.get("category")),
          status: (requiredString(formData.get("status")) ||
            "Request Submitted") as ProjectStatus,
          description: requiredString(formData.get("description")) || null,
        })
        .select("id")
        .single();

      if (insertError || !project) {
        setSubmitError(insertError?.message ?? "Could not create the project.");
        return;
      }

      // 2. Upload staged images to projects/{id}/ and collect public URLs.
      const uploadedUrls: string[] = [];
      for (const image of images) {
        const path = buildObjectPath(`projects/${project.id}`, image.file.name);
        const result = await uploadToBucket(ASSETS_BUCKET, path, image.file);
        if (result.ok) {
          uploadedUrls.push(result.ref);
        }
        // Individual failures don't block creation; admin can re-upload
        // from the project page.
      }

      // 3. Store URLs on the row when any upload succeeded.
      if (uploadedUrls.length > 0) {
        await supabase.from("projects").update({ images: uploadedUrls }).eq("id", project.id);
      }

      router.push(`/projects/${project.id}`);
      router.refresh();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-primary-950 sm:text-3xl">
          New Project
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Images are uploaded to Storage after the project is created.
        </p>
      </header>

      <form
        onSubmit={handleCreate}
        className="space-y-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-card sm:p-8"
        noValidate
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="text-sm font-medium text-neutral-800">
              Title *
            </label>
            <input id="title" name="title" type="text" required className={inputClasses} />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>
          <div>
            <label htmlFor="client" className="text-sm font-medium text-neutral-800">
              Client *
            </label>
            <input id="client" name="client" type="text" required className={inputClasses} />
            {errors.client && <p className="mt-1 text-xs text-red-600">{errors.client}</p>}
          </div>
          <div>
            <label htmlFor="category" className="text-sm font-medium text-neutral-800">
              Category *
            </label>
            <select id="category" name="category" defaultValue="" required className={inputClasses}>
              <option value="" disabled>
                Select…
              </option>
              {PROJECT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-600">{errors.category}</p>
            )}
          </div>
          <div>
            <label htmlFor="status" className="text-sm font-medium text-neutral-800">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue="Request Submitted"
              className={inputClasses}
            >
              {PROJECT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium text-neutral-800">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className={inputClasses}
            placeholder="Short summary of the engagement…"
          />
        </div>

        {/* Staging area — files are held locally until the row exists. */}
        <div>
          <p className="text-sm font-medium text-neutral-800">Project images</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {images.map((image) => (
              <div
                key={image.previewUrl}
                className="group relative h-24 w-24 overflow-hidden rounded-lg border border-neutral-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.previewUrl} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  aria-label={`Remove ${image.file.name}`}
                  onClick={() => {
                    URL.revokeObjectURL(image.previewUrl);
                    setImages((current) =>
                      current.filter((item) => item.previewUrl !== image.previewUrl)
                    );
                  }}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-950/80 text-white hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
            <ImagePickerButton onPick={(files) => setImages(files)} count={images.length} />
          </div>
        </div>

        {submitError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700 ring-1 ring-inset ring-red-100">
            {submitError}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-50"
          >
            {creating && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {creating ? "Creating…" : "Create Project"}
          </button>
          <button
            type="button"
            onClick={() => {
              images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
              router.push("/projects");
            }}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function ImagePickerButton({
  onPick,
  count,
}: {
  onPick: (images: StagedImage[]) => void;
  count: number;
}) {
  return (
    <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-300 text-neutral-400 transition-colors hover:border-accent hover:text-accent-600">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-5 w-5"
        aria-hidden
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-4.35-4.35a1 1 0 0 0-1.42 0L5 21" />
      </svg>
      <span className="text-[11px] font-medium">{count > 0 ? "Add more" : "Upload"}</span>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []).slice(0, 12);
          onPick(
            files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }))
          );
          event.target.value = "";
        }}
      />
    </label>
  );
}
