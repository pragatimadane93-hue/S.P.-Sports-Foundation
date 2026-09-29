-- S.P. SPORTS FOUNDATION — Phase 1 database schema
-- Run this once in Supabase: Dashboard > SQL Editor > New query > paste all > Run.

create extension if not exists "pgcrypto";

-- Auto Student ID generator: SPS-0001, SPS-0002, ...
create sequence if not exists student_id_seq start 1;

create or replace function next_student_id() returns text as $$
declare
  n int;
begin
  n := nextval('student_id_seq');
  return 'SPS-' || lpad(n::text, 4, '0');
end;
$$ language plpgsql;

-- Students table
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  student_id text unique not null default next_student_id(),
  full_name text not null,
  mobile text not null,
  email text,
  dob date,
  age int,
  gender text check (gender in ('Boy','Girl')),
  address text,
  course text,
  parent_name text,
  parent_contact text,
  registration_date date default current_date,
  status text default 'Pending' check (status in ('Pending','Approved','Rejected')),
  fee_status text default 'Pending' check (fee_status in ('Paid','Pending')),
  created_at timestamptz default now()
);

alter table students enable row level security;

-- A newly signed-up student can create only their own row.
create policy "students insert self" on students
  for insert with check (auth.uid() = auth_user_id);

-- A student can read only their own row (not other students' data).
create policy "students read self" on students
  for select using (auth.uid() = auth_user_id);

-- NOTE: Owner/Admin access to ALL students is added in Phase 2,
-- once the Admin Dashboard and an "admin" role are built.

-- Leave requests
create table if not exists leave_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text,
  status text default 'Pending' check (status in ('Pending','Approved','Rejected')),
  remark text,
  created_at timestamptz default now()
);
alter table leave_requests enable row level security;

create policy "leave insert self" on leave_requests
  for insert with check (
    exists (select 1 from students s where s.id = student_id and s.auth_user_id = auth.uid())
  );

create policy "leave read self" on leave_requests
  for select using (
    exists (select 1 from students s where s.id = student_id and s.auth_user_id = auth.uid())
  );

-- Announcements / Latest Updates (public read-only for now)
create table if not exists updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  published_at date default current_date,
  created_at timestamptz default now()
);
alter table updates enable row level security;

create policy "updates public read" on updates
  for select using (true);

-- To publish an update in Phase 1 (before the Admin Dashboard exists),
-- go to Supabase Dashboard > Table Editor > updates > Insert row.
