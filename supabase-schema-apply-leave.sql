-- S.P. SPORTS FOUNDATION — Apply Leave (no Student Login)
-- Run this AFTER the earlier schema files, including supabase-schema-simple-registration.sql.

-- A student doesn't have a login, so we can't use auth.uid() to find their
-- record. Instead, the public Apply Leave form looks up the student by the
-- mobile number they registered with, using this function (it runs with
-- elevated rights, but only ever returns an id and name — never other
-- personal details like address or parent contact).
create or replace function find_student_by_mobile(p_mobile text)
returns table (id uuid, full_name text)
language sql
security definer
set search_path = public
as $$
  select id, full_name
  from students
  where mobile = p_mobile
  order by created_at desc
  limit 1;
$$;

grant execute on function find_student_by_mobile(text) to anon, authenticated;

-- Allow the public Apply Leave form to submit a leave request.
-- (The student_id itself only comes from the lookup function above.)
create policy "public insert leave request" on leave_requests
  for insert
  with check (true);
