import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format seconds → "MM:SS" */
export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Truncate long strings for card previews */
export function truncate(str: string, max = 120): string {
  return str.length <= max ? str : str.slice(0, max).trimEnd() + "…";
}

/** Strip markdown syntax for plain-text previews */
export function stripMarkdown(md: string): string {
  return md
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*|__|\*|_|~~|`/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-*>]\s/gm, "")
    .trim();
}

/** Relative time label ("2 hours ago") */
export function relativeTime(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/** Difficulty badge color classes */
export const difficultyColors: Record<string, string> = {
  easy:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/15   text-amber-400   border-amber-500/30",
  hard:   "bg-red-500/15     text-red-400     border-red-500/30",
};

/** Category → section mapping */
export const MATH_CATEGORIES = [
  "Heart of Algebra",
  "Problem Solving & Data Analysis",
  "Passport to Advanced Math",
  "Additional Topics in Math",
] as const;

export const RW_CATEGORIES = [
  "Information & Ideas",
  "Craft & Structure",
  "Expression of Ideas",
  "Standard English Conventions",
] as const;

export const ALL_CATEGORIES = [...MATH_CATEGORIES, ...RW_CATEGORIES] as const;
