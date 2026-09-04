import { beforeEach, describe, expect, it, vi } from "vitest";

// Server-module mocks: these tests exercise the action logic (what gets
// written) without a database or request context.
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/auth", () => ({
  requireUser: vi.fn(async () => ({ id: "user-1", email: "t@t.local" })),
}));

const problem = {
  findFirstOrThrow: vi.fn(),
  update: vi.fn(),
  updateMany: vi.fn(),
};
const sdTopic = {
  findFirstOrThrow: vi.fn(),
  update: vi.fn(),
  updateMany: vi.fn(),
};
const resource = { deleteMany: vi.fn() };
const task = { findFirstOrThrow: vi.fn(), update: vi.fn(), updateMany: vi.fn() };
vi.mock("@/lib/db", () => ({
  db: {
    get problem() {
      return problem;
    },
    get sdTopic() {
      return sdTopic;
    },
    get resource() {
      return resource;
    },
    get task() {
      return task;
    },
  },
}));

import {
  cycleProblemStatus,
  cycleSdTopicStatus,
  deleteResource,
  reviewItem,
} from "@/lib/actions";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("cycleProblemStatus", () => {
  it("completing a fresh problem schedules the initial 3-day review", async () => {
    problem.findFirstOrThrow.mockResolvedValue({
      status: "in_progress",
      reviewInterval: 0,
      firstAttempt: new Date("2026-09-01"),
    });
    await cycleProblemStatus("p1");
    const data = problem.update.mock.calls[0][0].data;
    expect(data.status).toBe("complete");
    expect(data.reviewInterval).toBe(3);
    expect(data.nextReviewAt).toBeInstanceOf(Date);
    expect(data.lastReviewed).toBeInstanceOf(Date);
    expect(data.attemptCount).toEqual({ increment: 1 });
  });

  it("only completion counts as an attempt; starting work does not", async () => {
    problem.findFirstOrThrow.mockResolvedValue({
      status: "not_started",
      reviewInterval: 0,
      firstAttempt: null,
    });
    await cycleProblemStatus("p1");
    expect(problem.update.mock.calls[0][0].data).not.toHaveProperty(
      "attemptCount"
    );
  });

  it("re-completing resumes the earned interval instead of resetting (the mis-tap bug)", async () => {
    problem.findFirstOrThrow.mockResolvedValue({
      status: "in_progress",
      reviewInterval: 30,
      firstAttempt: new Date("2026-08-01"),
    });
    await cycleProblemStatus("p1");
    expect(problem.update.mock.calls[0][0].data.reviewInterval).toBe(30);
  });

  it("un-completing clears the queue entry but preserves the ladder position", async () => {
    problem.findFirstOrThrow.mockResolvedValue({
      status: "complete",
      reviewInterval: 30,
      firstAttempt: new Date("2026-08-01"),
    });
    await cycleProblemStatus("p1");
    const data = problem.update.mock.calls[0][0].data;
    expect(data.status).toBe("not_started");
    expect(data.nextReviewAt).toBeNull();
    expect(data).not.toHaveProperty("reviewInterval");
  });

  it("stamps firstAttempt only on the first touch", async () => {
    problem.findFirstOrThrow.mockResolvedValue({
      status: "not_started",
      reviewInterval: 0,
      firstAttempt: null,
    });
    await cycleProblemStatus("p1");
    expect(
      problem.update.mock.calls[0][0].data.firstAttempt
    ).toBeInstanceOf(Date);

    const existing = new Date("2026-08-15");
    problem.findFirstOrThrow.mockResolvedValue({
      status: "in_progress",
      reviewInterval: 0,
      firstAttempt: existing,
    });
    await cycleProblemStatus("p1");
    expect(problem.update.mock.calls[1][0].data.firstAttempt).toBe(existing);
  });
});

describe("cycleSdTopicStatus", () => {
  it("completing schedules the 7-day initial review and un-completing preserves it", async () => {
    sdTopic.findFirstOrThrow.mockResolvedValue({
      status: "in_progress",
      reviewInterval: 0,
    });
    await cycleSdTopicStatus("t1");
    expect(sdTopic.update.mock.calls[0][0].data.reviewInterval).toBe(7);

    sdTopic.findFirstOrThrow.mockResolvedValue({
      status: "complete",
      reviewInterval: 14,
    });
    await cycleSdTopicStatus("t1");
    const data = sdTopic.update.mock.calls[1][0].data;
    expect(data.nextReviewAt).toBeNull();
    expect(data).not.toHaveProperty("reviewInterval");
  });
});

describe("reviewItem", () => {
  it("steps a problem up the ladder, stamps lastReviewed, and counts the attempt", async () => {
    problem.findFirstOrThrow.mockResolvedValue({ reviewInterval: 3 });
    await reviewItem("problem", "p1", "good");
    const data = problem.update.mock.calls[0][0].data;
    expect(data.reviewInterval).toBe(7);
    expect(data.lastReviewed).toBeInstanceOf(Date);
    expect(data.attemptCount).toEqual({ increment: 1 });
  });

  it("scopes the read to the signed-in user", async () => {
    sdTopic.findFirstOrThrow.mockResolvedValue({ reviewInterval: 0 });
    await reviewItem("sdTopic", "t1", "again");
    expect(sdTopic.findFirstOrThrow).toHaveBeenCalledWith({
      where: { id: "t1", userId: "user-1" },
    });
    expect(sdTopic.update.mock.calls[0][0].data.reviewInterval).toBe(1);
  });
});

describe("deleteResource", () => {
  it("deletes only the signed-in user's row", async () => {
    await deleteResource("r1");
    expect(resource.deleteMany).toHaveBeenCalledWith({
      where: { id: "r1", userId: "user-1" },
    });
  });
});
