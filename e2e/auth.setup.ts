import { test as setup, expect } from "@playwright/test";

// Creates a fresh account for this run (exercising first-load seeding) and
// saves its session for the smoke tests. Local Supabase auto-confirms
// email, so sign-up lands straight on the dashboard.
setup("create account and sign in", async ({ page }) => {
  const email = `e2e-${Date.now()}@test.local`;
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: false }).first().fill("grind1234");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(
    page.getByRole("heading", { name: "Overall progress" })
  ).toBeVisible({ timeout: 30_000 });

  await page.context().storageState({ path: "e2e/.auth/user.json" });
});
