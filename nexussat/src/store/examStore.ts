import { create } from "zustand";

export interface ExamAnswer {
  itemId: string;
  chosenId: string | null;
  isMarked: boolean;
}

interface ExamState {
  sessionId: string | null;
  totalItems: number;
  timeLimitS: number;
  timeRemainingS: number;
  isRunning: boolean;
  isSubmitted: boolean;
  currentIndex: number;   // 0-based
  answers: ExamAnswer[];  // one per question, indexed by position

  // Actions
  initExam:    (sessionId: string, totalItems: number, timeLimitS: number) => void;
  tick:        () => void;
  setAnswer:   (itemId: string, chosenId: string) => void;
  toggleMark:  (itemId: string) => void;
  goTo:        (index: number) => void;
  goNext:      () => void;
  goPrev:      () => void;
  submitExam:  () => void;
  resetExam:   () => void;
}

export const useExamStore = create<ExamState>()((set, get) => ({
  sessionId:      null,
  totalItems:     0,
  timeLimitS:     0,
  timeRemainingS: 0,
  isRunning:      false,
  isSubmitted:    false,
  currentIndex:   0,
  answers:        [],

  initExam: (sessionId, totalItems, timeLimitS) =>
    set({
      sessionId,
      totalItems,
      timeLimitS,
      timeRemainingS: timeLimitS,
      isRunning:      true,
      isSubmitted:    false,
      currentIndex:   0,
      answers:        [],
    }),

  tick: () =>
    set((s) => {
      if (!s.isRunning || s.isSubmitted) return s;
      const next = s.timeRemainingS - 1;
      if (next <= 0) return { ...s, timeRemainingS: 0, isRunning: false, isSubmitted: true };
      return { ...s, timeRemainingS: next };
    }),

  setAnswer: (itemId, chosenId) =>
    set((s) => {
      const existing = s.answers.find((a) => a.itemId === itemId);
      if (existing) {
        return { answers: s.answers.map((a) => a.itemId === itemId ? { ...a, chosenId } : a) };
      }
      return { answers: [...s.answers, { itemId, chosenId, isMarked: false }] };
    }),

  toggleMark: (itemId) =>
    set((s) => {
      const existing = s.answers.find((a) => a.itemId === itemId);
      if (existing) {
        return { answers: s.answers.map((a) => a.itemId === itemId ? { ...a, isMarked: !a.isMarked } : a) };
      }
      return { answers: [...s.answers, { itemId, chosenId: null, isMarked: true }] };
    }),

  goTo:   (index) => set({ currentIndex: Math.max(0, Math.min(index, get().totalItems - 1)) }),
  goNext: () => set((s) => ({ currentIndex: Math.min(s.currentIndex + 1, s.totalItems - 1) })),
  goPrev: () => set((s) => ({ currentIndex: Math.max(s.currentIndex - 1, 0) })),

  submitExam: () => set({ isSubmitted: true, isRunning: false }),
  resetExam:  () => set({ sessionId: null, totalItems: 0, isRunning: false, isSubmitted: false, currentIndex: 0, answers: [] }),
}));
