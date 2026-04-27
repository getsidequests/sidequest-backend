import { db } from "../db/firebase.js";

/* update final plan doc */
export async function updatePlan(
  planId,
  aiData
) {

  try {

    console.log("updatePlan start");
    console.log("planId:", planId);

    await db.collection("plan").doc(planId).update({
      
        /* status */
        status: "COMPLETED",

        /* main content */
        quest_title:
          aiData.quest_title || "",

        theme:
          aiData.theme || "",

        location:
          aiData.location || {},

        travel_mode:
          aiData.travel_mode || "",

        /* selected ordered route cards */
        route_summary:
          Array.isArray(
            aiData.route_summary
          )
            ? aiData.route_summary
            : [],

        /* full route for maps */
        fullRoute:
          aiData.full_route || {},

        /* optional legs */
        legs:
          Array.isArray(aiData.legs)
            ? aiData.legs
            : [],

        /* time / cost */
        travel_summary_time:
          String(
            aiData
              ?.travel_summary_time ||
              ""
          ),

        cost_estimate:
          String(
            aiData
              ?.cost_estimate ||
              ""
          ),

        /* extras */
        experience_enhancers:
          Array.isArray(
            aiData
              ?.experience_enhancers
          )
            ? aiData
                .experience_enhancers
            : [],

        /* final itinerary */
        itinerary:
          Array.isArray(
            aiData.itinerary
          )
            ? aiData.itinerary
            : [],

        closing_note:
          aiData.closing_note || "",

        updatedAt:
          new Date(),
      });

    console.log(
      "updatePlan success"
    );

    return true;
  } catch (error) {
    console.error(
      "updatePlan failed:",
      error?.message || error
    );

    throw error;
  }

}