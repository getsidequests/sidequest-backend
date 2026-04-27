export function parseJson(raw = "") {
  const text = String(raw || "").trim();

  if (!text) {
    throw new Error("Empty AI response");
  }

  try {
    return JSON.parse(text);
  } catch (error) {
  console.log("parse attempt 1 failed");
}

  try {
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
  console.log("parse attempt 2 failed");
}

  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start !== -1 && end !== -1 && end > start) {
      const sliced =
        text.slice(start, end + 1);

      return JSON.parse(sliced);
    }
  } catch (error) {
  console.log("parse attempt 3 failed");
}

  console.error(raw);
  throw new Error("Invalid AI JSON");
}