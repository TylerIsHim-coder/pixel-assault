import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateExplanation } from "@/lib/ai/generateNotes";
import { QuestionChoice } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { questionId, studentChoiceId } = await req.json();

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });

    const choices: QuestionChoice[] = JSON.parse(question.choices);
    const explanation = await generateExplanation(
      question.stem,
      choices,
      question.correctId,
      studentChoiceId ?? null
    );

    return NextResponse.json({ explanation });
  } catch (err) {
    console.error("[/api/questions/explain]", err);
    return NextResponse.json({ error: "Failed to generate explanation" }, { status: 500 });
  }
}
