import { db } from "../db/firebase.js";

/* update quest doc */
export async function updateQuest(
  questId,
  aiData
) {
  return db
    .collection("quests")
    .doc(questId)
    .update({
      status: "COMPLETED",

      itinerary:
        aiData.itinerary || [],

      updatedAt:
        new Date(),
    });
}