-- Row Level Security for all app tables. Idempotent; run any time with:
--   npx prisma db execute --file prisma/rls.sql
--
-- Why: Supabase exposes public-schema tables through its REST API
-- (PostgREST). With RLS enabled, requests made with the publishable key
-- can only ever see the signed-in user's own rows; anonymous requests see
-- nothing. Prisma connects as the table owner and is unaffected, so the
-- app keeps working (its queries are already user-scoped in code).

do $$
declare
  t text;
begin
  foreach t in array array[
    'Task', 'Pattern', 'Problem', 'SdTopic',
    'Milestone', 'MilestoneTask', 'Note', 'Resource'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists owner_all on public.%I', t);
    execute format(
      'create policy owner_all on public.%I for all to authenticated '
      || 'using ((select auth.uid())::text = "userId") '
      || 'with check ((select auth.uid())::text = "userId")',
      t
    );
  end loop;
end $$;
