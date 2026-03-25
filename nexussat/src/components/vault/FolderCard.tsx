"use client";

import Link from "next/link";
import { DBFolder } from "@/types";
import { relativeTime } from "@/lib/utils";

interface Props {
  folder: DBFolder & { _count?: { notes: number; children: number } };
}

export default function FolderCard({ folder }: Props) {
  return (
    <Link
      href={`/vault/${folder.id}`}
      className="card flex items-center gap-4 hover:border-white/10 transition-all group"
    >
      {/* Color dot */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
        style={{ backgroundColor: folder.color + "22", border: `1px solid ${folder.color}44` }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={folder.color} strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-100 truncate group-hover:text-white transition-colors">
          {folder.name}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {folder._count?.notes ?? 0} note{folder._count?.notes !== 1 ? "s" : ""}
          {(folder._count?.children ?? 0) > 0 && ` · ${folder._count?.children} subfolder${folder._count?.children !== 1 ? "s" : ""}`}
          {" · "}
          {relativeTime(folder.updatedAt)}
        </p>
      </div>

      <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
