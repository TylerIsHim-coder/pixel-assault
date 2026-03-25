"use client";

import { useExamStore } from "@/store/examStore";
import { cn } from "@/lib/utils";

interface Props {
  itemId: string;
}

export default function MarkForReviewButton({ itemId }: Props) {
  const { answers, toggleMark } = useExamStore();
  const isMarked = answers.find((a) => a.itemId === itemId)?.isMarked ?? false;

  return (
    <button
      onClick={() => toggleMark(itemId)}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
        isMarked
          ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
          : "border-surface-border text-slate-400 hover:text-slate-200 hover:bg-white/5"
      )}
    >
      <svg className="w-3.5 h-3.5" fill={isMarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      {isMarked ? "Marked for Review" : "Mark for Review"}
    </button>
  );
}
