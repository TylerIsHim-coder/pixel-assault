"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SECTIONS = [
  { value: "Math",              label: "Math",              time: "35 min", questions: 22 },
  { value: "Reading & Writing", label: "Reading & Writing", time: "32 min", questions: 27 },
  { value: "Full",              label: "Full Test",         time: "67 min", questions: 44 },
];

const QUICK_COUNTS = [5, 10, 15, 20];

export default function ExamSetupForm() {
  const router = useRouter();
  const [section, setSection]       = useState("Math");
  const [count, setCount]           = useState(10);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  async function handleStart() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/exam/start", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ section, questionCount: count }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to start exam");
      const { session } = await res.json();
      router.push(`/exam/${session.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setLoading(false);
    }
  }

  const selected = SECTIONS.find((s) => s.value === section)!;

  return (
    <div className="card space-y-6">
      {/* Section picker */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-300">Section</p>
        <div className="space-y-2">
          {SECTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSection(s.value)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                section === s.value
                  ? "border-brand-500/50 bg-brand-600/10"
                  : "border-surface-border hover:border-slate-500"
              }`}
            >
              <div>
                <p className={`font-medium text-sm ${section === s.value ? "text-brand-300" : "text-slate-300"}`}>
                  {s.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Up to {s.questions} questions · {s.time}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 ${section === s.value ? "border-brand-500 bg-brand-500" : "border-surface-muted"}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Question count */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-300">Number of questions</p>
        <div className="flex gap-2">
          {QUICK_COUNTS.map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                count === n
                  ? "border-brand-500/50 bg-brand-600/10 text-brand-300"
                  : "border-surface-border text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="p-3 rounded-xl bg-surface border border-surface-border text-xs text-slate-400 space-y-1">
        <div className="flex justify-between"><span>Section</span><span className="text-slate-200">{selected.label}</span></div>
        <div className="flex justify-between"><span>Questions</span><span className="text-slate-200">{count}</span></div>
        <div className="flex justify-between"><span>Time limit</span><span className="text-slate-200">{selected.time}</span></div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button onClick={handleStart} disabled={loading} className="btn-primary w-full justify-center py-3">
        {loading ? "Starting…" : "Begin Exam →"}
      </button>
    </div>
  );
}
