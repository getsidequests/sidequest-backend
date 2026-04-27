import { GoogleGenAI } from "@google/genai";

/* Reusable singleton */
let client = null;


/* Create client once */
function getClient() {
  if (client) return client;

  const apiKey = String(process.env.GEMINI_API_KEY || "").trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY missing");
  }

  client = new GoogleGenAI({ apiKey });

  return client;
}


/* Main reusable AI caller */
export async function askGemini(prompt) {
  try {
    const ai = getClient();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response?.text || "";

    if (!text) {
      throw new Error("Empty AI response");
    }

    return text;
  } catch (error) {
    console.error("askGemini failed:", error.message);

    throw error;
  }
}
