import { askGemini } from "./gemini.js";
import { buildPrompt } from "../prompts/generateItineraryPrompt.js";
import { parseJson } from "../utils/parseJson.js";

export async function generateItinerary(input) {

  try {
    console.log( "generateItinerary called");
    console.log("time:", new Date().toISOString());
    console.log( "input:", input || {} );

    /* build prompt */
    const prompt = buildPrompt(input);

    /* call Gemini */
    const raw = await askGemini(prompt);

    if (!raw) {
      throw new Error("Empty Gemini response");
    }

    console.log( "Gemini response received");


    const parsed = parseJson(raw);

    if (!parsed?.itinerary || !Array.isArray(parsed.itinerary)) {
      throw new Error("Invalid itinerary");
    }

    console.log("generateItinerary success");

    return parsed;

  } catch (err) {
    console.error(
  "generateItinerary failed:", err.message );

    throw new Error(`generateItinerary failed: ${err.message}`);
  }
}