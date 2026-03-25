"use client";

import Link from "next/link";
import { DBNote } from "@/types";
import { relativeTime, stripMarkdown, truncate } from "@/lib/utils";

interface Props {
  note: DBNote;
}

export default function NoteCard({ note }: Props) {
  const preview = truncate(stripMarkdown(note.content), 110);

  return (
    <Link
      href={`/notes/${note.id}`}
      className="card hover:border-white/10 transition-all group space-y-2"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-slate-100 truncate group-hover:text-white transition-colors">
          {note.title}
        </p>
        {note.isAiGen && (
          <span className="badge border-brand-500/30 bg-brand-500/10 text-brand-300 shrink-0">
            ✦ AI
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{preview}</p>
      <p className="text-xs text-slate-600">{relativeTime(note.updatedAt)}</p>
    </Link>
  );
}
