"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ALL_CATEGORIES } from "@/lib/utils";

interface Props {
  folderId?: string;
}

export default function AIGeneratorForm({ folderId }: Props) {
  const router = useRouter();
  const [topic, setTopic]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/notes/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ topic: topic.trim(), folderId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Generation failed");
      }

      const { note } = await res.json();
      router.push(`/notes/${note.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Topic input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">
          Topic or concept
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Solving linear equations with one variable, or paste raw notes to restructure..."
          rows={4}
          className="input resize-none"
          disabled={loading}
        />
        <p className="text-xs text-slate-500">
          Be specific for better notes. You can enter a concept name, a question type, or paste raw text to restructure.
        </p>
      </div>

      {/* Quick-fill category chips */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Quick-fill from SAT category</p>
        <div className="flex flex-wrap gap-1.5">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setTopic(cat)}
              className="badge border-surface-muted text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors cursor-pointer"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !topic.trim()}
        className="btn-primary w-full justify-center py-2.5"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating notes…
          </>
        ) : (
          <>
            <span>✦</span>
            Generate AI Notes
          </>
        )}
      </button>
    </form>
  );
}
