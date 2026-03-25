import type { Metadata } from "next";
import AIGeneratorForm from "@/components/notes/AIGeneratorForm";

export const metadata: Metadata = { title: "Generate AI Notes" };

interface Props {
  searchParams: Promise<{ folderId?: string }>;
}

export default async function NewNotePage({ searchParams }: Props) {
  const { folderId } = await searchParams;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">✦</span>
          <h1 className="text-2xl font-bold text-slate-100">AI Note Generator</h1>
        </div>
        <p className="text-slate-400 text-sm">
          Enter any SAT topic or paste raw text. Claude will generate structured, exam-ready study notes in seconds.
        </p>
      </div>

      <div className="card">
        <AIGeneratorForm folderId={folderId} />
      </div>

      {/* Tips */}
      <div className="card border-dashed space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tips for better notes</p>
        <ul className="space-y-1 text-xs text-slate-400">
          <li>• <strong className="text-slate-300">Be specific:</strong> "Linear equations with fractions" → better than "algebra"</li>
          <li>• <strong className="text-slate-300">Paste your draft:</strong> Paste messy notes and ask to "restructure and improve"</li>
          <li>• <strong className="text-slate-300">Use category chips:</strong> Click any SAT category above for instant topic fill</li>
        </ul>
      </div>
    </div>
  );
}
