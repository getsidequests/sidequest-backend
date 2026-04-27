import axios from "axios";

/* Search single place */
async function fetchPlace(query) {
  try {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query,
          key: process.env.GOOGLE_MAPS_KEY,
        },
        timeout: 8000,
      }
    );

    const place = res?.data?.results?.[0];

    if (!place) return {};

    return {
      address: place.formatted_address || "",
      lat: place.geometry?.location?.lat || null,
      lng: place.geometry?.location?.lng || null,
      rating: place.rating || null,
      total_reviews: place.user_ratings_total || 0,
      maps_place_id: place.place_id || "",
    };
  } catch {
    return {};
  }
}

/* Enrich itinerary */
export async function fetchPlaces(quest) {
  if (!quest?.itinerary?.length) {
    return quest;
  }

  const updated = await Promise.all(
    quest.itinerary.map(async (stop) => ({
      ...stop,
      ...(await fetchPlace(stop.maps_query)),
    }))
  );

  return {
    ...quest,
    itinerary: updated,
  };
}