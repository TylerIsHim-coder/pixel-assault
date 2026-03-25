import type { Metadata } from "next";
import ExamSetupForm from "@/components/exam/ExamSetupForm";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export const metadata: Metadata = { title: "Exam Mode" };

export default function ExamSetupPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-xl mx-auto space-y-8 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Exam Mode</h1>
              <p className="text-sm text-slate-400 mt-1">
                Configure your timed practice session. The interface will switch to Focus Mode when you begin.
              </p>
            </div>
            <ExamSetupForm />
          </div>
        </main>
      </div>
    </div>
  );
}
