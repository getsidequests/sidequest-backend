import { askGemini } from "./gemini.js";
import { buildPrompt } from "../prompts/generatePlanPrompt.js";
import { parseJson } from "../utils/parseJson.js";

export async function generatePlan(input) {
  try {
    const prompt =
      buildPrompt(input);

    const raw =
      await askGemini(prompt);

    if (!raw) {
      throw new Error(
        "Empty Gemini response"
      );
    }

    return parseJson(raw);

  } catch (err) {
    throw new Error(
      `generatePlan failed: ${err.message}`
    );
  }
}