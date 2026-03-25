"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useExamStore } from "@/store/examStore";
import ExamTimer from "./ExamTimer";
import QuestionNavigator from "./QuestionNavigator";
import MarkForReviewButton from "./MarkForReviewButton";
import BuiltInCalculator from "./BuiltInCalculator";
import { QuestionChoice } from "@/types";
import { cn, difficultyColors } from "@/lib/utils";

interface ExamItem {
  id: string;
  position: number;
  question: {
    id: string;
    stem: string;
    category: string;
    section: string;
    difficulty: string;
    choices: QuestionChoice[];
    correctId: string;
    explanation: string;
  };
}

interface Props {
  sessionId: string;
  section: string;
  timeLimitS: number;
  items: ExamItem[];
}

export default function ExamFocusClient({ sessionId, section, timeLimitS, items }: Props) {
  const router = useRouter();
  const {
    initExam, answers, currentIndex,
    goNext, goPrev, setAnswer, submitExam,
    isSubmitted, isRunning, resetExam,
  } = useExamStore();

  const [showCalc,    setShowCalc   ] = useState(false);
  const [submitting,  setSubmitting  ] = useState(false);
  const [scoreData,   setScoreData  ] = useState<{ score: number; total: number } | null>(null);

  // Initialize once on mount
  useEffect(() => {
    initExam(sessionId, items.length, timeLimitS);
    return () => resetExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Auto-submit when timer hits zero
  useEffect(() => {
    if (isSubmitted && !scoreData && !submitting) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted]);

  async function handleSubmit() {
    setSubmitting(true);
    submitExam();
    try {
      const res = await fetch("/api/exam/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          sessionId,
          answers: answers.map((a) => ({ itemId: a.itemId, chosenId: a.chosenId })),
        }),
      });
      const data = await res.json();
      setScoreData({ score: data.score, total: data.total });
    } catch {
      // If submit fails, still show results from local state
      const correct = answers.filter((a) => {
        const item = items.find((i) => i.id === a.itemId);
        return item && a.chosenId === item.question.correctId;
      }).length;
      setScoreData({ score: correct, total: items.length });
    } finally {
      setSubmitting(false);
    }
  }

  const currentItem = items[currentIndex];
  const currentAnswer = answers.find((a) => a.itemId === currentItem?.id);

  // ─── Score screen ─────────────────────────────────────────────────────────
  if (scoreData) {
    const pct = Math.round((scoreData.score / scoreData.total) * 100);
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="card max-w-md w-full text-center space-y-6 animate-fade-in">
          <div>
            <p className="text-5xl font-bold text-brand-400">{scoreData.score}/{scoreData.total}</p>
            <p className="text-slate-400 mt-1">{pct}% correct</p>
          </div>
          <p className="text-slate-300 text-sm">
            {pct >= 80 ? "Excellent work! Keep it up." : pct >= 60 ? "Good effort. Review the missed questions." : "Keep practicing — you're making progress!"}
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push("/exam")} className="btn-primary">New Exam</button>
            <button onClick={() => router.push("/practice")} className="btn-ghost">Practice Mode</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Focus Mode UI ────────────────────────────────────────────────────────
  return (
    <>
      {/* Top bar */}
      <div className="h-14 border-b border-surface-border bg-surface-card flex items-center px-6 gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">N</span>
          </div>
          <span className="font-semibold text-sm text-slate-300">NexusSAT</span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-400">{section}</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-slate-500">{currentIndex + 1} / {items.length}</span>
          <ExamTimer />
          <button
            onClick={() => setShowCalc(!showCalc)}
            className={cn("btn-ghost text-xs", showCalc && "text-brand-400")}
          >
            ⊞ Calc
          </button>
          {isRunning && !isSubmitted && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary text-xs py-1.5"
            >
              {submitting ? "Submitting…" : "Submit Exam"}
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question area */}
        <div className="flex-1 overflow-y-auto p-8">
          {currentItem && (
            <div className="max-w-2xl mx-auto space-y-6 animate-slide-in" key={currentItem.id}>
              {/* Meta */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-500">Q{currentItem.position}</span>
                <span className="badge border-surface-muted text-slate-400 text-xs">{currentItem.question.category}</span>
                <span className={cn("badge text-xs", difficultyColors[currentItem.question.difficulty])}>
                  {currentItem.question.difficulty}
                </span>
                <div className="ml-auto">
                  <MarkForReviewButton itemId={currentItem.id} />
                </div>
              </div>

              {/* Stem */}
              <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-200 prose-p:leading-relaxed prose-p:text-base">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentItem.question.stem}</ReactMarkdown>
              </div>

              {/* Choices */}
              <div className="space-y-2">
                {currentItem.question.choices.map((choice) => {
                  const isSelected = currentAnswer?.chosenId === choice.id;
                  return (
                    <button
                      key={choice.id}
                      onClick={() => setAnswer(currentItem.id, choice.id)}
                      className={cn(
                        "w-full flex items-start gap-3 p-4 rounded-xl border text-left text-sm transition-all",
                        isSelected
                          ? "border-brand-500/60 bg-brand-500/10 text-slate-100"
                          : "border-surface-border text-slate-300 hover:border-slate-500 hover:bg-white/5"
                      )}
                    >
                      <span className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                        isSelected ? "bg-brand-500 text-white" : "bg-surface-muted text-slate-400"
                      )}>
                        {choice.id}
                      </span>
                      <span className="leading-relaxed pt-0.5">{choice.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Nav */}
              <div className="flex items-center justify-between pt-2">
                <button onClick={goPrev} disabled={currentIndex === 0} className="btn-ghost" >← Previous</button>
                <button onClick={goNext} disabled={currentIndex === items.length - 1} className="btn-ghost">Next →</button>
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="w-60 shrink-0 border-l border-surface-border overflow-y-auto p-4 space-y-4">
          <QuestionNavigator items={items.map((i) => ({ id: i.id, position: i.position }))} />
          {showCalc && <BuiltInCalculator />}
        </div>
      </div>
    </>
  );
}
