"use client";

import { useActionState } from "react";
import { signIn, signUp, type AuthState } from "@/lib/auth-actions";

export default function LoginPage() {
  const [signInState, signInAction, signInPending] = useActionState<
    AuthState,
    FormData
  >(signIn, null);
  const [signUpState, signUpAction, signUpPending] = useActionState<
    AuthState,
    FormData
  >(signUp, null);

  const error = signInState?.error ?? signUpState?.error;
  const message = signInState?.message ?? signUpState?.message;
  const pending = signInPending || signUpPending;

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-bold tracking-tight">SWE Grind</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Sign in to track your 8-week plan. New here? Use the same form and
          hit &ldquo;Create account&rdquo;.
        </p>
        <form className="mt-4 grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-xs font-medium text-zinc-500">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              spellCheck={false}
              className="rounded border border-zinc-300 px-2 py-1.5"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-xs font-medium text-zinc-500">Password</span>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
              className="rounded border border-zinc-300 px-2 py-1.5"
            />
          </label>
          <div aria-live="polite">
            {error && (
              <p className="rounded bg-red-50 px-2 py-1 text-sm text-red-600">
                {error}
              </p>
            )}
            {message && (
              <p className="rounded bg-emerald-50 px-2 py-1 text-sm text-emerald-700">
                {message}
              </p>
            )}
          </div>
          <div className="mt-1 flex gap-2">
            <button
              formAction={signInAction}
              disabled={pending}
              className="flex-1 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
            >
              Sign in
            </button>
            <button
              formAction={signUpAction}
              disabled={pending}
              className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 disabled:opacity-50"
            >
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
