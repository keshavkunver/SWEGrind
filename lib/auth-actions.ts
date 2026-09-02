"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export type AuthState = { error?: string; message?: string } | null;

export async function signIn(
  _prev: AuthState,
  fd: FormData
): Promise<AuthState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: (fd.get("email") as string) ?? "",
    password: (fd.get("password") as string) ?? "",
  });
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUp(
  _prev: AuthState,
  fd: FormData
): Promise<AuthState> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: (fd.get("email") as string) ?? "",
    password: (fd.get("password") as string) ?? "",
  });
  if (error) return { error: error.message };
  // Hosted Supabase projects default to requiring email confirmation:
  // signUp succeeds but returns no session until the link is clicked.
  if (!data.session) {
    return {
      message:
        "Account created. Check your email for a confirmation link, then sign in.",
    };
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
