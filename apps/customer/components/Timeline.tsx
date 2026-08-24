import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TimelineEntry } from "@/lib/types";

interface TimelineProps {
  steps: TimelineEntry[];
  /** Index of the current (active) step; -1 if none started yet */
  currentIndex: number;
}

export function Timeline({ steps, currentIndex }: TimelineProps) {
  return (
    <ol className="relative space-y-8 before:absolute before:bottom-2 before:left-[15px] before:top-2 before:w-px before:bg-neutral-200">
      {steps.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li key={step.label} className="relative flex gap-4 pl-0">
            <div
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                isDone && "border-accent bg-accent",
                isCurrent && "border-accent bg-white",
                !isDone && !isCurrent && "border-neutral-300 bg-white"
              )}
            >
              {isDone ? (
                <Check className="h-4 w-4 text-white" aria-hidden />
              ) : isCurrent ? (
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
                </span>
              ) : null}
            </div>
            <div className={cn("pb-0", index === steps.length - 1 && "pt-1")}>
              <p
                className={cn(
                  "text-sm font-semibold leading-7",
                  isDone || isCurrent ? "text-primary-950" : "text-neutral-400"
                )}
              >
                {step.label}
              </p>
              {(step.date || isCurrent) && (
                <p className="text-xs text-neutral-500">
                  {step.date ?? "In progress"}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
