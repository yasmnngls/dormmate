-- Lane 1 (head): seeded row counts per workspace for every workspace-owned table.
\pset pager off
create temp table lane1 (tbl text, ws_a bigint, ws_b bigint);

do $$
declare
  t text;
  col text;
  a bigint;
  b bigint;
begin
  for t, col in
    select c.relname::text, case when c.relname = 'workspace' then 'id' else 'workspace_id' end
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r'
      and (c.relname = 'workspace' or exists (
        select 1 from pg_attribute at where at.attrelid = c.oid and at.attname = 'workspace_id' and not at.attisdropped))
    order by 1
  loop
    execute format('select count(*) filter (where %1$I = $1), count(*) filter (where %1$I = $2) from public.%2$I', col, t)
      into a, b using 'a0000000-0000-4000-8000-000000000000'::uuid, 'b0000000-0000-4000-8000-000000000000'::uuid;
    insert into lane1 values (t, a, b);
  end loop;
end
$$;

select * from lane1 order by tbl;
select count(*) as auth_users_seeded from auth.users where email like '%@dormmate.test';

do $$
declare
  bad text;
  n int;
begin
  select count(*) into n from lane1;
  select string_agg(tbl, ', ') into bad from lane1 where ws_a = 0 or ws_b = 0;
  if n = 0 then
    raise exception 'LANE1 FAIL: no workspace tables found';
  elsif bad is not null then
    raise exception 'LANE1 FAIL: tables with no seed rows for a workspace: %', bad;
  end if;
  raise notice 'LANE1 PASS: % workspace tables, each has seed rows for workspace A and B', n;
end
$$;
