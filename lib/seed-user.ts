import { db } from "./db";
import {
  MILESTONES,
  PATTERNS,
  PATTERN_PROBLEMS,
  SD_TOPICS,
  WEEK_TASKS,
  slugify,
} from "./curriculum";

// Populates a fresh account with per-user PROGRESS rows for the curriculum
// (statuses, notes, review state). The curriculum content itself (signals,
// topic links/practice/recall, the resource library) renders straight from
// lib/curriculum.ts and is never copied into the database.
//
// Every createMany uses skipDuplicates against a unique constraint, so two
// concurrent first loads can both run this safely.
export async function seedUser(userId: string) {
  await db.pattern.createMany({
    data: PATTERNS.map((name, i) => ({
      userId,
      name,
      slug: slugify(name),
      order: i,
    })),
    skipDuplicates: true,
  });

  await seedProblems(userId);

  await db.sdTopic.createMany({
    data: SD_TOPICS.map((name, i) => ({
      userId,
      name,
      slug: slugify(name),
      order: i,
    })),
    skipDuplicates: true,
  });

  await db.milestone.createMany({
    data: MILESTONES.map((name, i) => ({
      userId,
      name,
      slug: slugify(name),
      order: i,
    })),
    skipDuplicates: true,
  });

  await db.task.createMany({
    data: Object.entries(WEEK_TASKS).flatMap(([week, tasks]) =>
      tasks.map((t, i) => ({
        userId,
        week: parseInt(week, 10),
        day: t.day,
        order: i,
        title: t.title,
        category: t.category,
        estMinutes: t.estMinutes ?? null,
        description: t.description ?? "",
        links: JSON.stringify(t.links ?? []),
      }))
    ),
    skipDuplicates: true,
  });
}

// Attaches the curated starter problems to a user's patterns. Separate from
// seedUser so accounts created before problem lists existed get them too.
async function seedProblems(userId: string) {
  const patterns = await db.pattern.findMany({ where: { userId } });
  const bySlug = new Map(patterns.map((p) => [p.slug, p.id]));
  const data = Object.entries(PATTERN_PROBLEMS).flatMap(
    ([patternName, problems]) => {
      const patternId = bySlug.get(slugify(patternName));
      if (!patternId) return [];
      return problems.map(([name, slug, difficulty, kind]) => ({
        userId,
        patternId,
        name,
        url: `https://leetcode.com/problems/${slug}/`,
        difficulty,
        kind,
      }));
    }
  );
  await db.problem.createMany({ data, skipDuplicates: true });
}

export async function ensureSeeded(userId: string) {
  const hasPatterns = await db.pattern.findFirst({
    where: { userId },
    select: { id: true },
  });
  if (!hasPatterns) {
    await seedUser(userId);
    return;
  }
  // Account predates the problem lists: fill them in once.
  const hasProblems = await db.problem.findFirst({
    where: { userId },
    select: { id: true },
  });
  if (!hasProblems) await seedProblems(userId);
}
