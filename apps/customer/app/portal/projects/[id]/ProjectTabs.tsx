"use client";

import { Download, Send } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Timeline } from "@/components/Timeline";
import { formatDate } from "@/lib/utils";
import { TIMELINE_STEPS } from "@/lib/types";
import type { PortalProject, TimelineEntry } from "@/lib/types";

type Tab = "Overview" | "Messages" | "Files" | "Updates";

const tabs: Tab[] = ["Overview", "Messages", "Files", "Updates"];

const tabClasses = (active: boolean) =>
  `border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
    active
      ? "border-accent text-primary"
      : "border-transparent text-neutral-500 hover:border-neutral-200 hover:text-primary"
  }`;

function buildTimelineEntries(
  currentIndex: number,
  lastUpdate: string
): TimelineEntry[] {
  return TIMELINE_STEPS.map((label, index) => {
    if (index < currentIndex) {
      return { label, date: "Completed" };
    }
    if (index === currentIndex) {
      return { label, date: `Since ${formatDate(lastUpdate)}` };
    }
    return { label };
  });
}

export function ProjectTabs({ project }: { project: PortalProject }) {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const timelineSteps = buildTimelineEntries(
    project.currentStep,
    project.lastUpdate
  );

  function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: wire to Supabase (messages table)
    console.log("Portal message", Object.fromEntries(new FormData(event.currentTarget)));
    event.currentTarget.reset();
  }

  return (
    <div>
      <div className="flex overflow-x-auto border-b border-neutral-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={tabClasses(activeTab === tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="py-8">
        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <section>
                <h2 className="text-base font-semibold text-primary-950">
                  About this project
                </h2>
                <p className="mt-2 leading-relaxed text-neutral-600">
                  {project.description}
                </p>
              </section>
              <section>
                <h2 className="text-base font-semibold text-primary-950">
                  Technologies
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 ring-1 ring-inset ring-primary-100"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
            <aside>
              <h2 className="text-base font-semibold text-primary-950">Progress</h2>
              <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-card">
                <Timeline steps={timelineSteps} currentIndex={project.currentStep} />
              </div>
            </aside>
          </div>
        )}

        {activeTab === "Messages" && (
          <div className="mx-auto max-w-2xl space-y-6">
            <ol className="space-y-5">
              {project.messages.map((message) => (
                <li key={message.id} className="flex gap-4">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      message.role === "You"
                        ? "bg-accent/20 text-accent-700"
                        : "bg-primary text-accent"
                    }`}
                  >
                    {message.author.charAt(0)}
                  </span>
                  <div className="flex-1 rounded-xl border border-neutral-200 bg-white p-4 shadow-card">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-primary-950">
                        {message.author}
                      </p>
                      <span className="text-xs text-neutral-400">
                        {formatDate(message.date)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                      {message.body}
                    </p>
                  </div>
                </li>
              ))}
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
                name="message"
                rows={3}
                required
                placeholder="Write a message to the team…"
                className="w-full resize-none rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                >
                  <Send className="h-4 w-4" aria-hidden />
                  Send
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "Files" && (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="px-5 py-3 font-medium">File</th>
                  <th className="hidden px-5 py-3 font-medium sm:table-cell">Size</th>
                  <th className="hidden px-5 py-3 font-medium sm:table-cell">Uploaded</th>
                  <th className="px-5 py-3" aria-label="Download" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {project.files.map((file) => (
                  <tr key={file.id} className="transition-colors hover:bg-neutral-50">
                    <td className="px-5 py-3.5 font-medium text-neutral-800">
                      {file.name}
                    </td>
                    <td className="hidden px-5 py-3.5 text-neutral-500 sm:table-cell">
                      {file.size}
                    </td>
                    <td className="hidden px-5 py-3.5 text-neutral-500 sm:table-cell">
                      {formatDate(file.date)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {/* TODO: real download URLs from Supabase Storage */}
                      <a
                        href="#"
                        onClick={(event) => event.preventDefault()}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary-50"
                      >
                        <Download className="h-3.5 w-3.5" aria-hidden />
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "Updates" && (
          <ol className="relative mx-auto max-w-2xl space-y-8 border-l-2 border-neutral-100 pl-6">
            {project.updates.map((update) => (
              <li key={update.id} className="relative">
                <span className="absolute -left-[31px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-accent bg-white" />
                <p className="text-xs font-medium text-neutral-400">
                  {formatDate(update.date)}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-primary-950">
                  {update.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                  {update.body}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
