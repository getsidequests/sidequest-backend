import { buildPrompt } from "../services/prompt.js";
import { buildEvaluatorPrompt } from "../services/evaluator.js";
import { buildPolisherPrompt } from "../services/polisher.js";
import { generateContent } from "../services/gemini.js";

export async function generateQuest(req, res) {
  try {
    const {
      city,
      budget,
      experienceType,
      startTime,
      endTime,
      startDate,
      startDay,
      stopsDay,
      travelMode,
      areaPreference,
      foodPreference,
      experienceFlow
    } = req.body;

    if (!city || !budget || !startTime) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }

    const prompt = buildPrompt({
      city,
      budget,
      experienceType: experienceType || "date night",
      startTime,
      endTime: endTime || "flexible",
      startDate: startDate || "",
      startDay: startDay || "",
      stopsDay: stopsDay || 5,
      travelMode: travelMode || "cab + walking",
      areaPreference: areaPreference || "",
      foodPreference: foodPreference || "local cuisine",
      experienceFlow: experienceFlow || "flexible"
    });

    const generated = await generateContent(prompt);

    const evalPrompt = buildEvaluatorPrompt(city, generated);
    const evaluation = await generateContent(evalPrompt);

    const improvedPrompt = `
Fix and improve the itinerary using the feedback below.

ITINERARY:
${generated}

FEEDBACK:
${evaluation}
`;

    const improved = await generateContent(improvedPrompt);

    const polishPrompt = buildPolisherPrompt(improved);
    const polished = await generateContent(polishPrompt);

    return res.json({
      success: true,
      data: {
        generated,
        evaluation,
        improved,
        polished
      }
    });

  } catch (error) {
    console.error("Controller Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Controller failed"
    });
  }
}