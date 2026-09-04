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

// v1 (12-pattern) slugs -> v2 (22-pattern) names. Renaming in place keeps
// the learner's confidence, notes, linked note entries, and problem rows.
const PATTERN_RENAMES: Record<string, string> = {
  "arrays-hashing": "Hash Maps / Sets",
  "binary-search": "Modified Binary Search",
  "linked-lists": "In-place Linked List Reversal",
  trees: "Tree DFS",
  "bfs-dfs": "Matrix / Islands",
  heaps: "Top-K / Heap",
  graphs: "Graph BFS / DFS",
  "dynamic-programming": "1-D Dynamic Programming",
};

// name -> canonical home for every curriculum problem.
function canonicalProblems() {
  const map = new Map<
    string,
    { patternSlug: string; role: string; difficulty: string }
  >();
  for (const [patternName, problems] of Object.entries(PATTERN_PROBLEMS)) {
    const patternSlug = slugify(patternName);
    for (const [name, , difficulty, role] of problems) {
      map.set(name, { patternSlug, role, difficulty });
    }
  }
  return map;
}

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

// Attaches the curated curriculum problems to a user's patterns. Separate
// from seedUser so curriculum syncs can call it too.
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

// Brings an existing account up to the current curriculum WITHOUT touching
// progress: renames v1 patterns in place, re-parents problems to their
// canonical pattern, adds anything missing, and retires (never deletes)
// problems that left the curriculum. Runs only when the account's pattern
// count differs from the curriculum's, so steady-state loads skip it.
async function syncCurriculum(userId: string) {
  // 1. Rename v1 patterns in place (keeps ids, so problems/notes follow).
  for (const [oldSlug, newName] of Object.entries(PATTERN_RENAMES)) {
    await db.pattern.updateMany({
      where: { userId, slug: oldSlug },
      data: { slug: slugify(newName), name: newName },
    });
  }

  // 2. Create any patterns the account is missing.
  await db.pattern.createMany({
    data: PATTERNS.map((name, i) => ({
      userId,
      name,
      slug: slugify(name),
      order: i,
    })),
    skipDuplicates: true,
  });

  // 3. Align order (renamed patterns keep their v1 position otherwise).
  for (const [i, name] of PATTERNS.entries()) {
    await db.pattern.updateMany({
      where: { userId, slug: slugify(name), NOT: { order: i } },
      data: { order: i },
    });
  }

  // 4. Re-parent and re-role existing problems; flag non-curriculum ones
  //    as extra practice. Done BEFORE seeding new problems so a moved
  //    problem never collides with a freshly seeded duplicate.
  const canonical = canonicalProblems();
  const patterns = await db.pattern.findMany({ where: { userId } });
  const idBySlug = new Map(patterns.map((p) => [p.slug, p.id]));
  const problems = await db.problem.findMany({ where: { userId } });
  const taken = new Set(problems.map((p) => `${p.patternId}|${p.name}`));

  for (const p of problems) {
    const c = canonical.get(p.name);
    if (!c) {
      // Retired from the curriculum: keep the row and its history as
      // extra practice, excluded from the 88-problem metric.
      if (p.inCurriculum) {
        await db.problem.update({
          where: { id: p.id },
          data: { inCurriculum: false },
        });
      }
      continue;
    }
    const targetId = idBySlug.get(c.patternSlug);
    if (!targetId) continue;
    if (p.patternId !== targetId && taken.has(`${targetId}|${p.name}`)) {
      // A copy already lives at the canonical pattern (partial earlier
      // sync); retire this stray instead of violating the unique key.
      await db.problem.update({
        where: { id: p.id },
        data: { inCurriculum: false },
      });
      continue;
    }
    if (
      p.patternId !== targetId ||
      p.kind !== c.role ||
      p.difficulty !== c.difficulty ||
      !p.inCurriculum
    ) {
      taken.delete(`${p.patternId}|${p.name}`);
      taken.add(`${targetId}|${p.name}`);
      await db.problem.update({
        where: { id: p.id },
        data: {
          patternId: targetId,
          kind: c.role,
          difficulty: c.difficulty,
          inCurriculum: true,
        },
      });
    }
  }

  // 5. Add missing curriculum problems, topics, milestones, tasks.
  await seedProblems(userId);
  await db.sdTopic.createMany({
    data: SD_TOPICS.map((name, i) => ({ userId, name, slug: slugify(name), order: i })),
    skipDuplicates: true,
  });
  await db.milestone.createMany({
    data: MILESTONES.map((name, i) => ({ userId, name, slug: slugify(name), order: i })),
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

  // 6. Remove tasks that left the curriculum, but ONLY untouched ones:
  //    anything started, completed, or annotated is the learner's history
  //    and stays. (Linked note entries survive deletion via SetNull.)
  const valid = new Set(
    Object.entries(WEEK_TASKS).flatMap(([week, tasks]) =>
      tasks.map((t) => `${week}|${t.day}|${t.title}`)
    )
  );
  const allTasks = await db.task.findMany({
    where: { userId },
    select: { id: true, week: true, day: true, title: true, status: true, notes: true },
  });
  const stale = allTasks
    .filter(
      (t) =>
        !valid.has(`${t.week}|${t.day}|${t.title}`) &&
        t.status === "not_started" &&
        t.notes === ""
    )
    .map((t) => t.id);
  if (stale.length > 0) {
    await db.task.deleteMany({ where: { id: { in: stale } } });
  }

  // 7. Backfill attempt counts for work done before attempts were tracked:
  //    any problem ever touched counts as at least one attempt.
  await db.problem.updateMany({
    where: { userId, attemptCount: 0, firstAttempt: { not: null } },
    data: { attemptCount: 1 },
  });
}

export async function ensureSeeded(userId: string) {
  const patternCount = await db.pattern.count({ where: { userId } });
  if (patternCount === 0) {
    await seedUser(userId);
    return;
  }
  // Existing account whose curriculum predates the current one (e.g. the
  // v1 12-pattern roadmap): sync it forward, preserving all progress.
  if (patternCount !== PATTERNS.length) {
    await syncCurriculum(userId);
  }
}
