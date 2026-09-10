import { beforeEach, describe, expect, it, vi } from "vitest";

// Guards the regression class this function was written for: task CONTENT
// (links, description, estimate, order) drifting silently on existing
// accounts because seeding uses skipDuplicates and never revisits rows.

const task = {
  findMany: vi.fn(),
  update: vi.fn(),
};

vi.mock("@/lib/db", () => ({
  db: {
    get task() {
      return task;
    },
  },
}));

import { refreshTaskContent } from "@/lib/seed-user";
import { WEEK_TASKS } from "@/lib/curriculum";

const w1 = WEEK_TASKS[1];
const diagIndex = w1.findIndex((t) => t.title === "JavaScript diagnostic");
const diag = w1[diagIndex];

function rowFor(
  t: (typeof w1)[number],
  order: number,
  overrides: Partial<Record<string, unknown>> = {}
) {
  return {
    id: `row-${t.title}`,
    week: 1,
    day: t.day,
    title: t.title,
    order,
    category: t.category,
    estMinutes: t.estMinutes ?? null,
    description: t.description ?? "",
    links: JSON.stringify(t.links ?? []),
    ...overrides,
  };
}

describe("refreshTaskContent", () => {
  beforeEach(() => {
    task.findMany.mockReset();
    task.update.mockReset();
  });

  it("updates a row whose content drifted from WEEK_TASKS (the stale-links regression)", async () => {
    task.findMany.mockResolvedValue([
      rowFor(diag, diagIndex, { links: "[]", description: "" }),
    ]);

    await refreshTaskContent("user-1");

    expect(task.update).toHaveBeenCalledTimes(1);
    const call = task.update.mock.calls[0][0];
    expect(call.where).toEqual({ id: `row-${diag.title}` });
    expect(call.data.links).toBe(JSON.stringify(diag.links));
    expect(call.data.description).toBe(diag.description);
    expect(call.data.order).toBe(diagIndex);
  });

  it("never writes learner-owned fields (status, notes)", async () => {
    task.findMany.mockResolvedValue([
      rowFor(diag, diagIndex, { links: "[]" }),
    ]);

    await refreshTaskContent("user-1");

    const data = task.update.mock.calls[0][0].data;
    expect(Object.keys(data).sort()).toEqual([
      "category",
      "description",
      "estMinutes",
      "links",
      "order",
    ]);
  });

  it("leaves up-to-date rows alone (no writes on a normal load)", async () => {
    task.findMany.mockResolvedValue(
      w1.map((t, i) => rowFor(t, i))
    );

    await refreshTaskContent("user-1");

    expect(task.update).not.toHaveBeenCalled();
  });

  it("skips rows that are not in the curriculum (learner history is preserved)", async () => {
    task.findMany.mockResolvedValue([
      {
        id: "row-history",
        week: 1,
        day: 2,
        title: "A task the learner completed before it left the curriculum",
        order: 99,
        category: "Engineering",
        estMinutes: 30,
        description: "old",
        links: "[]",
      },
    ]);

    await refreshTaskContent("user-1");

    expect(task.update).not.toHaveBeenCalled();
  });
});
