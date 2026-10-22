// Shared by draft/media/release validation. A playable ID is not an adoption.
export function videoReviewErrors(video, gameId, ledger, analysis, guideRoute) {
  const errors = [];
  if (!video.title?.trim() || !video.description?.trim())
    errors.push("video title and task-specific description required");
  const entry = ledger.find(
    (m) =>
      m.videoId === video.videoId &&
      (gameId
        ? m.subjectGameId === gameId
        : guideRoute && m.subjectGameId && m.usedOn?.includes(guideRoute)),
  );
  if (
    !entry ||
    entry.status !== "adopted" ||
    entry.rightsStatus !== "approved" ||
    entry.embedStatus !== "verified" ||
    entry.ageRestrictionStatus !== "clear"
  )
    errors.push(
      "approved, embeddable, age-clear adoption for this game required",
    );
  const review = analysis.find(
    (v) =>
      v.videoId === video.videoId &&
      v.gameId === (gameId || entry?.subjectGameId),
  );
  if (
    !review ||
    review.identity !== "exact-game" ||
    review.versionCompatibility !== "verified"
  )
    errors.push("exact-game current-version review required");
  if (!entry?.reviewedRangeIds?.length)
    errors.push("reviewed segment IDs required");
  for (const id of entry?.reviewedRangeIds || []) {
    const segment = review?.segments?.find((s) => s.id === id);
    if (
      !segment ||
      ![
        "range",
        "state",
        "action",
        "visibleResult",
        "successOrFailureReason",
        "versionScope",
      ].every(
        (key) => typeof segment[key] === "string" && segment[key].trim(),
      ) ||
      !Array.isArray(segment.supports) ||
      !segment.supports.length ||
      !Array.isArray(segment.doesNotSupport)
    )
      errors.push("incomplete or missing reviewed segment " + id);
  }
  return errors;
}
