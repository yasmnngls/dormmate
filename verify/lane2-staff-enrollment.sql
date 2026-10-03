-- Lane 2: staff A reads enrollment; only workspace A rows may return.
\pset pager off
\echo '--- as postgres (ground truth) ---'
select workspace_id, count(*) from public.enrollment group by 1 order by 1;

begin;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000a1", "role": "authenticated"}', true);
set local role authenticated;
\echo '--- as staff A ---'
select current_user, auth.uid();
select id, workspace_id, user_id, status from public.enrollment order by workspace_id;

do $$
declare
  a bigint;
  b bigint;
  other bigint;
begin
  select count(*) filter (where workspace_id = 'a0000000-0000-4000-8000-000000000000'),
         count(*) filter (where workspace_id = 'b0000000-0000-4000-8000-000000000000'),
         count(*) filter (where workspace_id not in ('a0000000-0000-4000-8000-000000000000', 'b0000000-0000-4000-8000-000000000000'))
    into a, b, other
  from public.enrollment;
  raise notice 'staff A sees A rows=%, B rows=%, other rows=%', a, b, other;
  if a > 0 and b = 0 and other = 0 then
    raise notice 'LANE2 PASS: only workspace A enrollment rows returned';
  else
    raise exception 'LANE2 FAIL: A=% B=% other=%', a, b, other;
  end if;
end
$$;
rollback;
