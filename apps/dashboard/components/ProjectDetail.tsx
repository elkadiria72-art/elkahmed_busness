"use client";

import { Download, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { ImageUploader } from "@/components/ImageUploader";
import { StatusBadge } from "@/components/StatusBadge";
import { Tabs } from "@/components/Tabs";
import { ensureAdmin } from "@/lib/admin-client";
import {
  FILES_BUCKET,
  buildObjectPath,
  createFileDownloadUrl,
  removePrivateAsset,
  uploadToBucket,
} from "@/lib/storage";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";

import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/components/project-meta";
import type {
  FileRow,
  Message,
  Project,
  ProjectStatus,
} from "@/lib/database.types";

const inputClasses =
  "mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const TABS = ["Overview", "Messages", "Files"] as const;
type Tab = (typeof TABS)[number];

const MAX_FILE_BYTES = 25 * 1024 * 1024;

export function ProjectDetail({
  project,
  initialMessages,
  initialFiles,
}: {
  project: Project;
  initialMessages: Message[];
  initialFiles: FileRow[];
}) {
  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <div className="space-y-6">
      <header className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary-950">
              {project.title}
            </h1>
            <p className="mt-0.5 text-sm text-neutral-500">
              Client: {project.client || "—"} · Created {formatDate(project.created_at)}
            </p>
          </div>
          <StatusBadge status={project.status} />
        </div>
      </header>

      <Tabs tabs={[...TABS]} active={tab} onChange={(next) => setTab(next as Tab)} />

      <div className="pb-10">
        {tab === "Overview" && <OverviewTab project={project} />}
        {tab === "Messages" && <MessagesTab projectId={project.id} initial={initialMessages} />}
        {tab === "Files" && <FilesTab projectId={project.id} initial={initialFiles} />}
      </div>
    </div>
  );
}

/* ------------------------------- Overview tab ----------------------------- */

