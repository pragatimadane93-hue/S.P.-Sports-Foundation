-- S.P. SPORTS FOUNDATION — Registration v2
-- Run in Supabase: SQL Editor > New query > paste all > Run.
-- Safe to run more than once. It does NOT create a new students table, and Row Level
-- Security stays ON. Your existing policies (student reads/inserts only their own row,
-- admin reads everything) are not changed.
--
-- It does three things:
--   1. Makes every mobile number unique in `students` (no duplicate registrations).
--   2. Creates the student record in the SAME step as the login, so a registration is
--      either fully saved or not saved at all (no half-created accounts).
--   3. Removes two old "anyone can insert" policies that are no longer needed
--      (only if you had added them earlier) — see section 3.

-- ---------------------------------------------------------------------------
-- STEP 0 (check first): are there already two students with the same mobile?
-- Run this on its own. It must return NO rows before you continue.
-- If it returns rows, fix or delete the duplicates in Table Editor > students first.
--
--   select mobile, count(*) from public.students group by mobile having count(*) > 1;
-- ---------------------------------------------------------------------------

-- 1) One student per mobile number
create unique index if not exists students_mobile_unique
  on public.students (mobile);

-- 2) Create the student record automatically when a student signs up.
--    Only runs for sign-ups that carry a "mobile" (i.e. the registration form).
--    Admin accounts you create in Authentication > Users have no mobile, so they
--    are ignored. status and fee_status always start as 'Pending' (table defaults),
--    and cannot be chosen by the person registering.
create or replace function public.handle_new_student_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  m        jsonb := new.raw_user_meta_data;
  v_mobile text;
begin
  if m is null or (m->>'mobile') is null then
    return new;
  end if;

  v_mobile := regexp_replace(m->>'mobile', '\D', '', 'g');
  if length(v_mobile) = 12 and left(v_mobile, 2) = '91' then
    v_mobile := right(v_mobile, 10);
  end if;

  insert into public.students (
    auth_user_id, full_name, mobile, email, dob, age, gender,
    address, course, parent_name, parent_contact
  ) values (
    new.id,
    coalesce(nullif(m->>'full_name', ''), 'Student'),
    v_mobile,
    nullif(m->>'email', ''),
    nullif(m->>'dob', '')::date,
    nullif(m->>'age', '')::int,
    case when m->>'gender' in ('Boy', 'Girl') then m->>'gender' else null end,
    nullif(m->>'address', ''),
    nullif(m->>'course', ''),
    nullif(m->>'parent_name', ''),
    nullif(m->>'parent_contact', '')
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_student on auth.users;
create trigger on_auth_user_created_student
  after insert on auth.users
  for each row execute function public.handle_new_student_signup();

-- 3) Tighten security: registration now always goes through a real login, so the
--    old policies that let ANYONE (not logged in) insert rows are no longer needed.
--    These do nothing if you never created them.
drop policy if exists "public insert registration (no login)" on public.students;
drop policy if exists "public insert leave request" on public.leave_requests;

-- ---------------------------------------------------------------------------
-- Optional: confirm your existing policies are in place (you should see these):
--   students:  "students insert self", "students read self",
--              "admin read all students", "admin update students",
--              "admin insert students", "admin delete students"
--
--   select policyname from pg_policies where tablename = 'students';
-- ---------------------------------------------------------------------------
