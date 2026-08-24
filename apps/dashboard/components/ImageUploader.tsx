"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";

import { ensureAdmin } from "@/lib/admin-client";
import {
  ASSETS_BUCKET,
  buildObjectPath,
  removePublicAssets,
  uploadToBucket,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

interface UploadStatus {
  name: string;
  state: "uploading" | "error";
  message?: string;
}

interface ImageUploaderProps {
  /** Current public URLs. */
  value: string[];
  onChange: (next: string[]) => void;
  /** Storage folder, e.g. `projects/{id}` or `services/{id}` or `logo`. */
  folder: string;
  multiple?: boolean;
  label?: string;
}

/**
 * Real uploader for the public "elkahmed-assets" bucket. Uploads go through
 * the authenticated Supabase client (RLS applies). Deleting an image removes
 * it from Storage as well as the array.
 */
export function ImageUploader({
  value,
  onChange,
  folder,
  multiple = true,
  label = "Images",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [statuses, setStatuses] = useState<UploadStatus[]>([]);

  function validate(file: File): string | null {
    if (!ACCEPTED_TYPES.includes(file.type)) return "Only JPG, PNG, WebP or AVIF";
    if (file.size > MAX_IMAGE_BYTES) return "Max size is 5 MB";
    return null;
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const { isAdmin } = await ensureAdmin();
    if (!isAdmin) {
      setStatuses([{ name: "", state: "error", message: "Not authorized" }]);
      return;
    }

    const list = Array.from(files);
    const pending = list.map((file) => ({
      name: file.name,
      state: "uploading" as const,
    }));
    setStatuses(pending);

    const uploadedUrls: string[] = [];
    const nextStatuses: UploadStatus[] = [];

    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      const invalid = validate(file);
      if (invalid) {
        nextStatuses.push({ name: file.name, state: "error", message: invalid });
        continue;
      }
      const path = buildObjectPath(folder, file.name);
      const result = await uploadToBucket(ASSETS_BUCKET, path, file);
      if (result.ok) {
        uploadedUrls.push(result.ref);
        nextStatuses.push({ name: file.name, state: "uploading" });
      } else {
        nextStatuses.push({ name: file.name, state: "error", message: result.error });
      }
    }

    // Keep only finished/error statuses in the report strip.
    setStatuses(nextStatuses.filter((status) => status.state === "error"));

    if (uploadedUrls.length > 0) {
      onChange(multiple ? [...value, ...uploadedUrls] : uploadedUrls.slice(-1));
    }

    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleRemove(url: string) {
    // Optimistic removal from the form value…
    onChange(value.filter((item) => item !== url));
    // …then delete the object in Storage so nothing orphaned remains.
    await removePublicAssets([url]);
  }

  return (
    <div>
      <p className="text-sm font-medium text-neutral-800">{label}</p>

      <div className="mt-2 flex flex-wrap gap-3">
        {value.map((url) => (
          <div
            key={url}
            className="group relative h-24 w-24 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => void handleRemove(url)}
              aria-label="Remove image"
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-950/80 text-white opacity-0 transition-opacity hover:bg-red-600 focus:opacity-100 group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-300 text-neutral-400 transition-colors hover:border-accent hover:text-accent-600",
            !multiple && value.length > 0 && "hidden"
          )}
        >
          <ImagePlus className="h-5 w-5" aria-hidden />
          <span className="text-[11px] font-medium">Upload</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple={multiple}
        className="hidden"
        onChange={(event) => void handleFiles(event.target.files)}
      />

      {statuses.length > 0 && (
        <ul className="mt-2 space-y-1">
          {statuses.map((status, index) => (
            <li key={`${status.name}-${index}`} className="flex items-center gap-2 text-xs">
              {status.state === "uploading" ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-accent-600" aria-hidden />
                  <span className="text-neutral-500">Uploading {status.name}…</span>
                </>
              ) : (
                <span className="text-red-600">
                  {status.name ? `${status.name}: ` : ""}
                  {status.message}
                </span>
              )}
            </li>
          ))}
          {statuses.every((s) => s.state === "error") && (
            <li>
              <button
                type="button"
                onClick={() => setStatuses([])}
                className="text-xs text-neutral-400 underline underline-offset-2 hover:text-neutral-600"
              >
                Dismiss
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
