"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "./db";
import { requireUser } from "./auth";
import { textareaToLinksJson } from "./links";

// Learner-model actions. The curriculum itself (weeks, tasks, patterns,
// problems, topics, links) is read-only content; these actions only touch
// the learner's own work: statuses, confidence, notes, project tracking.
// Every action resolves the signed-in user and scopes reads/writes by
// userId, so one user can never touch another's rows.
function refresh() {
  revalidatePath("/", "layout");
}

const NEXT_STATUS: Record<string, string> = {
  not_started: "in_progress",
  in_progress: "complete",
  complete: "not_started",
};

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Completing an item schedules its next spaced review. A previously built
// ladder position survives an un-complete/re-complete round trip: resume at
// the stored interval rather than resetting to the initial one.
function resumeReview(storedInterval: number, initialDays: number) {
  const days = storedInterval > 0 ? storedInterval : initialDays;
  return { nextReviewAt: daysFromNow(days), reviewInterval: days };
}

// ---- Roadmap tasks: complete them, write notes ----

export async function cycleTaskStatus(id: string) {
  const user = await requireUser();
  const task = await db.task.findFirstOrThrow({
    where: { id, userId: user.id },
  });
  await db.task.update({
    where: { id },
    data: { status: NEXT_STATUS[task.status] ?? "not_started" },
  });
  refresh();
}

export async function updateTaskNotes(id: string, fd: FormData) {
  const user = await requireUser();
  await db.task.updateMany({
    where: { id, userId: user.id },
    data: { notes: str(fd, "notes") },
  });
  refresh();
}

// ---- Interview patterns & problems ----

// Confidence is a self-assessment; notes are the learner's own study notes.
// Pattern status is derived from problem completion, not stored here.
export async function updatePatternStudy(id: string, fd: FormData) {
  const user = await requireUser();
  await db.pattern.updateMany({
    where: { id, userId: user.id },
    data: {
      notes: str(fd, "notes"),
      confidence: str(fd, "confidence") || "unknown",
    },
  });
  refresh();
}

export async function cycleProblemStatus(id: string) {
  const user = await requireUser();
  const p = await db.problem.findFirstOrThrow({
    where: { id, userId: user.id },
  });
  const status = NEXT_STATUS[p.status] ?? "not_started";
  const completing = status === "complete";
  await db.problem.update({
    where: { id },
    data: {
      status,
      // Stamp firstAttempt the first time work starts on a problem.
      firstAttempt:
        p.firstAttempt ?? (status !== "not_started" ? new Date() : null),
      // Completing schedules the next spaced review; un-completing removes
      // it from the queue but keeps the earned ladder position, so an
      // accidental tap costs nothing.
      ...(completing
        ? { lastReviewed: new Date(), ...resumeReview(p.reviewInterval, 3) }
        : { nextReviewAt: null }),
    },
  });
  refresh();
}

// The learner's own work on a problem: how confident they are, their
// complexity analysis, and their solution notes.
export async function updateProblemWork(id: string, fd: FormData) {
  const user = await requireUser();
  await db.problem.updateMany({
    where: { id, userId: user.id },
    data: {
      confidence: str(fd, "confidence") || "unknown",
      timeComplexity: str(fd, "timeComplexity"),
      spaceComplexity: str(fd, "spaceComplexity"),
      notes: str(fd, "notes"),
    },
  });
  refresh();
}

// ---- System design topics: study them, write notes ----

export async function cycleSdTopicStatus(id: string) {
  const user = await requireUser();
  const t = await db.sdTopic.findFirstOrThrow({
    where: { id, userId: user.id },
  });
  const status = NEXT_STATUS[t.status] ?? "not_started";
  await db.sdTopic.update({
    where: { id },
    data: {
      status,
      ...(status === "complete"
        ? resumeReview(t.reviewInterval, 7)
        : { nextReviewAt: null }),
    },
  });
  refresh();
}

export async function updateSdTopicNotes(id: string, fd: FormData) {
  const user = await requireUser();
  await db.sdTopic.updateMany({
    where: { id, userId: user.id },
    data: { notes: str(fd, "notes") },
  });
  refresh();
}

// ---- Project milestones: the learner's own build work ----

export async function updateMilestone(id: string, fd: FormData) {
  const user = await requireUser();
  await db.milestone.updateMany({
    where: { id, userId: user.id },
    data: {
      status: str(fd, "status") || "not_started",
      notes: str(fd, "notes"),
      links: textareaToLinksJson(str(fd, "links")),
    },
  });
  refresh();
}

