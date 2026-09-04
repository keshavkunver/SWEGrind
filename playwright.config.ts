import { defineConfig } from "@playwright/test";

// Manual smoke layer: `npm run test:e2e`. Needs the local Supabase stack
// (`npx supabase start`); the dev server is started automatically below.
// Deliberately NOT wired into builds or deploys.
const PORT = 3457;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  // One retry absorbs dev-server connection drops mid-compile.
  retries: 1,
  reporter: [["list"]],
  // Server-action round trips (submit -> action -> revalidate -> render)
  // regularly exceed the 5s default on this machine when the local Docker
  // stack is under load.
  expect: { timeout: 15_000 },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "chromium",
      dependencies: ["setup"],
      use: { storageState: "e2e/.auth/user.json" },
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: `http://localhost:${PORT}/login`,
    // Never adopt a server someone else started: it would run with the
    // ambient .env (possibly the hosted project) instead of the local
    // stack pinned below. If port 3457 is busy, Playwright refuses to run.
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54331",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
        "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH",
      DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:54332/postgres",
    },
  },
});
