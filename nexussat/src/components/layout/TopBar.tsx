"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Build a breadcrumb trail from the URL path
function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const labels: Record<string, string> = {
    dashboard: "Dashboard",
    vault:     "Study Vault",
    notes:     "Notes",
    new:       "New Note",
    practice:  "Practice",
    exam:      "Exam Mode",
  };

  return segments.map((seg, i) => ({
    label: labels[seg] ?? seg,
    href:  "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));
}

export default function TopBar() {
  const crumbs = useBreadcrumbs();

  return (
    <header className="h-14 shrink-0 border-b border-surface-border bg-surface/80 backdrop-blur-sm flex items-center px-6 gap-2">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-2">
          {i > 0 && <span className="text-slate-600">/</span>}
          {crumb.isLast ? (
            <span className="text-sm font-medium text-slate-200">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}

      {/* Right slot — keyboard shortcut hint */}
      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/notes/new"
          className="btn-primary text-xs py-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Note
        </Link>
      </div>
    </header>
  );
}
