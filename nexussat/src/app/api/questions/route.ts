import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { DBQuestion, QuestionChoice } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category   = searchParams.get("category") ?? undefined;
  const section    = searchParams.get("section") ?? undefined;
  const difficulty = searchParams.get("difficulty") ?? undefined;
  const page       = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit      = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "10")));

  const where = {
    ...(category   && { category }),
    ...(section    && { section }),
    ...(difficulty && { difficulty }),
  };

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      orderBy: { createdAt: "asc" },
      skip:  (page - 1) * limit,
      take:  limit,
    }),
    prisma.question.count({ where }),
  ]);

  // Parse choices JSON → typed array
  const parsed: DBQuestion[] = questions.map((q) => ({
    ...q,
    section: q.section as DBQuestion["section"],
    difficulty: q.difficulty as DBQuestion["difficulty"],
    choices: JSON.parse(q.choices) as QuestionChoice[],
  }));

  return NextResponse.json({ questions: parsed, total, page, limit });
}
