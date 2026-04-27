import { db } from "../db/firebase.js";

/* generate itineraries */
import { generateItinerary } from "../ai/generateItinerary.js";

/* fetch itinerary images */
import { fetchImages } from "../ai/fetchImages.js";

/* fetch itinerary location */
import { fetchPlaces } from "../ai/fetchPlaces.js";

/* update quest doc */
import { updateQuest } from "../services/updateQuest.js";

/* normalize and validate input data */
import { normalizeInput } from "../utils/normalizeInput.js";
import { validateInput } from "../utils/validateInput.js";

export async function processQuestJob(event) {
  const startedAt = Date.now();

  /* created quest doc ID*/
  const questId = event.params.questId;

  try {
    console.log("processQuestJob start");
    console.log("questId:", questId);
    console.log(
      "timestamp :",
      new Date().toISOString()
    );

    /* extract doc */
    const doc = event.data;

    if (!doc) {
      console.log("No document found");
      return;
    }

    const quest = doc.data();

    if (!quest) {
      console.log("No quest data");
      return;
    }

    /* Extract Body */
    const raw =
    quest.requestParameters || {};

    const body =
    normalizeInput(raw);

    const error =
    validateInput(body);

    if (error) {
    throw new Error(error);
    }

    /* Mark processing */
    await db.collection("quests")
    .doc(questId)
    .update({
        status: "PROCESSING",
        updatedAt: new Date(),
    })


    /* Gemini */
    const aiData =
      await generateItinerary(body);

    console.log(
      "generateItinerary success"
    );

    /* Parallel images + location */
    const [withImages, withPlaces] =
      await Promise.all([
        fetchImages(aiData),
        fetchPlaces(aiData),
      ]);

    console.log(
      "images + places success"
    );

    /* Final merged data */
    const finalData = {
        ...aiData,
        itinerary:
            aiData.itinerary.map(
            (stop, index) => ({
                ...stop,
                ...(withImages.itinerary?.[index] || {}),
                ...(withPlaces.itinerary?.[index] || {}),
            })
            ),
    };

    /* Update quest */
    await updateQuest(
      questId,
      finalData
    );

    console.log(
      "quest marked COMPLETED"
    );

    console.log(
      "processQuestJob success"
    );

    console.log(
      "time taken (ms):",
      Date.now() - startedAt
    );

  } catch (error) {
    console.error(
      "processQuestJob failed"
    );

    console.error(
      "message:",
      error.message
    );

    await db
      .collection("quests")
      .doc(questId)
      .update({
        status: "FAILED",
        error: error.message,
        updatedAt: new Date(),
      });

    console.log(
      "time taken (ms):",
      Date.now() - startedAt
    );
  }
}