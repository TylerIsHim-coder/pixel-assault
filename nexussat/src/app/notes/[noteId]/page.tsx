import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import NoteViewer from "@/components/notes/NoteViewer";

interface Props {
  params: Promise<{ noteId: string }>;
}

const DEMO_USER_ID = "demo-user";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { noteId } = await params;
  const note = await prisma.note.findUnique({ where: { id: noteId } });
  return { title: note?.title ?? "Note" };
}

export default async function NoteDetailPage({ params }: Props) {
  const { noteId } = await params;

  const note = await prisma.note.findFirst({
    where: { id: noteId, userId: DEMO_USER_ID },
    include: { folder: true },
  });

  if (!note) notFound();

  return (
    <div className="animate-fade-in">
      {/* Back nav */}
      <div className="mb-6">
        <Link
          href={note.folderId ? `/vault/${note.folderId}` : "/vault"}
          className="btn-ghost text-xs"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {note.folder ? note.folder.name : "Study Vault"}
        </Link>
      </div>

      <NoteViewer note={note} />
    </div>
  );
}
