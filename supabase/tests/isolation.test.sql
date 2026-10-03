begin;
create extension if not exists pgtap with schema extensions;

create schema tests;
grant usage on schema tests to authenticated, anon;

create function tests.workspace_tables() returns setof text language sql stable as $$
  select c.relname::text
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind = 'r'
    and has_table_privilege('authenticated', c.oid, 'select')
    and (
      c.relname = 'workspace'
      or exists (
        select 1 from pg_attribute a
        where a.attrelid = c.oid and a.attname = 'workspace_id' and not a.attisdropped
      )
    )
  order by 1
$$;

create function tests.rows_in(tbl text, ws uuid) returns bigint language plpgsql as $$
declare
  n bigint;
begin
  execute format(
    'select count(*) from public.%I where %I = $1',
    tbl,
    case tbl when 'workspace' then 'id' else 'workspace_id' end
  ) into n using ws;
  return n;
end
$$;

create function tests.act_as(uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
end
$$;

insert into auth.users (id, aud, role, email)
values ('00000000-0000-4000-8000-0000000000a3', 'authenticated', 'authenticated', 'viewer-a@dormmate.test');
insert into public.membership (workspace_id, user_id, role)
values ('a0000000-0000-4000-8000-000000000000', '00000000-0000-4000-8000-0000000000a3', 'staff');

select plan((select 4 * count(*)::int - 1 from tests.workspace_tables()) + 11);

select ok(
  tests.rows_in(t, 'b0000000-0000-4000-8000-000000000000') > 0,
  format('seed has workspace B rows in %s', t)
)
from tests.workspace_tables() t;

select is_empty(
  $$
    select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity
  $$,
  'every public table has row-level security on'
);

select is_empty(
  $$
    select tablename, policyname from pg_policies
    where schemaname = 'public' and cmd = 'ALL' and tablename <> 'push_subscription'
  $$,
  'write policies never double as a read path'
);

select is(
  (select count(*)::int from pg_proc where pronamespace = 'private'::regnamespace),
  4,
  'private schema holds the four policy helpers'
);

select is_empty(
  $$
    select proname from pg_proc
    where pronamespace = 'private'::regnamespace
      and not (prosecdef and proconfig @> array['search_path=""'])
  $$,
  'every private helper is security definer with an empty search_path'
);

select tests.act_as('00000000-0000-4000-8000-0000000000a1');

select is(
  tests.rows_in(t, 'b0000000-0000-4000-8000-000000000000'),
  0::bigint,
  format('staff A reads 0 workspace B rows in %s', t)
)
from tests.workspace_tables() t;

-- Positive control: without it, a dropped staff policy would still pass the
-- zero-row checks above. message bodies are deliberately hidden from staff.
select ok(
  tests.rows_in(t, 'a0000000-0000-4000-8000-000000000000') > 0,
  format('staff A reads their own workspace rows in %s', t)
)
from tests.workspace_tables() t
where t <> 'message';

select throws_ok(
  $$insert into public.property (workspace_id, name) values ('b0000000-0000-4000-8000-000000000000', 'Smuggled')$$,
  '42501',
  null,
  'manager A cannot insert a property into workspace B'
);

select lives_ok(
  $$insert into public.property (workspace_id, name) values ('a0000000-0000-4000-8000-000000000000', 'Annex')$$,
  'manager A can insert a property into workspace A'
);

select throws_ok(
  $$update public.room set workspace_id = 'b0000000-0000-4000-8000-000000000000' where workspace_id = 'a0000000-0000-4000-8000-000000000000'$$,
  null,
  null,
  'manager A cannot move a room into workspace B'
);

reset role;
select tests.act_as('00000000-0000-4000-8000-0000000000a3');

select throws_ok(
  $$insert into public.property (workspace_id, name) values ('a0000000-0000-4000-8000-000000000000', 'Unapproved')$$,
  '42501',
  null,
  'staff role cannot write properties in its own workspace'
);

reset role;
select tests.act_as('00000000-0000-4000-8000-0000000000a2');

select is(
  tests.rows_in(t, 'b0000000-0000-4000-8000-000000000000'),
  0::bigint,
  format('student A reads 0 workspace B rows in %s', t)
)
from tests.workspace_tables() t;

select is(
  (select count(*)::int from public.membership),
  0,
  'student A reads no membership rows'
);

reset role;
set local role anon;

select is(
  (select count(*)::int from public.workspace),
  0,
  'anon reads 0 workspace rows'
);

select is(
  (select count(*)::int from public.enrollment),
  0,
  'anon reads 0 enrollment rows'
);

select * from finish();
rollback;
