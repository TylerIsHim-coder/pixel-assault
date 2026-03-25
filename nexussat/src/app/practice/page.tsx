import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/db/prisma";
import CategoryFilter from "@/components/practice/CategoryFilter";
import QuestionCard from "@/components/practice/QuestionCard";
import { DBQuestion, QuestionChoice } from "@/types";

export const metadata: Metadata = { title: "Practice Questions" };

interface Props {
  searchParams: Promise<{
    category?: string;
    section?: string;
    difficulty?: string;
    page?: string;
  }>;
}

export default async function PracticePage({ searchParams }: Props) {
  const params = await searchParams;
  const page   = Math.max(1, Number(params.page ?? "1"));
  const limit  = 5;

  const where = {
    ...(params.category   && { category: params.category }),
    ...(params.section    && { section: params.section }),
    ...(params.difficulty && { difficulty: params.difficulty }),
  };

  const [rawQuestions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      orderBy: { createdAt: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.question.count({ where }),
  ]);

  const questions: DBQuestion[] = rawQuestions.map((q) => ({
    ...q,
    section:    q.section as DBQuestion["section"],
    difficulty: q.difficulty as DBQuestion["difficulty"],
    choices:    JSON.parse(q.choices) as QuestionChoice[],
  }));

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Practice Questions</h1>
        <p className="text-sm text-slate-400 mt-1">
          {total} question{total !== 1 ? "s" : ""} available
          {params.category ? ` in ${params.category}` : ""}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Filters sidebar */}
        <div className="w-64 shrink-0">
          <Suspense>
            <CategoryFilter />
          </Suspense>
        </div>

        {/* Questions feed */}
        <div className="flex-1 space-y-4 min-w-0">
          {questions.length > 0 ? (
            <>
              {questions.map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  {page > 1 && (
                    <a
                      href={`?${new URLSearchParams({ ...params, page: String(page - 1) })}`}
                      className="btn-ghost text-xs"
                    >
                      ← Prev
                    </a>
                  )}
                  <span className="text-xs text-slate-500">
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages && (
                    <a
                      href={`?${new URLSearchParams({ ...params, page: String(page + 1) })}`}
                      className="btn-ghost text-xs"
                    >
                      Next →
                    </a>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="card text-center py-16 border-dashed">
              <p className="text-slate-500">No questions match these filters.</p>
              <p className="text-xs text-slate-600 mt-1">
                Run <code className="text-brand-400">npm run db:seed</code> to populate the database.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
