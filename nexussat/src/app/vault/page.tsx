import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import FolderCard from "@/components/vault/FolderCard";
import NoteCard from "@/components/vault/NoteCard";

export const metadata: Metadata = { title: "Study Vault" };

// Hard-coded demo user — replace with session.user.id once auth is wired
const DEMO_USER_ID = "demo-user";

export default async function VaultPage() {
  const [folders, recentNotes] = await Promise.all([
    prisma.folder.findMany({
      where: { userId: DEMO_USER_ID, parentId: null },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { notes: true, children: true } } },
    }),
    prisma.note.findMany({
      where: { userId: DEMO_USER_ID },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Study Vault</h1>
          <p className="text-sm text-slate-400 mt-1">Organize your AI-generated notes and study materials</p>
        </div>
        <button className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Folder
        </button>
      </div>

      {/* Folders */}
      <section>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Folders</h2>
        {folders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {folders.map((f) => (
              <FolderCard key={f.id} folder={{ ...f, updatedAt: f.updatedAt }} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12 border-dashed">
            <p className="text-slate-500 text-sm">No folders yet.</p>
            <p className="text-slate-600 text-xs mt-1">Create a folder to organize your notes by subject or topic.</p>
          </div>
        )}
      </section>

      {/* Recent notes */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent Notes</h2>
          <Link href="/notes/new" className="btn-ghost text-xs">+ New Note</Link>
        </div>
        {recentNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentNotes.map((n) => (
              <NoteCard key={n.id} note={n} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12 border-dashed">
            <p className="text-slate-500 text-sm">No notes yet.</p>
            <Link href="/notes/new" className="inline-block mt-2 text-brand-400 text-xs hover:underline">
              Generate your first AI note →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
