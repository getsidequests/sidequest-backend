import { GoogleGenAI } from "@google/genai";
import { defineSecret } from "firebase-functions/params";

const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

export async function generateContent(prompt) {
  const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY.value(),
  });

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: prompt,
  });

  return response.text;
}
