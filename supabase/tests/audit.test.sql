begin;
create extension if not exists pgtap with schema extensions;

select plan(10);

select table_privs_are('public', 'audit_event', 'authenticated', array[]::text[], 'authenticated holds no privilege on audit_event');
select table_privs_are('public', 'audit_event', 'anon', array[]::text[], 'anon holds no privilege on audit_event');
select table_privs_are('public', 'audit_event', 'service_role', array['INSERT'], 'service_role may only insert into audit_event');

select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000a1", "role": "authenticated"}', true);
set local role authenticated;

select throws_ok(
  $$update public.audit_event set action = 'tampered'$$,
  '42501',
  null,
  'authenticated cannot update audit_event'
);

select throws_ok(
  $$delete from public.audit_event$$,
  '42501',
  null,
  'authenticated cannot delete audit_event'
);

select throws_ok(
  $$insert into public.audit_event (workspace_id, action) values ('a0000000-0000-4000-8000-000000000000', 'forged')$$,
  '42501',
  null,
  'authenticated cannot insert audit_event'
);

select throws_ok(
  $$select * from public.audit_event$$,
  '42501',
  null,
  'authenticated cannot read audit_event'
);

reset role;
set local role service_role;

select lives_ok(
  $$insert into public.audit_event (workspace_id, action) values ('a0000000-0000-4000-8000-000000000000', 'run.started')$$,
  'service_role can append an audit event'
);

select throws_ok(
  $$update public.audit_event set action = 'tampered'$$,
  '42501',
  null,
  'service_role cannot update audit_event'
);

select throws_ok(
  $$delete from public.audit_event$$,
  '42501',
  null,
  'service_role cannot delete audit_event'
);

select * from finish();
rollback;
