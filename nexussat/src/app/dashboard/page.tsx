import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };

const QUICK_ACTIONS = [
  {
    label: "Generate AI Notes",
    description: "Paste a topic and get structured SAT study notes instantly",
    href: "/notes/new",
    icon: "✦",
    color: "from-brand-600/20 to-brand-800/10 border-brand-500/20 hover:border-brand-500/40",
  },
  {
    label: "Study Vault",
    description: "Browse and organize your saved notes and folders",
    href: "/vault",
    icon: "◈",
    color: "from-violet-600/20 to-violet-800/10 border-violet-500/20 hover:border-violet-500/40",
  },
  {
    label: "Practice Questions",
    description: "Drill questions by category with AI explanations",
    href: "/practice",
    icon: "◎",
    color: "from-teal-600/20 to-teal-800/10 border-teal-500/20 hover:border-teal-500/40",
  },
  {
    label: "Start Exam Mode",
    description: "Timed, full-length practice with Bluebook-style interface",
    href: "/exam",
    icon: "⏱",
    color: "from-amber-600/20 to-amber-800/10 border-amber-500/20 hover:border-amber-500/40",
  },
];

const SAT_SECTIONS = [
  { label: "Heart of Algebra",               section: "Math",              color: "bg-brand-500/15 text-brand-300" },
  { label: "Problem Solving & Data Analysis", section: "Math",              color: "bg-brand-500/15 text-brand-300" },
  { label: "Passport to Advanced Math",       section: "Math",              color: "bg-brand-500/15 text-brand-300" },
  { label: "Additional Topics in Math",       section: "Math",              color: "bg-brand-500/15 text-brand-300" },
  { label: "Information & Ideas",             section: "Reading & Writing", color: "bg-violet-500/15 text-violet-300" },
  { label: "Craft & Structure",               section: "Reading & Writing", color: "bg-violet-500/15 text-violet-300" },
  { label: "Expression of Ideas",             section: "Reading & Writing", color: "bg-violet-500/15 text-violet-300" },
  { label: "Standard English Conventions",    section: "Reading & Writing", color: "bg-violet-500/15 text-violet-300" },
];

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Hero */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Welcome back 👋</h1>
        <p className="mt-1 text-slate-400 text-sm">Your AI-powered SAT prep hub. What are we working on today?</p>
      </div>

      {/* Quick action cards */}
      <section>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`card bg-gradient-to-br border transition-all duration-200 group ${action.color}`}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-0.5 opacity-80">{action.icon}</span>
                <div>
                  <p className="font-semibold text-slate-100 group-hover:text-white transition-colors">
                    {action.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SAT Category map */}
      <section>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">SAT Categories</h2>
        <div className="card space-y-4">
          {(["Math", "Reading & Writing"] as const).map((sec) => (
            <div key={sec}>
              <p className="text-xs font-semibold text-slate-500 mb-2">{sec}</p>
              <div className="flex flex-wrap gap-2">
                {SAT_SECTIONS.filter((s) => s.section === sec).map((s) => (
                  <Link
                    key={s.label}
                    href={`/practice?category=${encodeURIComponent(s.label)}`}
                    className={`badge border-transparent ${s.color} hover:opacity-80 transition-opacity`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats placeholder */}
      <section>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Your Progress</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Questions Answered", value: "0" },
            { label: "Notes Generated",    value: "0" },
            { label: "Exams Completed",    value: "0" },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <p className="text-3xl font-bold text-brand-400">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
