"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DBQuestion } from "@/types";
import { cn, difficultyColors } from "@/lib/utils";
import ExplanationPanel from "./ExplanationPanel";

interface Props {
  question: DBQuestion;
}

export default function QuestionCard({ question }: Props) {
  const [selected, setSelected]     = useState<string | null>(null);
  const [submitted, setSubmitted]   = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  function handleSelect(id: string) {
    if (submitted) return;
    setSelected(id);
  }

  function handleSubmit() {
    if (!selected) return;
    setSubmitted(true);
  }

  function handleNext() {
    setSelected(null);
    setSubmitted(false);
    setShowExplain(false);
  }

  const isCorrect = selected === question.correctId;

  return (
    <div className="card space-y-4 animate-slide-in">
      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="badge border-surface-muted text-slate-400 text-xs">{question.section}</span>
        <span className="badge border-surface-muted text-slate-400 text-xs">{question.category}</span>
        <span className={cn("badge text-xs", difficultyColors[question.difficulty])}>
          {question.difficulty}
        </span>
      </div>

      {/* Stem */}
      <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-200 prose-p:leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{question.stem}</ReactMarkdown>
      </div>

      {/* Choices */}
      <div className="space-y-2">
        {question.choices.map((choice) => {
          const isSelected = selected === choice.id;
          const isAnswer   = choice.id === question.correctId;

          return (
            <button
              key={choice.id}
              onClick={() => handleSelect(choice.id)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-lg border text-left text-sm transition-all",
                !submitted && isSelected && "border-brand-500/60 bg-brand-500/10 text-slate-100",
                !submitted && !isSelected && "border-surface-border text-slate-300 hover:border-slate-500 hover:bg-white/5",
                submitted  && isAnswer   && "border-emerald-500/60 bg-emerald-500/10 text-emerald-100",
                submitted  && isSelected && !isAnswer && "border-red-500/60 bg-red-500/10 text-red-200",
                submitted  && !isSelected && !isAnswer && "border-surface-border text-slate-500 opacity-60"
              )}
            >
              <span className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5",
                !submitted && isSelected && "bg-brand-500 text-white",
                !submitted && !isSelected && "bg-surface-muted text-slate-400",
                submitted  && isAnswer   && "bg-emerald-500 text-white",
                submitted  && isSelected && !isAnswer && "bg-red-500 text-white",
                submitted  && !isSelected && !isAnswer && "bg-surface-muted text-slate-600"
              )}>
                {choice.id}
              </span>
              <span className="leading-relaxed">{choice.text}</span>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className="btn-primary"
          >
            Check Answer
          </button>
        ) : (
          <>
            <div className={cn("flex items-center gap-2 text-sm font-medium", isCorrect ? "text-emerald-400" : "text-red-400")}>
              {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
            </div>
            <button
              onClick={() => setShowExplain(!showExplain)}
              className="btn-ghost text-xs"
            >
              {showExplain ? "Hide" : "Show"} Explanation
            </button>
            <button onClick={handleNext} className="btn-ghost text-xs ml-auto">
              Next Question →
            </button>
          </>
        )}
      </div>

      {/* AI Explanation */}
      {submitted && showExplain && (
        <ExplanationPanel
          question={question}
          studentChoiceId={selected}
        />
      )}
    </div>
  );
}
