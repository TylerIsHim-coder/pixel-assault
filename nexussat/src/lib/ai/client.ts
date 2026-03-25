import Anthropic from "@anthropic-ai/sdk";

// Singleton — server-side only
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
