import { describe, expect, it } from "vitest";
import {
  MILESTONES,
  PATTERNS,
  PATTERN_PROBLEMS,
  PATTERN_SIGNALS,
  RESOURCES,
  SD_TOPICS,
  SD_TOPIC_CONTENT,
  STAR_STEPS,
  STAR_STORY_PROMPTS,
  UMPIRE_STEPS,
  WEEK_TASKS,
  slugify,
} from "@/lib/curriculum";
import { PROBLEM_KINDS } from "@/lib/constants";

// The canonical interview curriculum architecture: 22 patterns x 4
// role-based problems = 88 unique problems. These numbers are the spec.
describe("canonical curriculum architecture", () => {
  it("has exactly 22 core patterns", () => {
    expect(PATTERNS).toHaveLength(22);
  });

  it("every pattern has exactly 4 problems, one per role (A/B/C/D)", () => {
    for (const name of PATTERNS) {
      const problems = PATTERN_PROBLEMS[name];
      expect(problems, `no problems for ${name}`).toBeTruthy();
      expect(problems, `${name} must have 4 problems`).toHaveLength(4);
      const roles = problems.map(([, , , role]) => role).sort();
      expect(roles, `${name} roles must be one of each`).toEqual(
        [...PROBLEM_KINDS].sort()
      );
    }
  });

  it("produces exactly 88 unique problems (no name reused across patterns)", () => {
    const names = Object.values(PATTERN_PROBLEMS).flatMap((list) =>
      list.map(([name]) => name)
    );
    expect(names).toHaveLength(88);
    expect(new Set(names).size).toBe(88);
  });

  it("UMPIRE spells UMPIRE and STAR + Learning has all five sections", () => {
    expect(UMPIRE_STEPS.map((s) => s.letter).join("")).toBe("UMPIRE");
    expect(STAR_STEPS.map((s) => s.name)).toEqual([
      "Situation",
      "Task",
      "Action",
      "Result",
      "Learning",
    ]);
    expect(STAR_STORY_PROMPTS.length).toBeGreaterThanOrEqual(10);
  });

  it("AlgoMaster is the free pattern hub and NeetCode the problem bank in resources", () => {
    const titles = RESOURCES.map(([title]) => title);
    expect(titles).toContain("AlgoMaster DSA patterns");
    expect(titles).toContain("NeetCode");
    expect(titles).toContain("Coding Interview University");
  });

  it("applications begin in week 1, not week 8", () => {
    expect(
      WEEK_TASKS[1].some((t) => t.category === "Career"),
      "week 1 has no Career task"
    ).toBe(true);
  });
});

// Content renders from code keyed by the seeded names, so the maps must
// stay aligned with the name arrays or content silently disappears.
describe("curriculum content coverage", () => {
  it("every pattern has recognition signals, and no orphan keys exist", () => {
    for (const name of PATTERNS) {
      expect(PATTERN_SIGNALS[name], `missing signals for ${name}`).toBeTruthy();
    }
    for (const key of Object.keys(PATTERN_SIGNALS)) {
      expect(PATTERNS).toContain(key);
    }
  });

  it("every SD topic has content with at least one link and recall questions", () => {
    for (const name of SD_TOPICS) {
      const content = SD_TOPIC_CONTENT[name];
      expect(content, `missing content for ${name}`).toBeTruthy();
      expect(content.links.length, `no links for ${name}`).toBeGreaterThan(0);
      expect(content.recall, `no recall for ${name}`).toBeTruthy();
    }
    for (const key of Object.keys(SD_TOPIC_CONTENT)) {
      expect(SD_TOPICS).toContain(key);
    }
  });

  it("every problem list belongs to a real pattern", () => {
    for (const key of Object.keys(PATTERN_PROBLEMS)) {
      expect(PATTERNS).toContain(key);
    }
  });
});

