-- Perf: bulk-seed 10,000 enrollments across 20 workspaces (seeded A and B plus 18 new), 500 each. Committed; a db reset restores.
\pset pager off
begin;
create temp table perf_ws as
select gen_random_uuid() as workspace_id, gen_random_uuid() as staff_id, g as n
from generate_series(1, 18) g;

insert into public.workspace (id, name) select workspace_id, 'Perf ' || n from perf_ws;
insert into auth.users (id, aud, role, email)
select staff_id, 'authenticated', 'authenticated', 'perf-staff-' || n || '@verify.test' from perf_ws;
insert into public.membership (workspace_id, user_id, role) select workspace_id, staff_id, 'manager' from perf_ws;

with q as (
  insert into public.questionnaire_version (workspace_id) select workspace_id from perf_ws
  returning id, workspace_id
)
insert into public.cycle (workspace_id, questionnaire_version_id, name, kind)
select workspace_id, id, 'Perf term', 'term' from q;

create temp table perf_target as
select distinct on (c.workspace_id) c.workspace_id, c.id as cycle_id
from public.cycle c
where c.workspace_id in (select workspace_id from perf_ws)
   or c.workspace_id in ('a0000000-0000-4000-8000-000000000000', 'b0000000-0000-4000-8000-000000000000')
order by c.workspace_id, c.created_at;

create temp table perf_student as
select gen_random_uuid() as user_id, t.workspace_id, t.cycle_id
from perf_target t cross join generate_series(1, 500);

insert into auth.users (id, aud, role, email)
select user_id, 'authenticated', 'authenticated', 'perf-student-' || user_id || '@verify.test' from perf_student;
insert into public.enrollment (workspace_id, cycle_id, user_id, status)
select workspace_id, cycle_id, user_id, 'approved' from perf_student;
commit;

analyze public.enrollment;
analyze public.membership;

select count(*) as bulk_rows from public.enrollment e join auth.users u on u.id = e.user_id where u.email like 'perf-student-%';
select count(*) as total_enrollments, count(distinct workspace_id) as workspaces_with_enrollments from public.enrollment;
select count(*) as membership_rows from public.membership;
select workspace_id, count(*) from public.enrollment group by 1 order by 2 desc, 1 limit 3;

do $$
declare
  bulk bigint;
  ws int;
begin
  select count(*), count(distinct e.workspace_id) into bulk, ws
  from public.enrollment e join auth.users u on u.id = e.user_id where u.email like 'perf-student-%';
  if bulk <> 10000 or ws <> 20 then
    raise exception 'PERF SEED FAIL: bulk=% workspaces=%', bulk, ws;
  end if;
  raise notice 'PERF SEED OK: 10000 enrollments across 20 workspaces';
end
$$;
