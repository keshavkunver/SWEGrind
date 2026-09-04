// Pure spaced-repetition and status logic, kept out of the "use server"
// actions module so it can be unit tested directly.

export type ReviewKind = "problem" | "sdTopic";
export type ReviewRating = "again" | "good" | "easy";

export const NEXT_STATUS: Record<string, string> = {
  not_started: "in_progress",
  in_progress: "complete",
  complete: "not_started",
};

// Interval ladder in days. "Again" restarts, "Good" moves one step past the
// current interval, "Easy" skips a step.
export const REVIEW_LADDER = [1, 3, 7, 14, 30, 60];

export function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Completing an item schedules its next spaced review. A previously built
// ladder position survives an un-complete/re-complete round trip: resume at
// the stored interval rather than resetting to the initial one.
export function resumeReview(storedInterval: number, initialDays: number) {
  const days = storedInterval > 0 ? storedInterval : initialDays;
  return { nextReviewAt: daysFromNow(days), reviewInterval: days };
}

export function nextIntervalDays(
  current: number,
  rating: ReviewRating
): number {
  if (rating === "again") return REVIEW_LADDER[0];
  let idx = REVIEW_LADDER.findIndex((d) => d > current);
  if (idx === -1) idx = REVIEW_LADDER.length - 1;
  if (rating === "easy") idx += 1;
  return REVIEW_LADDER[Math.min(idx, REVIEW_LADDER.length - 1)];
}
