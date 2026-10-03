-- Lane 4: student A reads profile_version; only their own rows may return.
-- A same-workspace peer with a profile is added (rolled back) so a leak inside workspace A is observable.
\pset pager off
begin;
insert into auth.users (id, aud, role, email)
values ('00000000-0000-4000-8000-0000000000f4', 'authenticated', 'authenticated', 'lane4-peer@dormmate.test');
with peer as (
  insert into public.enrollment (workspace_id, cycle_id, user_id, status)
  select workspace_id, cycle_id, '00000000-0000-4000-8000-0000000000f4', 'approved'
  from public.enrollment where user_id = '00000000-0000-4000-8000-0000000000a2'
  returning id, workspace_id
)
insert into public.profile_version (workspace_id, enrollment_id, answers)
select workspace_id, id, '{"lane4": "peer"}' from peer;

create temp table lane4_seen (id uuid) on commit drop;
grant insert, select on lane4_seen to authenticated;

\echo '--- as postgres (ground truth) ---'
select pv.id, pv.workspace_id, e.user_id from public.profile_version pv join public.enrollment e on e.id = pv.enrollment_id order by 2, 3;

select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000a2", "role": "authenticated"}', true);
set local role authenticated;
\echo '--- as student A ---'
select current_user, auth.uid();
select id, workspace_id, enrollment_id from public.profile_version;
insert into lane4_seen select id from public.profile_version;
reset role;

do $$
declare
  seen int;
  own int;
  foreign_rows int;
  missing int;
  total int;
begin
  select count(*) into total from public.profile_version;
  select count(*) into seen from lane4_seen;
  select count(*) into own
  from public.profile_version pv join public.enrollment e on e.id = pv.enrollment_id
  where e.user_id = '00000000-0000-4000-8000-0000000000a2';
  select count(*) into foreign_rows
  from lane4_seen s join public.profile_version pv on pv.id = s.id join public.enrollment e on e.id = pv.enrollment_id
  where e.user_id <> '00000000-0000-4000-8000-0000000000a2';
  select count(*) into missing
  from public.profile_version pv join public.enrollment e on e.id = pv.enrollment_id
  where e.user_id = '00000000-0000-4000-8000-0000000000a2' and pv.id not in (select id from lane4_seen);
  raise notice 'total=% own=% seen=% foreign_seen=% own_missing=%', total, own, seen, foreign_rows, missing;
  if own > 0 and seen = own and foreign_rows = 0 and missing = 0 and total > own then
    raise notice 'LANE4 PASS: student A sees exactly their own % profile_version row(s) of % total', own, total;
  else
    raise exception 'LANE4 FAIL';
  end if;
end
$$;
rollback;