describe("seed data integrity", () => {
  it("slugs are unique per list (unique-constraint keys)", () => {
    for (const list of [PATTERNS, SD_TOPICS, MILESTONES]) {
      const slugs = list.map(slugify);
      expect(new Set(slugs).size).toBe(list.length);
    }
  });

  it("no (week, day, title) collisions in WEEK_TASKS (skipDuplicates would silently drop them)", () => {
    for (const [week, tasks] of Object.entries(WEEK_TASKS)) {
      const keys = tasks.map((t) => `${t.day}|${t.title}`);
      expect(new Set(keys).size, `collision in week ${week}`).toBe(keys.length);
    }
  });

  it("no (pattern, problem name) collisions in PATTERN_PROBLEMS", () => {
    for (const [pattern, problems] of Object.entries(PATTERN_PROBLEMS)) {
      const names = problems.map(([name]) => name);
      expect(new Set(names).size, `collision in ${pattern}`).toBe(names.length);
    }
  });

  it("problem slugs form valid LeetCode URL segments", () => {
    for (const problems of Object.values(PATTERN_PROBLEMS)) {
      for (const [, slug] of problems) {
        expect(slug).toMatch(/^[a-z0-9-]+$/);
      }
    }
  });

  it("all 8 weeks exist and weeks 2-7 keep the weekly career task (Track C)", () => {
    expect(Object.keys(WEEK_TASKS).map(Number).sort((a, b) => a - b)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ]);
    for (let week = 2; week <= 7; week++) {
      const hasCareer = WEEK_TASKS[week].some((t) => t.category === "Career");
      expect(hasCareer, `week ${week} lost its Career task`).toBe(true);
    }
  });

  it("every study task carries at least one learning link (follow-the-link rule)", () => {
    // Engineering, AIEngineering, and SystemDesign study sessions must be
    // doable without hunting for resources: click the link, learn. Project
    // and Career tasks are the learner's own work; InterviewPrep practice
    // sessions draw on the pattern pages.
    const needsLinks = new Set(["Engineering", "AIEngineering", "SystemDesign"]);
    for (const [week, tasks] of Object.entries(WEEK_TASKS)) {
      for (const t of tasks) {
        if (!needsLinks.has(t.category)) continue;
        expect(
          (t.links ?? []).length,
          `week ${week} "${t.title}" has no learning links`
        ).toBeGreaterThan(0);
      }
    }
  });

  it("pattern-study tasks carry a free visual lesson, and no link is paywalled", () => {
    const all = Object.values(WEEK_TASKS).flat();
    // Grokking (designgurus.io) is paywalled; it must never come back.
    for (const t of all) {
      for (const l of t.links ?? []) {
        expect(l.url, `${t.title} links a paywalled course`).not.toContain(
          "designgurus.io"
        );
      }
    }
    for (const [title, url] of RESOURCES) {
      expect(url, `resource "${title}" is paywalled`).not.toContain(
        "designgurus.io"
      );
    }
    // Every pattern session teaches from a free visual: at least one link,
    // the first of which is the pattern's video.
    const patternTasks = all.filter(
      (t) =>
        t.category === "InterviewPrep" &&
        /(pattern$|dynamic programming$)/i.test(t.title)
    );
    expect(patternTasks.length).toBeGreaterThanOrEqual(22);
    for (const t of patternTasks) {
      const links = t.links ?? [];
      expect(links.length, `"${t.title}" has no visual lesson link`).toBeGreaterThan(0);
      expect(
        links[0].url,
        `"${t.title}" first link should be its video/visual`
      ).toMatch(/youtube\.com/);
    }
  });

  it("task links have labels and https URLs", () => {
    for (const tasks of Object.values(WEEK_TASKS)) {
      for (const t of tasks) {
        for (const link of t.links ?? []) {
          expect(link.label.trim().length, link.url).toBeGreaterThan(0);
          expect(link.url).toMatch(/^https:\/\//);
        }
      }
    }
  });

  it("resources have unique titles and valid URLs", () => {
    const titles = RESOURCES.map(([title]) => title);
    expect(new Set(titles).size).toBe(titles.length);
    for (const [, url] of RESOURCES) {
      expect(url).toMatch(/^https:\/\//);
    }
  });

  it("rendered curriculum copy contains no em dashes", () => {
    const texts = [
      ...Object.values(PATTERN_SIGNALS),
      ...Object.values(SD_TOPIC_CONTENT).flatMap((c) => [
        c.practice,
        c.recall,
        ...c.links.map((l) => l.label),
      ]),
      ...Object.values(WEEK_TASKS).flatMap((tasks) =>
        tasks.map(
          (t) =>
            `${t.title} ${t.description ?? ""} ${(t.links ?? [])
              .map((l) => l.label)
              .join(" ")}`
        )
      ),
      ...UMPIRE_STEPS.map((s) => `${s.name} ${s.detail}`),
      ...STAR_STEPS.map((s) => `${s.name} ${s.detail}`),
      ...STAR_STORY_PROMPTS,
      ...RESOURCES.map(([title, , , , description]) => `${title} ${description}`),
    ];
    for (const text of texts) {
      expect(text.includes("—"), `em dash in: ${text}`).toBe(false);
    }
  });
});
