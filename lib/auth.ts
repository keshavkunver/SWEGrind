import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

// Every page and action calls this; it redirects to /login when signed out.
export async function requireUser(): Promise<{ id: string; email: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { id: user.id, email: user.email ?? "" };
}
