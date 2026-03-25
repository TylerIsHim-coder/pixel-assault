import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { QuestionChoice } from "@/types";
import ExamFocusClient from "@/components/exam/ExamFocusClient";

interface Props {
  params: Promise<{ examId: string }>;
}

export default async function ExamFocusPage({ params }: Props) {
  const { examId } = await params;

  const session = await prisma.examSession.findUnique({
    where: { id: examId },
    include: {
      items: {
        include: { question: true },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!session) notFound();

  // Serialize for client — parse JSON choices
  const items = session.items.map((item) => ({
    id:       item.id,
    position: item.position,
    question: {
      id:          item.question.id,
      stem:        item.question.stem,
      category:    item.question.category,
      section:     item.question.section,
      difficulty:  item.question.difficulty,
      choices:     JSON.parse(item.question.choices) as QuestionChoice[],
      correctId:   item.question.correctId,
      explanation: item.question.explanation,
    },
  }));

  return (
    <ExamFocusClient
      sessionId={session.id}
      section={session.section}
      timeLimitS={session.timeLimitS}
      items={items}
    />
  );
}
