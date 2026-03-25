import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateNotes } from "@/lib/ai/generateNotes";
import { GenerateNotesRequest } from "@/types";

const DEMO_USER_ID = "demo-user";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateNotesRequest = await req.json();
    const { topic, folderId } = body;

    if (!topic?.trim()) {
      return NextResponse.json({ error: "topic is required" }, { status: 400 });
    }

    // Ensure demo user exists
    await prisma.user.upsert({
      where: { id: DEMO_USER_ID },
      create: { id: DEMO_USER_ID, email: "student@nexussat.app", name: "Student" },
      update: {},
    });

    const { title, content } = await generateNotes(topic.trim());

    const note = await prisma.note.create({
      data: {
        title,
        content,
        topic: topic.trim(),
        isAiGen: true,
        userId: DEMO_USER_ID,
        folderId: folderId ?? null,
      },
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (err) {
    console.error("[/api/notes/generate]", err);
    return NextResponse.json({ error: "Failed to generate note" }, { status: 500 });
  }
}
