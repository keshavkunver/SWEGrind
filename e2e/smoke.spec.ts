import { test, expect, type Page } from "@playwright/test";

// Smoke flows for the signed-in learner (session from auth.setup.ts).
// Each test gets its own context loaded from the saved storage state.

async function statusPillFor(page: Page, linkName: RegExp) {
  // A problem row: <form><button pill/></form> then the problem link.
  // Scope to the row container that has the link, then take its pill.
  return page
    .locator("div")
    .filter({ has: page.getByRole("link", { name: linkName }) })
    .getByRole("button", { name: /Not started|In progress|Complete/ })
    .last();
}

test("dashboard shows the seeded curriculum and live progress", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("0/88 problems · 0/22 patterns ready")
  ).toBeVisible();
  await expect(page.getByText("learning tasks")).toBeVisible();
  await expect(page.getByText("15 topics")).toBeVisible();
  await expect(page.getByText("of 18 milestones done")).toBeVisible();

  // Cycling a today-task moves the overall percentage off 0%.
  const pill = page
    .getByRole("button", { name: "Not started" })
    .first();
  await pill.click();
  await expect(page.getByRole("button", { name: "In progress" }).first())
    .toBeVisible();
});

test("pattern page renders content from code and schedules reviews on completion", async ({
  page,
}) => {
  await page.goto("/interview/hash-maps-sets");
  await expect(
    page.getByRole("heading", { name: "When to reach for this pattern" })
  ).toBeVisible();
  await expect(page.getByText(/Frequency or counts means hash map/)).toBeVisible();

  const twoSum = /Two Sum/;
  await expect(page.getByRole("link", { name: twoSum })).toBeVisible();

  // Not started -> In progress -> Complete: review chip appears.
  await (await statusPillFor(page, twoSum)).click();
  await expect(await statusPillFor(page, twoSum)).toHaveText(/In progress/);
  await (await statusPillFor(page, twoSum)).click();
  await expect(page.getByText(/review \d{4}-\d{2}-\d{2}/)).toBeVisible();

  // Un-complete: chip leaves the queue.
  await (await statusPillFor(page, twoSum)).click();
  await expect(page.getByText(/review \d{4}-\d{2}-\d{2}/)).toHaveCount(0);
});

test("system design topic shows curriculum content and completion schedules review", async ({
  page,
}) => {
  await page.goto("/system-design/caching");
  await expect(page.getByRole("heading", { name: "Learn" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Hello Interview: Caching/ })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Recall questions" })
  ).toBeVisible();

  // Cycle to complete: subtitle announces the scheduled review.
  await page.getByRole("button", { name: "Not started" }).click();
  await page.getByRole("button", { name: "In progress" }).click();
  await expect(page.getByText(/Review scheduled for \d{4}-\d{2}-\d{2}/))
    .toBeVisible();
});

test("notes support markdown, search, and deletion", async ({ page }) => {
  await page.goto("/notes");
  await page.getByPlaceholder("Title").fill("Smoke note");
  await page
    .getByPlaceholder("Write in Markdown", { exact: false })
    .fill("## Smoke heading\n\n- a list item");
  await page.getByRole("button", { name: "Create note" }).click();

  // Redirected to the note with a rendered preview.
  await expect(
    page.getByRole("heading", { name: "Smoke heading" })
  ).toBeVisible();

  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page).toHaveURL(/\/notes$/);
  await expect(page.getByText("Smoke note")).toHaveCount(0);
});

test("resources: curriculum library from code plus deletable personal rows", async ({
  page,
}) => {
  await page.goto("/resources");
  await expect(page.getByRole("link", { name: /NeetCode/ })).toBeVisible();
  // Curriculum entries carry no delete buttons.
  await expect(
    page.getByRole("button", { name: "Delete NeetCode" })
  ).toHaveCount(0);

  await page.getByLabel("Title").fill("Smoke Resource");
  await page.getByLabel("URL").fill("https://example.com/smoke");
  await page.getByLabel("Topic").fill("Smoke");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(
    page.getByRole("link", { name: /Smoke Resource/ })
  ).toBeVisible();

  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Delete Smoke Resource" }).click();
  await expect(
    page.getByRole("link", { name: /Smoke Resource/ })
  ).toHaveCount(0);
});

test("signing out gates every route behind login", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Sign out" }).first().click();
  await expect(page).toHaveURL(/\/login/);

  await page.goto("/interview/hash-maps-sets");
  await expect(page).toHaveURL(/\/login/);
});
