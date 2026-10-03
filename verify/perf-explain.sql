-- Perf: staff A's enrollment select, explained five times.
\pset pager off
begin;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000a1", "role": "authenticated"}', true);
set local role authenticated;
select current_user, auth.uid();
select count(*) as visible_to_staff_a from public.enrollment;
\echo '=== PLAN 1 ==='
explain (analyze, format text) select * from public.enrollment;
\echo '=== PLAN 2 ==='
explain (analyze, format text) select * from public.enrollment;
\echo '=== PLAN 3 ==='
explain (analyze, format text) select * from public.enrollment;
\echo '=== PLAN 4 ==='
explain (analyze, format text) select * from public.enrollment;
\echo '=== PLAN 5 ==='
explain (analyze, format text) select * from public.enrollment;
rollback;
