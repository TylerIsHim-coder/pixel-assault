"use client";

import { useExamStore } from "@/store/examStore";
import { cn } from "@/lib/utils";

interface Props {
  items: { id: string; position: number }[];
}

export default function QuestionNavigator({ items }: Props) {
  const { currentIndex, answers, goTo } = useExamStore();

  return (
    <div className="card space-y-3">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Question Map</p>
      <div className="grid grid-cols-5 gap-1.5">
        {items.map((item, i) => {
          const answer  = answers.find((a) => a.itemId === item.id);
          const answered = !!answer?.chosenId;
          const marked   = !!answer?.isMarked;
          const active   = i === currentIndex;

          return (
            <button
              key={item.id}
              onClick={() => goTo(i)}
              title={`Q${item.position}${marked ? " (marked)" : ""}`}
              className={cn(
                "w-8 h-8 rounded-lg text-xs font-semibold transition-all relative",
                active   && "ring-2 ring-brand-500",
                answered && !active ? "bg-brand-600/30 text-brand-200"
                : !answered        ? "bg-surface text-slate-500 hover:bg-white/5"
                : "bg-brand-600 text-white"
              )}
            >
              {item.position}
              {marked && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-brand-600/30 inline-block"/> Answered</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-surface border border-surface-border inline-block"/> Unanswered</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/> Marked</span>
      </div>
    </div>
  );
}
