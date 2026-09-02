// Supports both key formats: the new sb_publishable_… keys
// (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) and legacy JWT anon keys
// (NEXT_PUBLIC_SUPABASE_ANON_KEY).
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_KEY = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;
