import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2/options";
import { defineSecret } from "firebase-functions/params";

import { generateQuestHandler } from "./handlers/generateQuest.js";

const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

setGlobalOptions({
  region: "asia-south1",
  maxInstances: 10
});


export const generateQuest = onRequest(
  {
    timeoutSeconds: 60,
    secrets: [GEMINI_API_KEY]
  },
  generateQuestHandler
);