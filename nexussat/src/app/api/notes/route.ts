import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const DEMO_USER_ID = "demo-user";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const folderId = searchParams.get("folderId") ?? undefined;

  const notes = await prisma.note.findMany({
    where: { userId: DEMO_USER_ID, ...(folderId ? { folderId } : {}) },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ notes });
}
