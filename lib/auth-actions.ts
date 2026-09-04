"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export type AuthState = { error?: string; message?: string } | null;

// One action for both buttons (distinguished by the submitter's `intent`
// value) so the form has a single state: a stale sign-in error can never
// linger next to a later sign-up success message.
export async function authenticate(
  _prev: AuthState,
  fd: FormData
): Promise<AuthState> {
  const supabase = await createClient();
  const email = (fd.get("email") as string) ?? "";
  const password = (fd.get("password") as string) ?? "";

  if (fd.get("intent") === "signup") {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    // Hosted Supabase projects default to requiring email confirmation:
    // signUp succeeds but returns no session until the link is clicked.
    if (!data.session) {
      return {
        message:
          "Account created. Check your email for a confirmation link, then sign in.",
      };
    }
  } else {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
