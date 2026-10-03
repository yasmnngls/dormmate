-- Two tenants with one row in every workspace table, so isolation tests have
-- something to leak. Workspace and user ids are fixed; tests refer to them.

insert into auth.users (
  id, instance_id, aud, role, email, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
select
  id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', email, now(),
  '{"provider": "email", "providers": ["email"]}', '{}', now(), now()
from (values
  ('00000000-0000-4000-8000-0000000000a1'::uuid, 'staff-a@dormmate.test'),
  ('00000000-0000-4000-8000-0000000000a2'::uuid, 'student-a@dormmate.test'),
  ('00000000-0000-4000-8000-0000000000b1'::uuid, 'staff-b@dormmate.test'),
  ('00000000-0000-4000-8000-0000000000b2'::uuid, 'student-b@dormmate.test')
) as u (id, email);

insert into public.workspace (id, name) values
  ('a0000000-0000-4000-8000-000000000000', 'Dorm A'),
  ('b0000000-0000-4000-8000-000000000000', 'Dorm B');

do $$
declare
  ws record;
  property_id uuid;
  building_id uuid;
  room_id uuid;
  bed_id uuid;
  questionnaire_id uuid;
  cycle_id uuid;
  enrollment_id uuid;
  run_id uuid;
  thread_id uuid;
  message_id uuid;
begin
  for ws in
    select * from (values
      ('a0000000-0000-4000-8000-000000000000'::uuid, '00000000-0000-4000-8000-0000000000a1'::uuid, '00000000-0000-4000-8000-0000000000a2'::uuid, 'a'),
      ('b0000000-0000-4000-8000-000000000000'::uuid, '00000000-0000-4000-8000-0000000000b1'::uuid, '00000000-0000-4000-8000-0000000000b2'::uuid, 'b')
    ) as v (id, staff, student, tag)
  loop
    insert into public.membership (workspace_id, user_id, role) values (ws.id, ws.staff, 'manager');

    insert into public.property (workspace_id, name) values (ws.id, 'Main hall ' || ws.tag)
      returning id into property_id;
    insert into public.building (workspace_id, property_id, name) values (ws.id, property_id, 'North wing')
      returning id into building_id;
    insert into public.room (workspace_id, property_id, building_id, label, capacity, gender_policy)
      values (ws.id, property_id, building_id, '101', 2, 'any')
      returning id into room_id;
    insert into public.bed (workspace_id, room_id, label) values (ws.id, room_id, 'A')
      returning id into bed_id;

    insert into public.questionnaire_version (workspace_id, questions)
      values (ws.id, '["sleep", "wake", "cleanliness", "noise"]')
      returning id into questionnaire_id;
    insert into public.cycle (workspace_id, questionnaire_version_id, name, kind, status, deadline)
      values (ws.id, questionnaire_id, 'Term 1', 'term', 'open', now() + interval '30 days')
      returning id into cycle_id;
    insert into public.invite (workspace_id, cycle_id, code) values (ws.id, cycle_id, 'join-' || ws.tag || '-0001');

    insert into public.enrollment (workspace_id, cycle_id, user_id, status, birthdate, gender, consent_version)
      values (ws.id, cycle_id, ws.student, 'placed', '2006-05-01', 'female', 'v1')
      returning id into enrollment_id;
    insert into public.profile_version (workspace_id, enrollment_id, answers, deal_breakers, importance)
      values (ws.id, enrollment_id, '{"sleep": {"kind": "minutes", "value": 1380}}', '{smoking}', '{"sleep": 3}');
    insert into public.roommate_request (workspace_id, cycle_id, from_enrollment, to_email)
      values (ws.id, cycle_id, enrollment_id, 'friend-' || ws.tag || '@dormmate.test');

    insert into public.match_run (workspace_id, cycle_id, mode, engine_version, weights, status, created_by)
      values (ws.id, cycle_id, 'batch', '0.1.0', '{}', 'published', ws.staff)
      returning id into run_id;
    insert into public.placement (workspace_id, run_id, enrollment_id, bed_id, score, reasons)
      values (ws.id, run_id, enrollment_id, bed_id, 82.5, '{"top": ["sleep"], "weakest": "guests"}');
    insert into public.occupancy (workspace_id, bed_id, enrollment_id, started_on)
      values (ws.id, bed_id, enrollment_id, current_date);

    insert into public.chat_thread (workspace_id, kind, room_id) values (ws.id, 'room', room_id)
      returning id into thread_id;
    insert into public.message (workspace_id, thread_id, sender_id, body)
      values (ws.id, thread_id, ws.student, 'Hello roommate')
      returning id into message_id;
    insert into public.report (workspace_id, message_id, reporter_id, reason)
      values (ws.id, message_id, ws.student, 'Test report');
    insert into public.block (workspace_id, blocker_id, blocked_id) values (ws.id, ws.student, ws.staff);

    insert into public.audit_event (workspace_id, actor_id, action, target, payload)
      values (ws.id, ws.staff, 'run.published', 'match_run:' || run_id, '{}');
  end loop;
end
$$;
