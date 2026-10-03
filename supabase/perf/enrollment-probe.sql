begin;

create temp table perf_staff as
select gen_random_uuid() as workspace_id, gen_random_uuid() as user_id, g as n
from generate_series(1, 20) g;

insert into public.workspace (id, name) select workspace_id, 'Perf ' || n from perf_staff;
insert into auth.users (id, aud, role, email)
select user_id, 'authenticated', 'authenticated', 'perf-staff-' || n || '@dormmate.test' from perf_staff;
insert into public.membership (workspace_id, user_id, role) select workspace_id, user_id, 'manager' from perf_staff;

with q as (
  insert into public.questionnaire_version (workspace_id) select workspace_id from perf_staff
  returning id, workspace_id
)
insert into public.cycle (workspace_id, questionnaire_version_id, name, kind)
select workspace_id, id, 'Perf term', 'term' from q;

create temp table perf_student as
select gen_random_uuid() as user_id, c.workspace_id, c.id as cycle_id, g as n
from public.cycle c
join perf_staff s on s.workspace_id = c.workspace_id
cross join generate_series(1, 500) g;

insert into auth.users (id, aud, role, email)
select user_id, 'authenticated', 'authenticated', 'perf-student-' || user_id || '@dormmate.test' from perf_student;
insert into public.enrollment (workspace_id, cycle_id, user_id, status)
select workspace_id, cycle_id, user_id, 'approved' from perf_student;

analyze public.enrollment;
analyze public.membership;

select count(*) as seeded_enrollments, count(distinct workspace_id) as seeded_workspaces from public.enrollment;

select set_config('request.jwt.claims', json_build_object('sub', user_id, 'role', 'authenticated')::text, true)
from perf_staff where n = 1;
set local role authenticated;

select count(*) as visible_to_staff_a from public.enrollment;

explain (analyze, buffers) select * from public.enrollment;
explain (analyze, buffers) select * from public.enrollment;
explain (analyze, buffers) select * from public.enrollment;
explain (analyze, buffers) select * from public.enrollment;
explain (analyze, buffers) select * from public.enrollment;

rollback;
