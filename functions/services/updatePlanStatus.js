import { db } from "../db/firebase.js";

export async function updatePlanStatus(
  planId,
  status
) {
  return db
    .collection("plan")
    .doc(planId)
    .update({
      status: "PROCESSING",
      updatedAt: new Date(),
    });
}