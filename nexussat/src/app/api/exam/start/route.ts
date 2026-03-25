import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const DEMO_USER_ID = "demo-user";

const TIME_LIMITS: Record<string, number> = {
  "Math":              2100,  // 35 min
  "Reading & Writing": 1920,  // 32 min
  "Full":              4020,  // 67 min
};

export async function POST(req: NextRequest) {
  try {
    const { section = "Full", questionCount = 10 } = await req.json();

    // Ensure demo user exists
    await prisma.user.upsert({
      where: { id: DEMO_USER_ID },
      create: { id: DEMO_USER_ID, email: "student@nexussat.app", name: "Student" },
      update: {},
    });

    // Pick random questions for the section
    const where = section === "Full" ? {} : { section };
    const allIds = await prisma.question.findMany({ where, select: { id: true } });
    const shuffled = allIds.sort(() => Math.random() - 0.5).slice(0, questionCount);

    const timeLimitS = TIME_LIMITS[section] ?? 2100;

    const session = await prisma.examSession.create({
      data: {
        userId:     DEMO_USER_ID,
        section,
        timeLimitS,
        totalItems: shuffled.length,
        items: {
          create: shuffled.map((q, i) => ({
            position:   i + 1,
            questionId: q.id,
          })),
        },
      },
      include: {
        items: {
          include: { question: true },
          orderBy: { position: "asc" },
        },
      },
    });

    return NextResponse.json({ session }, { status: 201 });
  } catch (err) {
    console.error("[/api/exam/start]", err);
    return NextResponse.json({ error: "Failed to start exam" }, { status: 500 });
  }
}
