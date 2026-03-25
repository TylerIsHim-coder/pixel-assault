"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DBQuestion } from "@/types";

interface Props {
  question: DBQuestion;
  studentChoiceId: string | null;
}

export default function ExplanationPanel({ question, studentChoiceId }: Props) {
  const [text, setText]       = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch("/api/questions/explain", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId:     question.id,
        studentChoiceId,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          if (data.error) throw new Error(data.error);
          setText(data.explanation);
        }
      })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [question.id, studentChoiceId]);

  return (
    <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-4 space-y-2">
      <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider">✦ AI Explanation</p>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Generating explanation…
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {text && (
        <div className="prose prose-invert prose-sm max-w-none
          prose-p:text-slate-300 prose-li:text-slate-300
          prose-strong:text-slate-100 prose-headings:text-slate-200
          prose-code:text-brand-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
