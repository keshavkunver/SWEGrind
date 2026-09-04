"use client";

import { useActionState, useState } from "react";
import { authenticate, type AuthState } from "@/lib/auth-actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    authenticate,
    null
  );
  const [showPassword, setShowPassword] = useState(false);

  const error = state?.error;
  const message = state?.message;

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-bold tracking-tight">SWE Grind</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Sign in to track your 8-week plan. New here? Use the same form and
          hit &ldquo;Create account&rdquo;.
        </p>
        <form action={formAction} className="mt-4 grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-xs font-medium text-zinc-500">Email</span>
            <input
              name="email"
              type="email"
              required
              // "username" is what browser password managers key their
              // saved-credential suggestions off.
              autoComplete="username"
              spellCheck={false}
              className="rounded border border-zinc-300 px-2 py-1.5"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-xs font-medium text-zinc-500">Password</span>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                autoComplete="current-password"
                className="w-full rounded border border-zinc-300 py-1.5 pl-2 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-zinc-400 hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-500"
              >
                {showPassword ? (
                  // eye-off
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-4.5 w-4.5"
                  >
                    <path d="M10.6 5.1A9.8 9.8 0 0 1 12 5c7 0 10 7 10 7a17.4 17.4 0 0 1-2.1 3.1M6.6 6.6A17 17 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />
                    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                    <path d="m2 2 20 20" />
                  </svg>
                ) : (
                  // eye
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-4.5 w-4.5"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
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
            {/* The submitter's name/value rides along in the FormData, so
                one action serves both buttons. (No per-button formAction:
                React reserves button `name` for its action refs there.) */}
            <button
              type="submit"
              name="intent"
              value="signin"
              disabled={pending}
              className="flex-1 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
            >
              Sign in
            </button>
            <button
              type="submit"
              name="intent"
              value="signup"
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
