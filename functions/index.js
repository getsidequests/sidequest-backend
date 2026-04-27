/* Firebase Functions */
import { setGlobalOptions } from "firebase-functions/v2/options";
import { defineSecret } from "firebase-functions/params";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

/* trigger */
import { processQuestJob } from "./jobs/processQuestJob.js";
import { processPlanJob } from "./jobs/processPlanJob.js";


/* Secrets */
const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");
const PEXELS_API_KEY = defineSecret("PEXELS_API_KEY");
const GOOGLE_MAPS_KEY = defineSecret("GOOGLE_MAPS_KEY");


/* Global config */
setGlobalOptions({
  region: "asia-south1",
  maxInstances: 20,
});

console.log("INIT", {
  time: new Date().toISOString()
});

/* firebase trigger */
/* Step - 1 : Get list of itineraries trigger (quest doc created) */
export const processQuestCreated =
  onDocumentCreated(
    {
      document: "quests/{questId}",
      timeoutSeconds: 540,
      secrets: [
        GEMINI_API_KEY,
        PEXELS_API_KEY,
        GOOGLE_MAPS_KEY,
      ],
    },
    processQuestJob
  );

/* Step - 2 : Get final optimized plan trigger (plan doc created) */
export const processPlanCreated =
  onDocumentCreated(
    {
      document: "plan/{planId}",
      timeoutSeconds: 540,
      secrets: [
        GEMINI_API_KEY,
        PEXELS_API_KEY,
        GOOGLE_MAPS_KEY,
      ],
    },
    processPlanJob
  );