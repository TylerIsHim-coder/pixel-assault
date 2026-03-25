"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { MATH_CATEGORIES, RW_CATEGORIES } from "@/lib/utils";
import { cn } from "@/lib/utils";

const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export default function CategoryFilter() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const activeCategory   = searchParams.get("category") ?? "";
  const activeSection    = searchParams.get("section") ?? "";
  const activeDifficulty = searchParams.get("difficulty") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page on filter change
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleCategory(cat: string) {
    updateParam("category", activeCategory === cat ? "" : cat);
    // Keep section in sync
    if (MATH_CATEGORIES.includes(cat as never)) updateParam("section", "Math");
    else updateParam("section", "Reading & Writing");
  }

  return (
    <div className="card space-y-5">
      {/* Section tabs */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Section</p>
        <div className="flex gap-2">
          {(["Math", "Reading & Writing", ""] as const).map((sec) => (
            <button
              key={sec || "all"}
              onClick={() => { updateParam("section", sec); updateParam("category", ""); }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                activeSection === sec
                  ? "bg-brand-600 text-white"
                  : "bg-surface text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              {sec || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Math categories */}
      {(!activeSection || activeSection === "Math") && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Math</p>
          <div className="flex flex-wrap gap-1.5">
            {MATH_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={cn(
                  "badge border transition-colors cursor-pointer",
                  activeCategory === cat
                    ? "bg-brand-600/30 border-brand-500/60 text-brand-200"
                    : "border-surface-muted text-slate-400 hover:text-slate-200 hover:border-slate-500"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* R&W categories */}
      {(!activeSection || activeSection === "Reading & Writing") && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Reading & Writing</p>
          <div className="flex flex-wrap gap-1.5">
            {RW_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={cn(
                  "badge border transition-colors cursor-pointer",
                  activeCategory === cat
                    ? "bg-violet-600/30 border-violet-500/60 text-violet-200"
                    : "border-surface-muted text-slate-400 hover:text-slate-200 hover:border-slate-500"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Difficulty */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Difficulty</p>
        <div className="flex gap-2">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              onClick={() => updateParam("difficulty", activeDifficulty === diff ? "" : diff)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors",
                activeDifficulty === diff
                  ? diff === "easy"   ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/30"
                  : diff === "medium" ? "bg-amber-600/30   text-amber-300   border border-amber-500/30"
                  :                     "bg-red-600/30     text-red-300     border border-red-500/30"
                  : "bg-surface text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {(activeCategory || activeSection || activeDifficulty) && (
        <button
          onClick={() => router.push(pathname)}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          ✕ Clear all filters
        </button>
      )}
    </div>
  );
}
