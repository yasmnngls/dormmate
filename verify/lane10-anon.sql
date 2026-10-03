-- Lane 10: anon reads workspace; must return 0 rows.
\pset pager off
select count(*) as workspace_rows_as_postgres from public.workspace;
select has_table_privilege('anon', 'public.workspace', 'select') as anon_has_select_grant;

\set ON_ERROR_STOP 0
begin;
select set_config('request.jwt.claims', '{"role": "anon"}', true);
set local role anon;
select current_user, auth.uid();
\echo '--- raw select as anon ---'
select * from public.workspace;
rollback;
\set ON_ERROR_STOP 1

begin;
select set_config('request.jwt.claims', '{"role": "anon"}', true);
set local role anon;
do $$
declare
  n bigint;
begin
  begin
    select count(*) into n from public.workspace;
  exception when others then
    raise exception 'LANE10 FAIL: anon select errored instead of returning 0 rows: % %', sqlstate, sqlerrm;
  end;
  if n = 0 then
    raise notice 'LANE10 PASS: anon select on workspace returned 0 rows, no error';
  else
    raise exception 'LANE10 FAIL: anon saw % workspace rows', n;
  end if;
end
$$;
rollback;
