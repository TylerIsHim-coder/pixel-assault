import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import FolderCard from "@/components/vault/FolderCard";
import NoteCard from "@/components/vault/NoteCard";

interface Props {
  params: Promise<{ folderId: string }>;
}

const DEMO_USER_ID = "demo-user";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { folderId } = await params;
  const folder = await prisma.folder.findUnique({ where: { id: folderId } });
  return { title: folder?.name ?? "Folder" };
}

export default async function FolderPage({ params }: Props) {
  const { folderId } = await params;

  const folder = await prisma.folder.findFirst({
    where: { id: folderId, userId: DEMO_USER_ID },
    include: {
      parent: true,
      children: { include: { _count: { select: { notes: true, children: true } } } },
      notes: { orderBy: { updatedAt: "desc" } },
    },
  });

  if (!folder) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/vault" className="text-slate-500 hover:text-slate-300 transition-colors">Vault</Link>
        {folder.parent && (
          <>
            <span className="text-slate-700">/</span>
            <Link href={`/vault/${folder.parent.id}`} className="text-slate-500 hover:text-slate-300 transition-colors">
              {folder.parent.name}
            </Link>
          </>
        )}
        <span className="text-slate-700">/</span>
        <span className="text-slate-200 font-medium">{folder.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: folder.color + "22", border: `1px solid ${folder.color}44` }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={folder.color} strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">{folder.name}</h1>
        </div>
        <Link href={`/notes/new?folderId=${folder.id}`} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Note
        </Link>
      </div>

      {/* Subfolders */}
      {folder.children.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Subfolders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {folder.children.map((f) => (
              <FolderCard key={f.id} folder={f} />
            ))}
          </div>
        </section>
      )}

      {/* Notes */}
      <section>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Notes ({folder.notes.length})
        </h2>
        {folder.notes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {folder.notes.map((n) => (
              <NoteCard key={n.id} note={n} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12 border-dashed">
            <p className="text-slate-500 text-sm">This folder is empty.</p>
            <Link href={`/notes/new?folderId=${folder.id}`} className="inline-block mt-2 text-brand-400 text-xs hover:underline">
              Generate a note for this folder →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
