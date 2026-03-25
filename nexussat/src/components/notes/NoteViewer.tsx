"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DBNote } from "@/types";
import { relativeTime } from "@/lib/utils";

interface Props {
  note: DBNote;
}

export default function NoteViewer({ note }: Props) {
  return (
    <article className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-surface-border">
        <div className="flex items-center gap-2">
          {note.isAiGen && (
            <span className="badge border-brand-500/30 bg-brand-500/10 text-brand-300">✦ AI Generated</span>
          )}
          <span className="text-xs text-slate-500">{relativeTime(note.updatedAt)}</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">{note.title}</h1>
        {note.topic && (
          <p className="text-sm text-slate-500">Generated from: <em className="text-slate-400">{note.topic}</em></p>
        )}
      </div>

      {/* Markdown content */}
      <div className="prose prose-invert prose-sm max-w-none
        prose-headings:font-semibold prose-headings:text-slate-100
        prose-h2:text-lg prose-h3:text-base prose-h3:text-brand-300
        prose-p:text-slate-300 prose-p:leading-relaxed
        prose-li:text-slate-300
        prose-strong:text-slate-100 prose-strong:font-semibold
        prose-code:text-brand-300 prose-code:bg-brand-500/10 prose-code:px-1 prose-code:rounded
        prose-pre:bg-surface-card prose-pre:border prose-pre:border-surface-border
        prose-blockquote:border-brand-500 prose-blockquote:text-slate-400
        prose-hr:border-surface-border
      ">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {note.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
