// Exam layout: NO sidebar — pure Focus Mode
export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {children}
    </div>
  );
}
