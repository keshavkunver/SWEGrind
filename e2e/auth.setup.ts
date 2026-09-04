import { test as setup, expect } from "@playwright/test";

// Creates a fresh account for this run (exercising first-load seeding) and
// saves its session for the smoke tests. Local Supabase auto-confirms
// email, so sign-up lands straight on the dashboard.
//
// Local GoTrue can be slow under Docker CPU contention and occasionally
// returns a retryable 504 (the form shows "please retry after a moment"),
// so each attempt waits for either the dashboard or an error alert, and
// only an explicit error triggers a retry. If a 504 raced a committed
// signup, the retry sees "already registered" and signs in instead.
setup("create account and sign in", async ({ page }) => {
  setup.setTimeout(240_000);
  const email = `e2e-${Date.now()}@test.local`;
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: false }).first().fill("grind1234");

  const dashboard = page.getByRole("heading", { name: "Overall progress" });
  const errorText = page.getByText(/timed out|try again|already registered/i);

  for (let attempt = 1; attempt <= 3; attempt++) {
    const alreadyRegistered = await page
      .getByText(/already registered/i)
      .isVisible();
    const button = page.getByRole("button", {
      name: alreadyRegistered ? "Sign in" : "Create account",
    });
    await expect(button).toBeEnabled({ timeout: 30_000 });
    await button.click();

    await expect(dashboard.or(errorText).first()).toBeVisible({
      timeout: 60_000,
    });
    if (await dashboard.isVisible()) break;
    if (attempt === 3) throw new Error("sign-up kept failing after retries");
  }

  await expect(dashboard).toBeVisible();
  await page.context().storageState({ path: "e2e/.auth/user.json" });
});
