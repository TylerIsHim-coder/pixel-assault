import { anthropic } from "./client";
import { buildNotePrompt } from "./prompts";

interface GenerateResult {
  title: string;
  content: string;
}

export async function generateNotes(topic: string): Promise<GenerateResult> {
  const messages = buildNotePrompt(topic);

  const response = await anthropic.messages.create({
    model:      "claude-sonnet-4-6",
    max_tokens: 1500,
    messages,
  });

  const raw = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("\n");

  // Derive a title from the topic (capitalize each word, strip special chars)
  const title = topic
    .replace(/[^a-zA-Z0-9\s&]/g, "")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .trim() || "SAT Study Notes";

  return { title, content: raw };
}

export async function generateExplanation(
  questionStem: string,
  choices: { id: string; text: string }[],
  correctId: string,
  studentChoiceId: string | null
): Promise<string> {
  const { buildExplanationPrompt } = await import("./prompts");
  const messages = buildExplanationPrompt(questionStem, choices, correctId, studentChoiceId);

  const response = await anthropic.messages.create({
    model:      "claude-sonnet-4-6",
    max_tokens: 600,
    messages,
  });

  return response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("\n");
}
