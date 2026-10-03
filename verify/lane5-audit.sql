-- Lane 5: authenticated cannot delete or update audit_event.
\pset pager off
select count(*) as audit_rows_before from public.audit_event;
select r as role, p as privilege, has_table_privilege(r, 'public.audit_event', p) as granted
from unnest(array['anon', 'authenticated', 'service_role']) r
cross join unnest(array['select', 'insert', 'update', 'delete', 'truncate']) p
order by 1, 2;

\set ON_ERROR_STOP 0
begin;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000a1", "role": "authenticated"}', true);
set local role authenticated;
select current_user, auth.uid();
\echo '--- raw delete (expected: permission denied) ---'
delete from public.audit_event;
rollback;
begin;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000a1", "role": "authenticated"}', true);
set local role authenticated;
\echo '--- raw update (expected: permission denied) ---'
update public.audit_event set action = 'tampered';
rollback;
begin;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000a1", "role": "authenticated"}', true);
set local role authenticated;
\echo '--- informational: select and insert as authenticated ---'
select count(*) from public.audit_event;
rollback;
begin;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000a1", "role": "authenticated"}', true);
set local role authenticated;
insert into public.audit_event (workspace_id, action) values ('a0000000-0000-4000-8000-000000000000', 'lane5');
rollback;
\set ON_ERROR_STOP 1

begin;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000a1", "role": "authenticated"}', true);
set local role authenticated;
do $$
declare
  ok_delete boolean := false;
  ok_update boolean := false;
begin
  begin
    delete from public.audit_event;
  exception when insufficient_privilege then
    ok_delete := true;
    raise notice 'delete denied: % %', sqlstate, sqlerrm;
  end;
  begin
    update public.audit_event set action = 'tampered';
  exception when insufficient_privilege then
    ok_update := true;
    raise notice 'update denied: % %', sqlstate, sqlerrm;
  end;
  if ok_delete and ok_update then
    raise notice 'LANE5 PASS: delete and update on audit_event are permission denied for authenticated';
  else
    raise exception 'LANE5 FAIL: delete_denied=% update_denied=%', ok_delete, ok_update;
  end if;
end
$$;
rollback;

select count(*) as audit_rows_after from public.audit_event;
