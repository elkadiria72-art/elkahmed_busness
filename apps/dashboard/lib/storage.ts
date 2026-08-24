import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export const ASSETS_BUCKET = "elkahmed-assets"; // public
export const FILES_BUCKET = "elkahmed-files"; // private

/** Prevents path traversal / weird characters in object keys. */
export function safeFileName(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(-120);
}

export function buildObjectPath(folder: string, fileName: string): string {
  const stamp = Date.now();
  return `${folder.replace(/^\/+|\/+$/g, "")}/${stamp}-${safeFileName(fileName)}`;
}

/**
 * Uploads through the authenticated browser client so RLS storage policies
 * apply. Returns the public URL for the public bucket, or the raw object path
 * for private buckets (access via signed URLs only).
 */
export async function uploadToBucket(
  bucket: typeof ASSETS_BUCKET | typeof FILES_BUCKET,
  path: string,
  file: File
): Promise<{ ok: true; ref: string } | { ok: false; error: string }> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) return { ok: false, error: error.message };

    if (bucket === ASSETS_BUCKET) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return { ok: true, ref: data.publicUrl };
    }
    return { ok: true, ref: `${bucket}/${path}` };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/** Extracts the object path from a public URL of the given bucket. */
export function extractPublicPath(url: string, bucket = ASSETS_BUCKET): string | null {
  const marker = `/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

export async function removePublicAssets(urls: string[]): Promise<string | null> {
  try {
    const supabase = getSupabaseBrowserClient();
    const paths = urls
      .map((url) => extractPublicPath(url))
      .filter((path): path is string => path !== null);
    if (paths.length === 0) return null;
    const { error } = await supabase.storage.from(ASSETS_BUCKET).remove(paths);
    return error ? error.message : null;
  } catch (error) {
    return error instanceof Error ? error.message : "Delete failed";
  }
}

export async function removePrivateAsset(ref: string): Promise<string | null> {
  try {
    const supabase = getSupabaseBrowserClient();
    const prefix = `${FILES_BUCKET}/`;
    const path = ref.startsWith(prefix) ? ref.slice(prefix.length) : ref;
    const { error } = await supabase.storage.from(FILES_BUCKET).remove([path]);
    return error ? error.message : null;
  } catch (error) {
    return error instanceof Error ? error.message : "Delete failed";
  }
}

/** Private-bucket downloads go through time-limited signed URLs. */
export async function createFileDownloadUrl(
  client: SupabaseClient,
  ref: string,
  expiresInSeconds = 300
): Promise<string | null> {
  const prefix = `${FILES_BUCKET}/`;
  const path = ref.startsWith(prefix) ? ref.slice(prefix.length) : ref;
  const { data, error } = await client.storage
    .from(FILES_BUCKET)
    .createSignedUrl(path, expiresInSeconds);
  return error ? null : data?.signedUrl ?? null;
}
