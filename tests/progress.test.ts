import { describe, expect, it } from "vitest";
import {
  countComplete,
  derivedStatus,
  endOfToday,
  fmtDate,
  pct,
} from "@/lib/progress";

describe("pct", () => {
  it("is 0 for an empty list", () => {
    expect(pct([])).toBe(0);
  });

  it("counts complete as 1 and in_progress as half credit", () => {
    expect(
      pct([
        { status: "complete" },
        { status: "in_progress" },
        { status: "not_started" },
        { status: "not_started" },
      ])
    ).toBe(38); // (1 + 0.5) / 4 = 37.5 -> rounds to 38
    expect(pct([{ status: "complete" }])).toBe(100);
  });
});

describe("derivedStatus", () => {
  it("is not_started with no problems", () => {
    expect(derivedStatus([])).toBe("not_started");
  });

  it("is complete only when every problem is complete", () => {
    expect(
      derivedStatus([{ status: "complete" }, { status: "complete" }])
    ).toBe("complete");
    expect(
      derivedStatus([{ status: "complete" }, { status: "not_started" }])
    ).toBe("in_progress");
  });

  it("is in_progress once anything has been touched", () => {
    expect(
      derivedStatus([{ status: "in_progress" }, { status: "not_started" }])
    ).toBe("in_progress");
    expect(
      derivedStatus([{ status: "not_started" }, { status: "not_started" }])
    ).toBe("not_started");
  });
});

describe("countComplete", () => {
  it("counts only complete items", () => {
    expect(
      countComplete([
        { status: "complete" },
        { status: "in_progress" },
        { status: "complete" },
      ])
    ).toBe(2);
  });
});

describe("fmtDate", () => {
  it("renders the local calendar day, not the UTC day (the TZ skew bug)", () => {
    // Local midnight: toISOString() would show the previous day in any
    // timezone east of UTC; fmtDate must not.
    const d = new Date(2026, 8, 15); // Sep 15 2026, local midnight
    expect(fmtDate(d)).toBe("2026-09-15");
  });

  it("pads month and day", () => {
    expect(fmtDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("returns empty for null", () => {
    expect(fmtDate(null)).toBe("");
  });
});

describe("endOfToday", () => {
  it("is later than now but on the same local day", () => {
    const now = new Date();
    const end = endOfToday();
    expect(end.getTime()).toBeGreaterThanOrEqual(now.getTime());
    expect(end.getDate()).toBe(now.getDate());
    expect(end.getHours()).toBe(23);
  });
});
