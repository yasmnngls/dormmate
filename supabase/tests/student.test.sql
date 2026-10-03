begin;
create extension if not exists pgtap with schema extensions;

select plan(10);

insert into auth.users (id, aud, role, email)
values ('00000000-0000-4000-8000-0000000000a4', 'authenticated', 'authenticated', 'peer-a@dormmate.test');

with peer as (
  insert into public.enrollment (workspace_id, cycle_id, user_id, status)
  select workspace_id, cycle_id, '00000000-0000-4000-8000-0000000000a4', 'approved'
  from public.enrollment
  where user_id = '00000000-0000-4000-8000-0000000000a2'
  returning id, workspace_id
)
insert into public.profile_version (workspace_id, enrollment_id, answers)
select workspace_id, id, '{"sleep": {"kind": "minutes", "value": 1320}}' from peer;

select set_config(
  'tests.own_enrollment',
  (select id::text from public.enrollment where user_id = '00000000-0000-4000-8000-0000000000a2'),
  true
);
select set_config(
  'tests.peer_enrollment',
  (select id::text from public.enrollment where user_id = '00000000-0000-4000-8000-0000000000a4'),
  true
);

select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000a2", "role": "authenticated"}', true);
set local role authenticated;

select results_eq(
  $$select enrollment_id from public.profile_version$$,
  array[current_setting('tests.own_enrollment')::uuid],
  'student A reads exactly their own profile_version row'
);

select is(
  (select count(*)::int from public.profile_version where enrollment_id = current_setting('tests.peer_enrollment')::uuid),
  0,
  'student A cannot read a same-workspace peer''s profile_version'
);

select results_eq(
  $$select id from public.enrollment$$,
  array[current_setting('tests.own_enrollment')::uuid],
  'student A reads only their own enrollment'
);

select lives_ok(
  format(
    $$insert into public.profile_version (workspace_id, enrollment_id, answers)
      values ('a0000000-0000-4000-8000-000000000000', %L, '{"sleep": {"kind": "minutes", "value": 1350}}')$$,
    current_setting('tests.own_enrollment')
  ),
  'student A can append a profile_version to their own enrollment'
);

select is(
  (select count(*)::int from public.profile_version),
  2,
  'student A now reads both of their own versions'
);

select throws_ok(
  format(
    $$insert into public.profile_version (workspace_id, enrollment_id, answers)
      values ('a0000000-0000-4000-8000-000000000000', %L, '{}')$$,
    current_setting('tests.peer_enrollment')
  ),
  '42501',
  null,
  'student A cannot write a profile_version for a peer'
);

select throws_ok(
  $$update public.profile_version set answers = '{}'$$,
  '42501',
  null,
  'profile_version rows cannot be updated'
);

select throws_ok(
  $$delete from public.profile_version$$,
  '42501',
  null,
  'profile_version rows cannot be deleted'
);

select is_empty(
  $$select id from public.placement$$,
  'student A reads no placement proposals'
);

select is_empty(
  $$select id from public.match_run$$,
  'student A reads no match runs'
);

select * from finish();
rollback;
