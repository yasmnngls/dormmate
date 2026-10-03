-- Perf (informational): plans of statements nested inside the security definer policy helpers, via auto_explain.
\pset pager off
load 'auto_explain';
set auto_explain.log_min_duration = 0;
set auto_explain.log_nested_statements = on;
set auto_explain.log_analyze = on;
set client_min_messages = log;
begin;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000a1", "role": "authenticated"}', true);
set local role authenticated;
select count(*) from public.enrollment;
rollback;
