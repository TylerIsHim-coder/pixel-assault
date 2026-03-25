// ─── DB-hydrated types (mirror Prisma models, safe to pass to client) ───────

export interface DBUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}

export interface DBFolder {
  id: string;
  name: string;
  color: string;
  parentId: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  children?: DBFolder[];
  notes?: DBNote[];
  _count?: { notes: number; children: number };
}

export interface DBNote {
  id: string;
  title: string;
  content: string;
  topic: string | null;
  isAiGen: boolean;
  folderId: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBQuestion {
  id: string;
  category: string;
  section: "Math" | "Reading & Writing";
  difficulty: "easy" | "medium" | "hard";
  stem: string;
  choices: QuestionChoice[];
  correctId: string;
  explanation: string;
  source: string;
  createdAt: Date;
}

export interface DBExamSession {
  id: string;
  section: string;
  timeLimitS: number;
  startedAt: Date;
  submittedAt: Date | null;
  score: number | null;
  totalItems: number;
  items: DBExamItem[];
}

export interface DBExamItem {
  id: string;
  position: number;
  chosenId: string | null;
  isMarked: boolean;
  isCorrect: boolean | null;
  questionId: string;
  question?: DBQuestion;
}

// ─── UI / domain types ───────────────────────────────────────────────────────

export interface QuestionChoice {
  id: string;   // "A" | "B" | "C" | "D"
  text: string;
}

export type SATSection = "Math" | "Reading & Writing";

export type SATCategory =
  | "Heart of Algebra"
  | "Problem Solving & Data Analysis"
  | "Passport to Advanced Math"
  | "Additional Topics in Math"
  | "Information & Ideas"
  | "Craft & Structure"
  | "Expression of Ideas"
  | "Standard English Conventions";

export type Difficulty = "easy" | "medium" | "hard";

// ─── API payload types ────────────────────────────────────────────────────────

export interface GenerateNotesRequest {
  topic: string;
  folderId?: string;
}

export interface GenerateNotesResponse {
  note: DBNote;
}

export interface SubmitExamRequest {
  sessionId: string;
  answers: { itemId: string; chosenId: string | null }[];
}

export interface SubmitExamResponse {
  score: number;
  total: number;
  correctIds: string[];
}
