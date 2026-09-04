import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

const signInWithPassword = vi.fn();
const signUp = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { signInWithPassword, signUp },
  })),
}));

import { redirect } from "next/navigation";
import { authenticate } from "@/lib/auth-actions";

function fd(entries: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(entries)) f.set(k, v);
  return f;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("authenticate", () => {
  it("returns the sign-in error state on bad credentials", async () => {
    signInWithPassword.mockResolvedValue({
      error: { message: "Invalid login credentials" },
    });
    const state = await authenticate(
      null,
      fd({ intent: "signin", email: "a@b.c", password: "x" })
    );
    expect(state).toEqual({ error: "Invalid login credentials" });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("routes the signup intent to signUp and surfaces the confirm-email message", async () => {
    signUp.mockResolvedValue({ data: { session: null }, error: null });
    const state = await authenticate(
      null,
      fd({ intent: "signup", email: "a@b.c", password: "x" })
    );
    expect(signUp).toHaveBeenCalled();
    expect(signInWithPassword).not.toHaveBeenCalled();
    expect(state?.message).toContain("Check your email");
  });

  it("redirects home on a successful sign-in", async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    await authenticate(
      null,
      fd({ intent: "signin", email: "a@b.c", password: "x" })
    );
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("redirects home when signup returns an immediate session (local autoconfirm)", async () => {
    signUp.mockResolvedValue({ data: { session: {} }, error: null });
    await authenticate(
      null,
      fd({ intent: "signup", email: "a@b.c", password: "x" })
    );
    expect(redirect).toHaveBeenCalledWith("/");
  });
});
