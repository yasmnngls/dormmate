-- Tenancy rule: every workspace-owned row carries workspace_id, and every child
-- references its parent through (workspace_id, parent_id), so a row can never
-- point at another workspace's data. RLS then only has to filter on workspace_id.

create schema private;
revoke all on schema private from public;
grant usage on schema private to authenticated, service_role;

create type public.workspace_tier as enum ('trial', 'standard', 'campus', 'enterprise');
-- Declared in ascending privilege so policies can compare with >=.
create type public.membership_role as enum ('staff', 'manager', 'owner');
create type public.gender_policy as enum ('female', 'male', 'any');
create type public.gender as enum ('female', 'male', 'undisclosed');
create type public.habit_category as enum (
  'sleep', 'wake', 'cleanliness', 'noise', 'guests',
  'study', 'schedule', 'smoking', 'social', 'location'
);
create type public.cycle_kind as enum ('term', 'rolling');
create type public.cycle_status as enum ('draft', 'open', 'closed', 'published');
create type public.enrollment_status as enum ('pending', 'approved', 'rejected', 'placed', 'moved_out');
create type public.match_mode as enum ('batch', 'open_bed');
create type public.match_status as enum ('queued', 'running', 'ready', 'published', 'failed');
create type public.chat_thread_kind as enum ('room', 'request_group');
create type public.report_status as enum ('open', 'escalated', 'resolved');

create table public.workspace (
  id uuid primary key default gen_random_uuid(),
  name text not null check (btrim(name) <> ''),
  logo_path text,
  tier public.workspace_tier not null default 'trial',
  trial_started_at timestamptz not null default now(),
  trial_ends_at timestamptz not null default now() + interval '60 days',
  first_published_at timestamptz,
  created_at timestamptz not null default now(),
  check (trial_ends_at > trial_started_at)
);

create table public.membership (
  workspace_id uuid not null references public.workspace on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  role public.membership_role not null,
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);
create index membership_user_idx on public.membership (user_id, role);

create table public.property (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspace on delete cascade,
  name text not null check (btrim(name) <> ''),
  created_at timestamptz not null default now(),
  unique (workspace_id, id)
);

create table public.building (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  property_id uuid not null,
  name text not null check (btrim(name) <> ''),
  created_at timestamptz not null default now(),
  unique (workspace_id, id),
  unique (property_id, id),
  foreign key (workspace_id, property_id) references public.property (workspace_id, id) on delete cascade
);
create index building_property_idx on public.building (workspace_id, property_id);

create table public.room (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  property_id uuid not null,
  building_id uuid,
  label text not null check (btrim(label) <> ''),
  capacity smallint not null check (capacity between 2 and 4),
  gender_policy public.gender_policy not null,
  created_at timestamptz not null default now(),
  unique (workspace_id, id),
  foreign key (workspace_id, property_id) references public.property (workspace_id, id) on delete cascade,
  foreign key (property_id, building_id) references public.building (property_id, id) on delete cascade
);
create index room_property_idx on public.room (workspace_id, property_id);
create index room_building_idx on public.room (property_id, building_id);

create table public.bed (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  room_id uuid not null,
  label text not null check (btrim(label) <> ''),
  created_at timestamptz not null default now(),
  unique (workspace_id, id),
  unique (room_id, label),
  foreign key (workspace_id, room_id) references public.room (workspace_id, id) on delete cascade
);
create index bed_room_idx on public.bed (workspace_id, room_id);

create table public.questionnaire_version (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspace on delete cascade,
  questions jsonb not null default '[]',
  created_at timestamptz not null default now(),
  unique (workspace_id, id)
);

create table public.cycle (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  questionnaire_version_id uuid not null,
  name text not null check (btrim(name) <> ''),
  kind public.cycle_kind not null,
  status public.cycle_status not null default 'draft',
  deadline timestamptz,
  weights jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique (workspace_id, id),
  foreign key (workspace_id) references public.workspace on delete cascade,
  foreign key (workspace_id, questionnaire_version_id) references public.questionnaire_version (workspace_id, id)
);
create index cycle_questionnaire_idx on public.cycle (workspace_id, questionnaire_version_id);