function OverviewTab({ project }: { project: Project }) {
  const supabase = getSupabaseBrowserClient();
  const [title, setTitle] = useState(project.title);
  const [clientName, setClientName] = useState(project.client);
  const [category, setCategory] = useState(project.category);
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [description, setDescription] = useState(project.description ?? "");
  const [images, setImages] = useState<string[]>(project.images);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!title.trim() || !clientName.trim()) {
      setMessage({ kind: "error", text: "Title and client are required." });
      return;
    }

    const { isAdmin } = await ensureAdmin();
    if (!isAdmin) {
      setMessage({ kind: "error", text: "Not authorized — sign in again." });
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("projects")
      .update({
        title: title.trim(),
        client: clientName.trim(),
        category,
        status,
        description: description.trim() || null,
        images,
      })
      .eq("id", project.id);
    setSaving(false);

    setMessage(
      error
        ? { kind: "error", text: error.message }
        : { kind: "ok", text: "Project saved." }
    );
  }

  return (
    <form
      onSubmit={handleSave}
      className="space-y-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-card sm:p-8"
      noValidate
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="p-title" className="text-sm font-medium text-neutral-800">
            Title *
          </label>
          <input
            id="p-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="p-client" className="text-sm font-medium text-neutral-800">
            Client *
          </label>
          <input
            id="p-client"
            value={clientName}
            onChange={(event) => setClientName(event.target.value)}
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="p-category" className="text-sm font-medium text-neutral-800">
            Category
          </label>
          <select
            id="p-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={inputClasses}
          >
            {PROJECT_CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="p-status" className="text-sm font-medium text-neutral-800">
            Status
          </label>
          <select
            id="p-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as ProjectStatus)}
            className={inputClasses}
          >
            {PROJECT_STATUSES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="p-description" className="text-sm font-medium text-neutral-800">
          Description
        </label>
        <textarea
          id="p-description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className={inputClasses}
        />
      </div>

      {/* Gallery — uploads to projects/{id}/ in elkahmed-assets. Deleting an
          image here removes the object from Storage too. */}
      <ImageUploader
        label="Project gallery"
        folder={`projects/${project.id}`}
        value={images}
        onChange={setImages}
        multiple
      />

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
  );
}

/* ------------------------------- Messages tab ----------------------------- */

function MessagesTab({
  projectId,
  initial,
}: {
  projectId: string;
  initial: Message[];
}) {
  const supabase = getSupabaseBrowserClient();
  const [messages, setMessages] = useState(initial);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Realtime appends for this project's thread only.
  useEffect(() => {
    const channel = supabase
      .channel(`messages-project-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const body = String(new FormData(form).get("body") ?? "").trim();
    if (!body) return;

    const { userId } = await ensureAdmin();
    if (!userId) return;

    form.reset();
    const { error } = await supabase.from("messages").insert({
      project_id: projectId,
      sender_id: userId,
      author_name: "Team",
      body,
    });

    if (error) console.error("Failed to send message:", error.message);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <ol className="space-y-4">
        {messages.length === 0 && (
          <li className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-400">
            No messages on this project yet.
          </li>
        )}
        {messages.map((item) => (
          <li key={item.id} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-accent">
              {item.author_name.charAt(0).toUpperCase()}
            </span>
            <div className="flex-1 rounded-xl border border-neutral-200 bg-white p-4 shadow-card">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-primary-950">
                  {item.author_name}
                </p>
                <span className="text-xs text-neutral-400">
                  {formatDate(item.created_at)}
                </span>
              </div>
              <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-neutral-600">
                {item.body}
              </p>
            </div>
          </li>
        ))}
        <div ref={bottomRef} />
      </ol>

      <form
        onSubmit={handleSend}
        className="rounded-xl border border-neutral-200 bg-white p-4 shadow-card"
      >
        <label htmlFor="reply" className="sr-only">
          Write a message
        </label>
        <textarea
          id="reply"
          name="body"
          rows={3}
          required
          placeholder="Write to the client…"
          className="w-full resize-none rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

/* -------------------------------- Files tab ------------------------------- */

interface UploadState {
  name: string;
  progress: number; // simulated indeterminate → 100 on completion
  error?: string;
}

function FilesTab({ projectId, initial }: { projectId: string; initial: FileRow[] }) {
  const supabase = getSupabaseBrowserClient();
  const [files, setFiles] = useState(initial);
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  async function handleUploads(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    const { isAdmin, userId } = await ensureAdmin();
    // Admin-only by design — table + storage RLS enforce this server-side.
    if (!isAdmin || !userId) {
      setUploads([{ name: "", progress: 100, error: "Not authorized" }]);
      return;
    }

    const list = Array.from(fileList);
    setUploads(list.map((file) => ({ name: file.name, progress: 15 })));

    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      if (file.size > MAX_FILE_BYTES) {
        setUploads((current) =>
          current.map((u, index) =>
            index === i ? { ...u, progress: 100, error: "Max size is 25 MB" } : u
          )
        );
        continue;
      }

      setUploads((current) =>
        current.map((u, index) => (index === i ? { ...u, progress: 45 } : u))
      );

      const path = buildObjectPath(projectId, file.name);
      const result = await uploadToBucket(FILES_BUCKET, path, file);

      if (!result.ok) {
        setUploads((current) =>
          current.map((u, index) =>
            index === i ? { ...u, progress: 100, error: result.error } : u
          )
        );
        continue;
      }

      const { data: row, error: insertError } = await supabase
        .from("files")
        .insert({
          project_id: projectId,
          uploaded_by: userId,
          file_url: result.ref, // storage ref — signed URLs are minted on demand
          file_name: file.name,
          file_type: file.type || null,
        })
        .select("*")
        .single();

      setUploads((current) =>
        current.map((u, index) => (index === i ? { ...u, progress: 100 } : u))
      );

      if (!insertError && row) {
        setFiles((current) => [row as FileRow, ...current]);
      }
    }

    setTimeout(() => setUploads([]), 1500);
  }

  async function handleDownload(row: FileRow) {
    setDownloadingId(row.id);
    const url = await createFileDownloadUrl(supabase, row.file_url);
    setDownloadingId(null);
    if (!url) return;
    window.open(url, "_blank", "noopener");
  }

  async function handleDelete(row: FileRow) {
    setFiles((current) => current.filter((file) => file.id !== row.id));
    await removePrivateAsset(row.file_url); // delete object in private bucket…
    await supabase.from("files").delete().eq("id", row.id); // …then the row
  }

  return (
    <div className="space-y-5">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700">
        Upload Deliverable
        <input
          type="file"
          multiple
          className="hidden"
          onChange={(event) => {
            void handleUploads(event.target.files);
            event.target.value = "";
          }}
        />
      </label>
      <p className="-mt-2 text-xs text-neutral-400">
        Private bucket “elkahmed-files” · admins only · clients get expiring links.
      </p>

      {uploads.length > 0 && (
        <ul className="space-y-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-card">
          {uploads.map((upload, index) => (
            <li key={`${upload.name}-${index}`} className="text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-700">{upload.name}</span>
                {upload.error ? (
                  <span className="text-red-600">{upload.error}</span>
                ) : upload.progress >= 100 ? (
                  <span className="text-emerald-600">Done</span>
                ) : (
                  <span className="text-neutral-400">Uploading… {upload.progress}%</span>
                )}
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${upload.progress}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-card">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-5 py-3 font-medium">File</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Uploaded</th>
              <th className="px-5 py-3" aria-label="Actions" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {files.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-neutral-400">
                  No deliverables yet.
                </td>
              </tr>
            )}
            {files.map((row) => (
              <tr key={row.id} className="hover:bg-neutral-50/60">
                <td className="px-5 py-3.5 font-medium text-neutral-800">{row.file_name}</td>
                <td className="px-5 py-3.5 text-xs text-neutral-500">{row.file_type ?? "—"}</td>
                <td className="px-5 py-3.5 text-xs text-neutral-500">
                  {formatDate(row.created_at)}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => void handleDownload(row)}
                    disabled={downloadingId === row.id}
                    aria-label={`Download ${row.file_name}`}
                    className="mr-1 inline-flex h-8 w-8 items-center justify-center rounded-lg text-primary hover:bg-primary-50 disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(row)}
                    aria-label={`Delete ${row.file_name}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-600"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