export async function addMilestoneTask(milestoneId: string, fd: FormData) {
  const user = await requireUser();
  const title = str(fd, "title");
  if (!title) return;
  await db.milestone.findFirstOrThrow({
    where: { id: milestoneId, userId: user.id },
  });
  const last = await db.milestoneTask.findFirst({
    where: { milestoneId },
    orderBy: { order: "desc" },
  });
  await db.milestoneTask.create({
    data: {
      userId: user.id,
      milestoneId,
      title,
      order: (last?.order ?? 0) + 1,
    },
  });
  refresh();
}

export async function toggleMilestoneTask(id: string) {
  const user = await requireUser();
  const t = await db.milestoneTask.findFirstOrThrow({
    where: { id, userId: user.id },
  });
  await db.milestoneTask.update({ where: { id }, data: { done: !t.done } });
  refresh();
}

export async function deleteMilestoneTask(id: string) {
  const user = await requireUser();
  await db.milestoneTask.deleteMany({ where: { id, userId: user.id } });
  refresh();
}

// ---- Spaced repetition ----

// Interval ladder in days. "Again" restarts, "Good" moves one step past the
// current interval, "Easy" skips a step.
const REVIEW_LADDER = [1, 3, 7, 14, 30, 60];

export type ReviewKind = "problem" | "sdTopic";
export type ReviewRating = "again" | "good" | "easy";

function nextIntervalDays(current: number, rating: ReviewRating): number {
  if (rating === "again") return REVIEW_LADDER[0];
  let idx = REVIEW_LADDER.findIndex((d) => d > current);
  if (idx === -1) idx = REVIEW_LADDER.length - 1;
  if (rating === "easy") idx += 1;
  return REVIEW_LADDER[Math.min(idx, REVIEW_LADDER.length - 1)];
}

export async function reviewItem(
  kind: ReviewKind,
  id: string,
  rating: ReviewRating
) {
  const user = await requireUser();
  const where = { id, userId: user.id };

  const current =
    kind === "problem"
      ? (await db.problem.findFirstOrThrow({ where })).reviewInterval
      : (await db.sdTopic.findFirstOrThrow({ where })).reviewInterval;

  const days = nextIntervalDays(current, rating);
  const data = { reviewInterval: days, nextReviewAt: daysFromNow(days) };
  if (kind === "problem") {
    await db.problem.update({
      where: { id },
      data: { ...data, lastReviewed: new Date() },
    });
  } else {
    await db.sdTopic.update({ where: { id }, data });
  }
  refresh();
}

// ---- Notes ----

async function noteLinkData(fd: FormData) {
  return {
    taskId: str(fd, "taskId") || null,
    patternId: str(fd, "patternId") || null,
    problemId: str(fd, "problemId") || null,
    sdTopicId: str(fd, "sdTopicId") || null,
    milestoneId: str(fd, "milestoneId") || null,
  };
}

export async function createNote(fd: FormData) {
  const user = await requireUser();
  const note = await db.note.create({
    data: {
      userId: user.id,
      title: str(fd, "title") || "Untitled note",
      body: str(fd, "body"),
      ...(await noteLinkData(fd)),
    },
  });
  refresh();
  redirect(`/notes/${note.id}`);
}

export async function updateNote(id: string, fd: FormData) {
  const user = await requireUser();
  await db.note.updateMany({
    where: { id, userId: user.id },
    data: {
      title: str(fd, "title") || "Untitled note",
      body: str(fd, "body"),
      ...(await noteLinkData(fd)),
    },
  });
  refresh();
}

export async function deleteNote(id: string) {
  const user = await requireUser();
  await db.note.deleteMany({ where: { id, userId: user.id } });
  refresh();
  redirect("/notes");
}

// ---- Resources: personal library additions ----

export async function createResource(fd: FormData) {
  const user = await requireUser();
  const title = str(fd, "title");
  const url = str(fd, "url");
  if (!title || !url) return;
  await db.resource.create({
    data: {
      userId: user.id,
      title,
      url,
      type: str(fd, "type") || "docs",
      topic: str(fd, "topic"),
      description: str(fd, "description"),
    },
  });
  refresh();
}

export async function deleteResource(id: string) {
  const user = await requireUser();
  // Only the learner's own rows exist in this table; the curriculum
  // library renders from code and has nothing to delete.
  await db.resource.deleteMany({ where: { id, userId: user.id } });
  refresh();
}
