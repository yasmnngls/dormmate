-- Lane 3: staff A (manager of workspace A) inserts a property into workspace B; must be rejected.
\pset pager off
\set ON_ERROR_STOP 0
begin;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000a1", "role": "authenticated"}', true);
set local role authenticated;
select current_user, auth.uid();
\echo '--- raw insert into workspace B (expected: error) ---'
insert into public.property (workspace_id, name) values ('b0000000-0000-4000-8000-000000000000', 'Lane3 smuggled') returning id;
rollback;
\set ON_ERROR_STOP 1

begin;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000a1", "role": "authenticated"}', true);
set local role authenticated;
do $$
begin
  begin
    insert into public.property (workspace_id, name) values ('a0000000-0000-4000-8000-000000000000', 'Lane3 control');
    raise notice 'control: insert into own workspace A accepted';
  exception when others then
    raise exception 'LANE3 FAIL: control insert into workspace A rejected (% %), lane cannot distinguish', sqlstate, sqlerrm;
  end;
  begin
    insert into public.property (workspace_id, name) values ('b0000000-0000-4000-8000-000000000000', 'Lane3 smuggled');
    raise exception using errcode = 'P0001', message = 'LANE3 FAIL: cross-workspace insert was accepted';
  exception
    when insufficient_privilege then
      raise notice 'LANE3 PASS: cross-workspace insert rejected, sqlstate % (%)', sqlstate, sqlerrm;
  end;
end
$$;
rollback;

select count(*) as smuggled_rows_after from public.property where name like 'Lane3%';
