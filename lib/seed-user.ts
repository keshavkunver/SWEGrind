import { db } from "./db";
import {
  MILESTONES,
  PATTERNS,
  PATTERN_PROBLEMS,
  RESOURCES,
  SD_TOPICS,
  WEEK_TASKS,
  slugify,
} from "./curriculum";

// Populates a fresh account with the 8-week curriculum. Called from the
// dashboard when the signed-in user has no patterns yet, so it runs
// exactly once per user and never touches existing data.
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

  await db.resource.createMany({
    data: RESOURCES.map(([title, url, type, topic, description]) => ({
      userId,
      title,
      url,
      type,
      topic,
      description,
    })),
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
  await db.problem.createMany({ data });
}

export async function ensureSeeded(userId: string) {
  const patternCount = await db.pattern.count({ where: { userId } });
  if (patternCount === 0) {
    await seedUser(userId);
    return;
  }
  // Backfill: account predates the curated problem lists.
  const problemCount = await db.problem.count({ where: { userId } });
  if (problemCount === 0) await seedProblems(userId);
}