create table public.invite (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  cycle_id uuid not null unique,
  code text not null unique check (length(code) >= 8),
  rotated_at timestamptz,
  created_at timestamptz not null default now(),
  foreign key (workspace_id, cycle_id) references public.cycle (workspace_id, id) on delete cascade
);
create index invite_cycle_idx on public.invite (workspace_id, cycle_id);

create table public.enrollment (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  cycle_id uuid not null,
  user_id uuid not null references auth.users on delete cascade,
  status public.enrollment_status not null default 'pending',
  birthdate date,
  gender public.gender,
  guardian_consent_on date,
  consent_version text,
  on_roster boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, cycle_id),
  unique (workspace_id, id),
  unique (cycle_id, id),
  foreign key (workspace_id, cycle_id) references public.cycle (workspace_id, id) on delete cascade
);
create index enrollment_cycle_idx on public.enrollment (workspace_id, cycle_id);

create table public.profile_version (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  enrollment_id uuid not null,
  answers jsonb not null,
  deal_breakers public.habit_category[] not null default '{}',
  importance jsonb not null default '{}',
  created_at timestamptz not null default now(),
  foreign key (workspace_id, enrollment_id) references public.enrollment (workspace_id, id) on delete cascade
);
create index profile_version_enrollment_idx on public.profile_version (workspace_id, enrollment_id, created_at desc);

create table public.roommate_request (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  cycle_id uuid not null,
  from_enrollment uuid not null,
  to_email text not null check (to_email = lower(to_email) and position('@' in to_email) > 1),
  to_enrollment uuid,
  created_at timestamptz not null default now(),
  unique (from_enrollment, to_email),
  check (from_enrollment <> to_enrollment),
  foreign key (workspace_id, cycle_id) references public.cycle (workspace_id, id) on delete cascade,
  foreign key (cycle_id, from_enrollment) references public.enrollment (cycle_id, id) on delete cascade,
  foreign key (cycle_id, to_enrollment) references public.enrollment (cycle_id, id) on delete cascade
);
create index roommate_request_cycle_idx on public.roommate_request (workspace_id, cycle_id);
create index roommate_request_to_idx on public.roommate_request (cycle_id, to_enrollment);

create table public.match_run (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  cycle_id uuid not null,
  mode public.match_mode not null,
  room_id uuid,
  engine_version text not null,
  inputs_hash text,
  weights jsonb not null,
  status public.match_status not null default 'queued',
  step text,
  timings jsonb not null default '{}',
  created_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now(),
  unique (workspace_id, id),
  check ((mode = 'open_bed') = (room_id is not null)),
  foreign key (workspace_id, cycle_id) references public.cycle (workspace_id, id) on delete cascade,
  foreign key (workspace_id, room_id) references public.room (workspace_id, id) on delete cascade
);
create index match_run_cycle_idx on public.match_run (workspace_id, cycle_id);
create index match_run_room_idx on public.match_run (workspace_id, room_id);

create table public.placement (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  run_id uuid not null,
  enrollment_id uuid not null,
  bed_id uuid not null,
  score numeric(5, 2) check (score between 0 and 100),
  reasons jsonb not null default '{}',
  locked boolean not null default false,
  overridden_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now(),
  unique (run_id, enrollment_id),
  unique (run_id, bed_id),
  foreign key (workspace_id, run_id) references public.match_run (workspace_id, id) on delete cascade,
  foreign key (workspace_id, enrollment_id) references public.enrollment (workspace_id, id) on delete cascade,
  foreign key (workspace_id, bed_id) references public.bed (workspace_id, id) on delete cascade
);
create index placement_run_idx on public.placement (workspace_id, run_id);
create index placement_enrollment_idx on public.placement (workspace_id, enrollment_id);
create index placement_bed_idx on public.placement (workspace_id, bed_id);

create table public.occupancy (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  bed_id uuid not null,
  enrollment_id uuid not null,
  started_on date not null,
  ended_on date,
  created_at timestamptz not null default now(),
  check (ended_on is null or ended_on >= started_on),
  foreign key (workspace_id, bed_id) references public.bed (workspace_id, id) on delete cascade,
  foreign key (workspace_id, enrollment_id) references public.enrollment (workspace_id, id) on delete cascade
);
create index occupancy_bed_idx on public.occupancy (workspace_id, bed_id);
create index occupancy_enrollment_idx on public.occupancy (workspace_id, enrollment_id);
create unique index occupancy_current_bed_idx on public.occupancy (bed_id) where ended_on is null;
create unique index occupancy_current_enrollment_idx on public.occupancy (enrollment_id) where ended_on is null;

