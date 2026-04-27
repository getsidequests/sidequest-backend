import { db } from "../db/firebase.js";

/* generate plan */
import { generatePlan } from "../ai/generatePlan.js";

/* generate route */
import { fetchRoute } from "../ai/fetchRoute.js";

/* update plan doc */
import { updatePlan } from "../services/updatePlan.js";

/* normalize and validate input data */
import { normalizeInput } from "../utils/normalizeInput.js";
import { validateInput } from "../utils/validateInput.js";

export async function processPlanJob(event) {
  const startedAt = Date.now();

  /* created plan doc ID*/
  const planId = event.params.planId;

  try {
    console.log("processPlanJob start");
    console.log("planId:", planId);
    console.log("timestamp :", new Date().toISOString());

    /* extract doc */
    const doc = event.data;

    if (!doc) {
      console.log("No document found");
      return;
    }

    const plan = doc.data();

    if (!plan) {
      console.log("No plan data");
      return;
    }

    /* Extract Body */
    const raw = plan.requestParameters || {};

    const body = normalizeInput(raw);

    const error = validateInput(body);

    if (error) {
      throw new Error(error);
    }

    /* Mark processing */
    await db.collection("plan").doc(planId).update({
      status: "PROCESSING",
      updatedAt: new Date(),
    });

    console.log("plan marked PROCESSING");

    /* selected itineraries */
    const selected = Array.isArray( plan.selectedItineraries ) ? plan.selectedItineraries : [];

    /* Gemini - generate plan */
    const generatedPlan = await generatePlan({
      ...body,
      itinerary: selected,
    });

    console.log("generatePlan success");

    /* route */
    const route = await fetchRoute( generatedPlan.itinerary?.length ? generatedPlan.itinerary : selected );

    console.log("route success");

    /* Final merged data */
    const finalData = {
      ...generatedPlan,

      full_route: route.full_route,

      legs: route.legs,

      route_summary: route.route_summary,

      status: "COMPLETED",

      updatedAt: new Date(),
    };

    /* Update plan */
    await updatePlan( planId, finalData );

    console.log("plan marked COMPLETED");

    console.log("processPlanJob success");

    console.log("time taken (ms):", Date.now() - startedAt);

    return;
  } catch (error) {
    console.error("processPlanJob failed");

    console.error( "message:", error?.message || error );

    await db.collection("plan").doc(planId).update({
      status: "FAILED",
      error: error.message,
      updatedAt: new Date(),
    });

    console.log("time taken (ms):", Date.now() - startedAt);
  }

  return;
}
