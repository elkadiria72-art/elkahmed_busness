"use client";

import { Bell, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Notification } from "@/lib/database.types";

const MAX_ITEMS = 10;

export function NotificationsBell({ userId }: { userId: string }) {
  const supabase = getSupabaseBrowserClient();
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial load + realtime subscription for this admin's notifications.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(MAX_ITEMS);
      if (!cancelled && data) setItems(data);
    }
    void load();

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setItems((current) =>
            [payload.new as Notification, ...current].slice(0, MAX_ITEMS)
          );
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function onClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const unreadCount = items.filter((item) => !item.read).length;

  async function markAllRead() {
    setItems((current) => current.map((n) => ({ ...n, read: true })));
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-primary"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell className="h-5 w-5" aria-hidden />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-primary-950">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-card-hover">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
            <p className="text-sm font-semibold text-primary-950">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-accent-600"
              >
                <Check className="h-3.5 w-3.5" aria-hidden />
                Mark all read
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <p className="px-4 py-6 text-center text-xs text-neutral-500">
              No notifications yet.
            </p>
          ) : (
            <ul className="max-h-96 divide-y divide-neutral-100 overflow-y-auto">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={item.read ? "px-4 py-3" : "bg-accent/5 px-4 py-3"}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-primary-950">
                      {item.title}
                    </p>
                    {!item.read && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    )}
                  </div>
                  {item.body && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-neutral-600">
                      {item.body}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-neutral-400">
                    {formatDate(item.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
