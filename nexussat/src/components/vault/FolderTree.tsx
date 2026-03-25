"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DBFolder } from "@/types";
import { useVaultStore } from "@/store/vaultStore";
import { cn } from "@/lib/utils";

interface Props {
  folders: DBFolder[];
  depth?: number;
}

export default function FolderTree({ folders, depth = 0 }: Props) {
  const pathname = usePathname();
  const { expandedIds, toggleFolder } = useVaultStore();

  if (folders.length === 0) return null;

  return (
    <ul className={cn("space-y-0.5", depth > 0 && "ml-4 border-l border-surface-border pl-2 mt-0.5")}>
      {folders.map((folder) => {
        const isOpen   = expandedIds.has(folder.id);
        const isActive = pathname === `/vault/${folder.id}`;
        const hasChildren = (folder.children?.length ?? 0) > 0;

        return (
          <li key={folder.id}>
            <div className="flex items-center gap-1">
              {/* Expand toggle */}
              <button
                onClick={() => toggleFolder(folder.id)}
                className={cn(
                  "w-4 h-4 flex items-center justify-center rounded text-slate-600 hover:text-slate-400 transition-colors shrink-0",
                  !hasChildren && "opacity-0 pointer-events-none"
                )}
              >
                <svg className={cn("w-3 h-3 transition-transform", isOpen && "rotate-90")} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              <Link
                href={`/vault/${folder.id}`}
                className={cn(
                  "flex-1 flex items-center gap-2 px-2 py-1 rounded-md text-xs transition-colors truncate",
                  isActive
                    ? "bg-brand-600/20 text-brand-300"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                )}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: folder.color }}
                />
                <span className="truncate">{folder.name}</span>
              </Link>
            </div>

            {/* Recursive children */}
            {isOpen && hasChildren && (
              <FolderTree folders={folder.children!} depth={depth + 1} />
            )}
          </li>
        );
      })}
    </ul>
  );
}
