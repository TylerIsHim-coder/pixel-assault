"use client";

import { useEffect } from "react";
import { useExamStore } from "@/store/examStore";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function ExamTimer() {
  const { timeRemainingS, timeLimitS, isRunning, tick } = useExamStore();

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isRunning, tick]);

  const pct     = timeLimitS > 0 ? timeRemainingS / timeLimitS : 1;
  const warning = pct < 0.25;
  const danger  = pct < 0.1;

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-2 rounded-xl border font-mono text-sm font-semibold",
      danger  ? "border-red-500/40 bg-red-500/10 text-red-300 animate-pulse"
      : warning ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
      :           "border-surface-border bg-surface-card text-slate-200"
    )}>
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {formatTime(timeRemainingS)}
    </div>
  );
}
