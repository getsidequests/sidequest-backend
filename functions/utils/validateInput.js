export function validateInput(data = {}) {
  const jobType = "ITINERARY";


  if (!data.city) {
    return "City is required";
  }

  if (!data.budget) {
    return "Budget is required";
  }

  /* PLAN MODE */
  if (jobType === "PLAN") {
    if (
      !Array.isArray(data.itinerary) ||
      data.itinerary.length === 0
    ) {
      return "Selected itinerary is required";
    }

    if (!data.jobId) {
      return "jobId is required";
    }

    return null;
  }

  /* ITINERARY MODE */
  if (
    !Array.isArray(data.experienceType) ||
    data.experienceType.length === 0
  ) {
    return "Experience type is required";
  }

  if (!data.duration) {
    return "Duration is required";
  }

  return null;
}