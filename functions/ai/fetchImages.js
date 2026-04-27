import axios from "axios";

/* Search single image */
async function fetchImage(query) {
  try {
    console.log("fetch image start");
    console.log("query :", query);
    console.log(
      "PEXELS_KEY:",
      !!process.env.PEXELS_API_KEY
    );

    const startedAt =
      Date.now();

    const res =
      await axios.get(
        "https://api.pexels.com/v1/search",
        {
          params: {
            query,
            per_page: 1,
          },
          headers: {
            Authorization:
              process.env.PEXELS_API_KEY,
          },
          timeout: 8000,
        }
      );

    const url =
      res?.data?.photos?.[0]?.src
        ?.large || "";

    console.log(
      "FETCH_IMAGE_DONE"
    );
    console.log(
      "RESULTS_COUNT:",
      res?.data?.photos
        ?.length || 0
    );
    console.log(
      "IMAGE_URL:",
      url || "NO_IMAGE"
    );
    console.log(
      "MS:",
      Date.now() -
        startedAt
    );

    return url;

  } catch (err) {
    console.error(
      "FETCH_IMAGE_FAILED"
    );
    console.error(
      "QUERY:",
      query
    );
    console.error(
      "MESSAGE:",
      err.message
    );
    console.error(
      "PEXELS_RESPONSE:",
      err?.response?.data ||
        "NO_RESPONSE"
    );

    return "";
  }
}

/* Smart fallback */
async function getBestImage(
  stop,
  city
) {
  console.log(
    "GET_BEST_IMAGE_START"
  );
  console.log(
    "PLACE:",
    stop.place_name
  );
  console.log(
    "CITY:",
    city
  );

  const q1 =
    stop.image_query;

  const q2 =
    `${stop.place_name} ${city}`;

  const q3 =
    `${city} tourism landmark`;

  console.log(
    "TRY_QUERY_1:",
    q1
  );

  let image =
    await fetchImage(q1);

  if (image) {
    console.log(
      "SUCCESS_QUERY_1"
    );
    return image;
  }

  console.log(
    "TRY_QUERY_2:",
    q2
  );

  image =
    await fetchImage(q2);

  if (image) {
    console.log(
      "SUCCESS_QUERY_2"
    );
    return image;
  }

  console.log(
    "TRY_QUERY_3:",
    q3
  );

  image =
    await fetchImage(q3);

  if (image) {
    console.log(
      "SUCCESS_QUERY_3"
    );
    return image;
  }

  console.log(
    "NO_IMAGE_FOUND"
  );

  return "";
}

/* Update itinerary */
export async function fetchImages(
  quest
) {
  try {
    console.log(
      "FETCH_IMAGES_START"
    );
    console.log(
      "ITINERARY_COUNT:",
      quest?.itinerary
        ?.length || 0
    );

    if (
      !quest?.itinerary
        ?.length
    ) {
      console.log(
        "NO_ITINERARY_EXIT"
      );
      return quest;
    }

    const updated =
      await Promise.all(
        quest.itinerary.map(
          async (stop) => {
            console.log(
              "PROCESSING_STOP:",
              stop.place_name
            );

            const image_url =
              await getBestImage(
                stop,
                quest?.location
                  ?.city || ""
              );

            console.log(
              "FINAL_IMAGE:",
              stop.place_name,
              image_url ||
                "EMPTY"
            );

            return {
              ...stop,
              image_url,
            };
          }
        )
      );

    console.log(
      "FETCH_IMAGES_SUCCESS"
    );

    return {
      ...quest,
      itinerary: updated,
    };

  } catch (err) {
    console.error(
      "FETCH_IMAGES_FAILED"
    );
    console.error(
      err.message
    );

    return quest;
  }
}