create table public.chat_thread (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspace on delete cascade,
  kind public.chat_thread_kind not null,
  room_id uuid,
  created_at timestamptz not null default now(),
  unique (workspace_id, id),
  check ((kind = 'room') = (room_id is not null)),
  foreign key (workspace_id, room_id) references public.room (workspace_id, id) on delete cascade
);
create index chat_thread_room_idx on public.chat_thread (workspace_id, room_id);

create table public.message (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  thread_id uuid not null,
  sender_id uuid references auth.users on delete set null,
  body text not null check (length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  unique (workspace_id, id),
  foreign key (workspace_id, thread_id) references public.chat_thread (workspace_id, id) on delete cascade
);
create index message_thread_idx on public.message (workspace_id, thread_id, created_at);

create table public.report (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  message_id uuid not null,
  reporter_id uuid references auth.users on delete set null,
  reason text not null check (btrim(reason) <> ''),
  status public.report_status not null default 'open',
  assignee_id uuid references auth.users on delete set null,
  resolution_note text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  check ((status = 'resolved') = (resolved_at is not null)),
  foreign key (workspace_id, message_id) references public.message (workspace_id, id) on delete cascade
);
create index report_message_idx on public.report (workspace_id, message_id);

create table public.block (
  workspace_id uuid not null references public.workspace on delete cascade,
  blocker_id uuid not null references auth.users on delete cascade,
  blocked_id uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  primary key (workspace_id, blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create table public.audit_event (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspace,
  actor_id uuid references auth.users on delete set null,
  action text not null check (btrim(action) <> ''),
  target text,
  payload jsonb not null default '{}',
  at timestamptz not null default now()
);
create index audit_event_workspace_idx on public.audit_event (workspace_id, at desc);

create table public.push_subscription (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  endpoint text not null unique,
  keys jsonb not null,
  created_at timestamptz not null default now()
);
create index push_subscription_user_idx on public.push_subscription (user_id);

-- Policy helpers. Security definer so membership and enrollment policies can
-- read those tables without recursing into their own RLS. Policies call them
-- as (select private.fn()) so Postgres evaluates them once per statement.

create function private.staff_workspaces(min_role public.membership_role)
returns uuid[]
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(array_agg(m.workspace_id), '{}')
  from public.membership m
  where m.user_id = auth.uid() and m.role >= min_role
$$;

create function private.my_enrollments()
returns uuid[]
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(array_agg(e.id), '{}')
  from public.enrollment e
  where e.user_id = auth.uid()
$$;

create function private.my_cycles()
returns uuid[]
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(array_agg(e.cycle_id), '{}')
  from public.enrollment e
  where e.user_id = auth.uid()
$$;

create function private.student_workspaces()
returns uuid[]
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(array_agg(distinct e.workspace_id), '{}')
  from public.enrollment e
  where e.user_id = auth.uid()
$$;

revoke all on all functions in schema private from public, anon;
grant execute on all functions in schema private to authenticated, service_role;

alter table public.workspace enable row level security;
alter table public.membership enable row level security;
alter table public.property enable row level security;
alter table public.building enable row level security;
alter table public.room enable row level security;
alter table public.bed enable row level security;
alter table public.questionnaire_version enable row level security;
alter table public.cycle enable row level security;
alter table public.invite enable row level security;
alter table public.enrollment enable row level security;
alter table public.profile_version enable row level security;
alter table public.roommate_request enable row level security;
alter table public.match_run enable row level security;
alter table public.placement enable row level security;
alter table public.occupancy enable row level security;
alter table public.chat_thread enable row level security;
alter table public.message enable row level security;
alter table public.report enable row level security;
alter table public.block enable row level security;
alter table public.audit_event enable row level security;
alter table public.push_subscription enable row level security;

-- Message bodies stay hidden from staff until chat decides how reports expose
-- them. Write policies never cover select, so each audience has exactly one
-- read path and dropping it is visible to the isolation tests.
do $$
declare
  t text;
  manager text := 'workspace_id = any ((select private.staff_workspaces(''manager''))::uuid[])';
begin
  foreach t in array array[
    'property', 'building', 'room', 'bed', 'questionnaire_version', 'cycle',
    'invite', 'enrollment', 'profile_version', 'roommate_request', 'match_run',
    'placement', 'occupancy', 'chat_thread', 'report', 'block'
  ] loop
    execute format(
      'create policy staff_read on public.%I for select to authenticated
         using (workspace_id = any ((select private.staff_workspaces(''staff''))::uuid[]))',
      t
    );
  end loop;

  foreach t in array array[
    'property', 'building', 'room', 'bed', 'questionnaire_version', 'cycle',
    'invite', 'enrollment', 'match_run', 'placement', 'occupancy', 'chat_thread'
  ] loop
    execute format('create policy manager_insert on public.%I for insert to authenticated with check (%s)', t, manager);
    execute format('create policy manager_update on public.%I for update to authenticated using (%s) with check (%s)', t, manager, manager);
    execute format('create policy manager_delete on public.%I for delete to authenticated using (%s)', t, manager);
  end loop;
end
$$;

create policy staff_handle on public.report for update to authenticated
  using (workspace_id = any ((select private.staff_workspaces('staff'))::uuid[]))
  with check (workspace_id = any ((select private.staff_workspaces('staff'))::uuid[]));

create policy member_read on public.workspace for select to authenticated
  using (
    id = any ((select private.staff_workspaces('staff'))::uuid[])
    or id = any ((select private.student_workspaces())::uuid[])
  );

create policy owner_update on public.workspace for update to authenticated
  using (id = any ((select private.staff_workspaces('owner'))::uuid[]))
  with check (id = any ((select private.staff_workspaces('owner'))::uuid[]));

create policy staff_read on public.membership for select to authenticated
  using (workspace_id = any ((select private.staff_workspaces('staff'))::uuid[]));

create policy owner_insert on public.membership for insert to authenticated
  with check (workspace_id = any ((select private.staff_workspaces('owner'))::uuid[]));

create policy owner_update on public.membership for update to authenticated
  using (workspace_id = any ((select private.staff_workspaces('owner'))::uuid[]))
  with check (workspace_id = any ((select private.staff_workspaces('owner'))::uuid[]));

create policy owner_delete on public.membership for delete to authenticated
  using (workspace_id = any ((select private.staff_workspaces('owner'))::uuid[]));

create policy student_read on public.cycle for select to authenticated
  using (id = any ((select private.my_cycles())::uuid[]));

create policy student_read on public.questionnaire_version for select to authenticated
  using (
    exists (
      select 1 from public.cycle c
      where c.questionnaire_version_id = questionnaire_version.id
        and c.id = any ((select private.my_cycles())::uuid[])
    )
  );

create policy student_read on public.enrollment for select to authenticated
  using (user_id = (select auth.uid()));

create policy student_read on public.profile_version for select to authenticated
  using (enrollment_id = any ((select private.my_enrollments())::uuid[]));

create policy student_insert on public.profile_version for insert to authenticated
  with check (enrollment_id = any ((select private.my_enrollments())::uuid[]));

create policy student_read on public.roommate_request for select to authenticated
  using (
    from_enrollment = any ((select private.my_enrollments())::uuid[])
    or to_enrollment = any ((select private.my_enrollments())::uuid[])
  );

create policy student_insert on public.roommate_request for insert to authenticated
  with check (from_enrollment = any ((select private.my_enrollments())::uuid[]));

create policy student_delete on public.roommate_request for delete to authenticated
  using (from_enrollment = any ((select private.my_enrollments())::uuid[]));

create policy student_read on public.occupancy for select to authenticated
  using (enrollment_id = any ((select private.my_enrollments())::uuid[]));

create policy owner_all on public.push_subscription for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

revoke update, delete, truncate on public.profile_version from anon, authenticated;

revoke all on public.audit_event from anon, authenticated, service_role;
grant insert on public.audit_event to service_role;
