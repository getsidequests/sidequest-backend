export function normalizeInput(data = {}) {
  return {

    /* city.fullText */
    city: String(
      data.city?.fullText ||
      data.city?.city ||
      data.city ||
      ""
    ).trim(),

    budget: String(
      data.budget || ""
    ).trim(),

    experienceType: Array.isArray(data.experienceType)
      ? data.experienceType
          .map(v => String(v).trim())
          .filter(Boolean)
      : data.experienceType
        ? [String(data.experienceType).trim()]
        : [],

    /* duration */
    duration: String(
      data.duration?.duration
        ? `${data.duration.duration} ${data.duration.metric || ""}`
        : data.duration || ""
    ).trim(),

    /* startHour:startMinutes amOrPm */
    startTime: String(
      data.startTime?.startHour
        ? `${data.startTime.startHour}:${data.startTime.startMinutes || "00"} ${data.startTime.amOrPm || ""}`
        : data.startTime || ""
    ).trim(),

    itinerary: Array.isArray(data.itinerary)
      ? data.itinerary
      : [],
  };
}