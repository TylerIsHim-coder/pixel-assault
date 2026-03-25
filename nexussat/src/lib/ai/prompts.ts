// All prompt templates for NexusSAT
// Each function returns a structured message array ready for the Anthropic SDK.

import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";

// ─── Note Generation ────────────────────────────────────────────────────────

export function buildNotePrompt(topic: string): MessageParam[] {
  return [
    {
      role: "user",
      content: `You are an expert SAT tutor creating concise, student-friendly study notes.

Generate structured Markdown study notes for the following SAT topic:

**Topic:** ${topic}

Requirements:
- Start with a one-sentence definition or summary (no heading needed)
- Use H2 (##) for main sections: Key Concepts, Formulas/Rules, Common Mistakes, Quick Tips
- Use bullet points and numbered lists generously — avoid dense paragraphs
- Include 1–2 concrete worked examples with step-by-step solutions where applicable
- Keep the tone direct and actionable ("You should...", "Always check...")
- End with a "### Practice Prompt" section: one SAT-style question (no answer) the student can try
- Total length: 300–500 words of actual content
- Output ONLY the Markdown — no preamble, no code fences around the whole response`,
    },
  ];
}

// ─── Answer Explanation ──────────────────────────────────────────────────────

export function buildExplanationPrompt(
  questionStem: string,
  choices: { id: string; text: string }[],
  correctId: string,
  studentChoiceId: string | null
): MessageParam[] {
  const choicesText = choices.map((c) => `(${c.id}) ${c.text}`).join("\n");
  const correct     = choices.find((c) => c.id === correctId);
  const studentChoice = choices.find((c) => c.id === studentChoiceId) ?? null;

  return [
    {
      role: "user",
      content: `You are an SAT tutor explaining a practice question to a student.

**Question:**
${questionStem}

**Answer Choices:**
${choicesText}

**Correct Answer:** (${correctId}) ${correct?.text ?? ""}
${studentChoice ? `**Student's Answer:** (${studentChoiceId}) ${studentChoice.text}` : "**Student's Answer:** (skipped)"}

Write a clear explanation in Markdown:
1. State whether the student was correct or not (one sentence)
2. **Why the correct answer is right** — explain the concept or rule being tested
3. **Why the incorrect choices are wrong** — briefly address each wrong option
4. **Key takeaway** — one actionable tip to remember for similar questions

Keep it under 200 words. Output only the Markdown.`,
    },
  ];
}
