"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "./db";
import { requireUser } from "./auth";
import { textareaToLinksJson } from "./links";

// A small personal tool: after any mutation, refresh everything.
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

function dateOrNull(fd: FormData, key: string): Date | null {
  const v = str(fd, key);
  return v ? new Date(`${v}T00:00:00`) : null;
}

// ---- Roadmap tasks ----

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

export async function updateTask(id: string, fd: FormData) {
  const user = await requireUser();
  await db.task.updateMany({
    where: { id, userId: user.id },
    data: {
      title: str(fd, "title") || "Untitled task",
      description: str(fd, "description"),
      category: str(fd, "category") || "Engineering",
      estMinutes: str(fd, "estMinutes") ? parseInt(str(fd, "estMinutes"), 10) : null,
      links: textareaToLinksJson(str(fd, "links")),
      notes: str(fd, "notes"),
      practice: str(fd, "practice"),
      recall: str(fd, "recall"),
      nextReviewAt: dateOrNull(fd, "nextReviewAt"),
    },
  });
  refresh();
}

export async function addTask(week: number, day: number, fd: FormData) {
  const user = await requireUser();
  const last = await db.task.findFirst({
    where: { userId: user.id, week, day },
    orderBy: { order: "desc" },
  });
  await db.task.create({
    data: {
      userId: user.id,
      week,
      day,
      order: (last?.order ?? 0) + 1,
      title: str(fd, "title") || "Untitled task",
      category: str(fd, "category") || "Engineering",
    },
  });
  refresh();
}

// Persists a drag-and-drop reorder: ids arrive in their new display order.
export async function reorderTasks(ids: string[]) {
  const user = await requireUser();
  await db.$transaction(
    ids.map((id, i) =>
      db.task.updateMany({
        where: { id, userId: user.id },
        data: { order: i },
      })
    )
  );
  refresh();
}

export async function deleteTask(id: string) {
  const user = await requireUser();
  await db.task.deleteMany({ where: { id, userId: user.id } });
  refresh();
}

// ---- Interview patterns & problems ----

export async function updatePattern(id: string, fd: FormData) {
  const user = await requireUser();
  await db.pattern.updateMany({
    where: { id, userId: user.id },
    data: {
      notes: str(fd, "notes"),
      signals: str(fd, "signals"),
      status: str(fd, "status") || "not_started",
      confidence: str(fd, "confidence") || "unknown",
    },
  });
  refresh();
}

export async function addProblem(patternId: string, fd: FormData) {
  const user = await requireUser();
  const name = str(fd, "name");
  if (!name) return;
  // Ensure the pattern belongs to this user before attaching a problem.
  await db.pattern.findFirstOrThrow({
    where: { id: patternId, userId: user.id },
  });
  await db.problem.create({
    data: {
      userId: user.id,
      patternId,
      name,
      url: str(fd, "url"),
      kind: str(fd, "kind") || "independent",
      difficulty: str(fd, "difficulty") || "medium",
    },
  });
  refresh();
}

export async function updateProblem(id: string, fd: FormData) {
  const user = await requireUser();
  await db.problem.updateMany({
    where: { id, userId: user.id },
    data: {
      name: str(fd, "name") || "Untitled problem",
      url: str(fd, "url"),
      kind: str(fd, "kind") || "independent",
      difficulty: str(fd, "difficulty") || "medium",
      status: str(fd, "status") || "not_started",
      confidence: str(fd, "confidence") || "unknown",
      timeComplexity: str(fd, "timeComplexity"),
      spaceComplexity: str(fd, "spaceComplexity"),
      notes: str(fd, "notes"),
      firstAttempt: dateOrNull(fd, "firstAttempt"),
      lastReviewed: dateOrNull(fd, "lastReviewed"),
      nextReviewAt: dateOrNull(fd, "nextReviewAt"),
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
  await db.problem.update({
    where: { id },
    data: {
      status,
      // Stamp firstAttempt the first time work starts on a problem.
      firstAttempt:
        p.firstAttempt ?? (status !== "not_started" ? new Date() : null),
    },
  });
  refresh();
}

export async function deleteProblem(id: string) {
  const user = await requireUser();
  await db.problem.deleteMany({ where: { id, userId: user.id } });
  refresh();
}

// ---- System design topics ----

export async function updateSdTopic(id: string, fd: FormData) {
  const user = await requireUser();
  await db.sdTopic.updateMany({
    where: { id, userId: user.id },
    data: {
      status: str(fd, "status") || "not_started",
      notes: str(fd, "notes"),
      links: textareaToLinksJson(str(fd, "links")),
      practice: str(fd, "practice"),
      recall: str(fd, "recall"),
      nextReviewAt: dateOrNull(fd, "nextReviewAt"),
    },
  });
  refresh();
}

// ---- Project milestones ----

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

export type ReviewKind = "task" | "problem" | "sdTopic";
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
  const now = new Date();
  const where = { id, userId: user.id };

  const current =
    kind === "task"
      ? (await db.task.findFirstOrThrow({ where })).reviewInterval
      : kind === "problem"
        ? (await db.problem.findFirstOrThrow({ where })).reviewInterval
        : (await db.sdTopic.findFirstOrThrow({ where })).reviewInterval;

  const days = nextIntervalDays(current, rating);
  const nextReviewAt = new Date(now);
  nextReviewAt.setDate(nextReviewAt.getDate() + days);
  nextReviewAt.setHours(0, 0, 0, 0);

  const data = { reviewInterval: days, nextReviewAt };
  if (kind === "task") {
    await db.task.update({ where: { id }, data });
  } else if (kind === "problem") {
    await db.problem.update({
      where: { id },
      data: { ...data, lastReviewed: now },
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

// ---- Resources ----

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
  await db.resource.deleteMany({ where: { id, userId: user.id } });
  refresh();
}
