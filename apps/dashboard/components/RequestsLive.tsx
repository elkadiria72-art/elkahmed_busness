"use client";

import { useEffect, useMemo, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { RequestRow, RequestStatus } from "@/lib/database.types";

const statusStyles: Record<RequestStatus, string> = {
  new: "bg-accent/15 text-accent-700 ring-accent/30",
  reviewing: "bg-blue-50 text-blue-700 ring-blue-200",
  accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-neutral-100 text-neutral-500 ring-neutral-200",
};

const statusOptions: RequestStatus[] = ["new", "reviewing", "accepted", "rejected"];

export function RequestsLive({ initialRequests }: { initialRequests: RequestRow[] }) {
  const supabase = getSupabaseBrowserClient();
  const [requests, setRequests] = useState(initialRequests);

  // Realtime: new INSERTs on `requests` appear without a manual refresh.
  // The subscription is removed on unmount to avoid leaks.
  useEffect(() => {
    const channel = supabase
      .channel("requests-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "requests" },
        (payload) => {
          setRequests((current) => [payload.new as RequestRow, ...current]);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase]);

  const stats = useMemo(() => {
    return {
      total: requests.length,
      new: requests.filter((r) => r.status === "new").length,
      reviewing: requests.filter((r) => r.status === "reviewing").length,
      accepted: requests.filter((r) => r.status === "accepted").length,
    };
  }, [requests]);

  async function updateStatus(id: number, status: RequestStatus) {
    // Optimistic update; RLS is the real gatekeeper.
    setRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
    await supabase.from("requests").update({ status }).eq("id", id);
  }

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {(
          [
            ["Total requests", stats.total],
            ["New", stats.new],
            ["Reviewing", stats.reviewing],
            ["Accepted", stats.accepted],
          ] as const
        ).map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-neutral-200 bg-white p-5 shadow-card"
          >
            <p className="text-2xl font-bold text-primary-950">{value}</p>
            <p className="mt-0.5 text-xs text-neutral-500">{label}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-lg font-bold text-primary-950">Requests</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Need</th>
                <th className="px-5 py-3 font-medium">Budget</th>
                <th className="px-5 py-3 font-medium">Received</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-neutral-400">
                    No requests yet — they will appear here the moment they arrive.
                  </td>
                </tr>
              )}
              {requests.map((request) => (
                <tr key={request.id} className="align-top hover:bg-neutral-50/60">
                  <td className="px-5 py-4">
                    <p className="font-medium text-primary-950">{request.name}</p>
                    <p className="text-xs text-neutral-500">{request.email}</p>
                    <p className="text-xs text-neutral-500">{request.phone}</p>
                    {request.company && (
                      <p className="text-xs text-neutral-400">{request.company}</p>
                    )}
                  </td>
                  <td className="max-w-[260px] px-5 py-4">
                    <p className="font-medium text-neutral-800">{request.need}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">
                      {request.message}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-xs text-neutral-600">
                    {request.budget ?? "—"}
                    {request.deadline && (
                      <>
                        <br />
                        by {formatDate(request.deadline)}
                      </>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs text-neutral-500">
                    {formatDate(request.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={request.status}
                      onChange={(event) =>
                        void updateStatus(request.id, event.target.value as RequestStatus)
                      }
                      aria-label={`Status for request from ${request.name}`}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset focus:outline-none ${statusStyles[request.status]}`}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
