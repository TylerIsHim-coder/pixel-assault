import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { SubmitExamRequest, QuestionChoice } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: SubmitExamRequest = await req.json();
    const { sessionId, answers } = body;

    const session = await prisma.examSession.findUnique({
      where: { id: sessionId },
      include: { items: { include: { question: true } } },
    });

    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    if (session.submittedAt) return NextResponse.json({ error: "Already submitted" }, { status: 400 });

    let score = 0;
    const correctIds: string[] = [];

    // Grade each item
    await Promise.all(
      session.items.map(async (item) => {
        const answer   = answers.find((a) => a.itemId === item.id);
        const chosenId = answer?.chosenId ?? null;
        const isCorrect = chosenId === item.question.correctId;

        if (isCorrect) {
          score++;
          correctIds.push(item.id);
        }

        await prisma.examItem.update({
          where: { id: item.id },
          data:  { chosenId, isCorrect },
        });
      })
    );

    // Finalize session
    await prisma.examSession.update({
      where: { id: sessionId },
      data:  { submittedAt: new Date(), score },
    });

    return NextResponse.json({ score, total: session.totalItems, correctIds });
  } catch (err) {
    console.error("[/api/exam/submit]", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
