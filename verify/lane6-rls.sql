-- Lane 6: every public table has row-level security enabled.
\pset pager off
\echo '--- public tables and their RLS flags ---'
select c.relname, c.relrowsecurity, c.relforcerowsecurity
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind in ('r', 'p')
order by 1;

\echo '--- public tables with RLS off (expected: none) ---'
select c.relname
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity = false;

do $$
declare
  bad text;
  total int;
begin
  select count(*) into total
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r';
  select string_agg(c.relname, ', ') into bad
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind in ('r', 'p') and c.relrowsecurity = false;
  if total = 0 then
    raise exception 'LANE6 FAIL: no public tables found';
  elsif bad is not null then
    raise exception 'LANE6 FAIL: RLS off on %', bad;
  end if;
  raise notice 'LANE6 PASS: 0 of % public tables have RLS off', total;
end
$$;
