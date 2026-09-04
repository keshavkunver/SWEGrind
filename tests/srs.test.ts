import { describe, expect, it } from "vitest";
import {
  NEXT_STATUS,
  REVIEW_LADDER,
  daysFromNow,
  nextIntervalDays,
  resumeReview,
} from "@/lib/srs";

describe("status cycle", () => {
  it("cycles not_started -> in_progress -> complete -> not_started", () => {
    expect(NEXT_STATUS.not_started).toBe("in_progress");
    expect(NEXT_STATUS.in_progress).toBe("complete");
    expect(NEXT_STATUS.complete).toBe("not_started");
  });
});

describe("daysFromNow", () => {
  it("returns local midnight of the target day", () => {
    const d = daysFromNow(3);
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
    const expected = new Date();
    expected.setDate(expected.getDate() + 3);
    expect(d.getFullYear()).toBe(expected.getFullYear());
    expect(d.getMonth()).toBe(expected.getMonth());
    expect(d.getDate()).toBe(expected.getDate());
  });
});

describe("resumeReview", () => {
  it("uses the initial interval for a fresh item", () => {
    expect(resumeReview(0, 3).reviewInterval).toBe(3);
    expect(resumeReview(0, 7).reviewInterval).toBe(7);
  });

  it("resumes the stored interval after an un-complete round trip (the mis-tap bug)", () => {
    // A problem reviewed up to 30 days that is un-completed and re-completed
    // must NOT reset to the initial 3 days.
    expect(resumeReview(30, 3).reviewInterval).toBe(30);
    expect(resumeReview(60, 7).reviewInterval).toBe(60);
  });

  it("schedules nextReviewAt exactly reviewInterval days out", () => {
    const { nextReviewAt, reviewInterval } = resumeReview(14, 3);
    expect(nextReviewAt.getTime()).toBe(daysFromNow(reviewInterval).getTime());
  });
});

describe("nextIntervalDays (Again/Good/Easy ladder)", () => {
  it("'again' always restarts at the bottom", () => {
    expect(nextIntervalDays(0, "again")).toBe(1);
    expect(nextIntervalDays(30, "again")).toBe(1);
    expect(nextIntervalDays(60, "again")).toBe(1);
  });

  it("'good' steps to the next rung above the current interval", () => {
    expect(nextIntervalDays(0, "good")).toBe(1);
    expect(nextIntervalDays(1, "good")).toBe(3);
    expect(nextIntervalDays(3, "good")).toBe(7);
    expect(nextIntervalDays(7, "good")).toBe(14);
    expect(nextIntervalDays(14, "good")).toBe(30);
    expect(nextIntervalDays(30, "good")).toBe(60);
  });

  it("'easy' skips one rung", () => {
    expect(nextIntervalDays(1, "easy")).toBe(7);
    expect(nextIntervalDays(7, "easy")).toBe(30);
  });

  it("caps at the top of the ladder", () => {
    const top = REVIEW_LADDER[REVIEW_LADDER.length - 1];
    expect(nextIntervalDays(60, "good")).toBe(top);
    expect(nextIntervalDays(60, "easy")).toBe(top);
    expect(nextIntervalDays(999, "good")).toBe(top);
  });

  it("handles an interval between rungs (legacy/manual data)", () => {
    expect(nextIntervalDays(5, "good")).toBe(7);
  });
});
