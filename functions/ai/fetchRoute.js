import axios from "axios";

export async function fetchRoute(stops) {
  console.log("fetchRoute started");

  /* validate stops */
  if (!stops || stops.length < 2) {
    console.log("fetchRoute skipped: less than 2 stops");

    return {
      full_route: {},
      legs: [],
      route_summary: [],
    };
  }

  try {
    console.log("total stops:", stops.length);

    /* convert stop → Google point */
    const makePoint = (stop) => ({
      location: {
        latLng: {
          latitude: Number(stop.lat),

          longitude: Number(stop.lng),
        },
      },
    });

    /* first stop */
    const origin = makePoint(stops[0]);

    /* last stop */
    const destination = makePoint(stops[stops.length - 1]);

    /* middle stops */
    const intermediates = stops.slice(1, -1).map(makePoint);

    console.log("calling Google Routes API...");

    /* Main route request */
    const res = await axios.post(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        origin,
        destination,
        intermediates,

        travelMode: "DRIVE",

        routingPreference: "TRAFFIC_AWARE",
      },
      {
        headers: {
          "Content-Type": "application/json",

          "X-Goog-Api-Key": process.env.GOOGLE_MAPS_KEY,

          "X-Goog-FieldMask":
            "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs",
        },

        timeout: 10000,
      },
    );

    console.log("Google Routes success");

    const route = res.data.routes?.[0];

    /* FULL ROUTE */
    const full_route = {
      distance_meters: route.distanceMeters || 0,

      duration: route.duration || "",

      polyline: route.polyline?.encodedPolyline || "",

      travel_mode: "DRIVE",
    };

    console.log("full route ready");

    /* LEG WISE ROUTES */
    const legs = (route.legs || []).map((leg, index) => ({
      from: stops[index]?.place_name || `Stop ${index + 1}`,

      to: stops[index + 1]?.place_name || `Stop ${index + 2}`,

      distance_meters: leg.distanceMeters || 0,

      duration: leg.duration || "",

      polyline: leg.polyline?.encodedPolyline || "",
    }));

    console.log("legs created:", legs.length);

    /* Ordered stop list */
    const route_summary = stops.map((stop, index) => ({
      stop_number: index + 1,

      place_name: stop.place_name || "",

      lat: Number(stop.lat) || 0,

      lng: Number(stop.lng) || 0,
    }));

    console.log("route summary ready");

    console.log("fetchRoute completed");

    return {
      full_route,
      legs,
      route_summary,
    };
  } catch (error) {
    console.error("fetchRoute failed");

    console.error("message:", error?.message || error);

    return {
      full_route: {},
      legs: [],
      route_summary: [],
    };
  }
}
