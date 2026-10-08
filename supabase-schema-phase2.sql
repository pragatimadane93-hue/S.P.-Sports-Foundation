-- S.P. SPORTS FOUNDATION — Phase 2 additions
-- Run this AFTER supabase-schema.sql has already been run once.
-- Dashboard > SQL Editor > New query > paste all > Run.

-- Admins table: only rows here can access the Admin Dashboard.
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  name text
);
alter table admins enable row level security;

create policy "admins read self" on admins
  for select using (auth.uid() = auth_user_id);

-- Admin: full access to students
create policy "admin read all students" on students
  for select using (exists (select 1 from admins a where a.auth_user_id = auth.uid()));
create policy "admin update students" on students
  for update using (exists (select 1 from admins a where a.auth_user_id = auth.uid()));
create policy "admin insert students" on students
  for insert with check (exists (select 1 from admins a where a.auth_user_id = auth.uid()));
create policy "admin delete students" on students
  for delete using (exists (select 1 from admins a where a.auth_user_id = auth.uid()));

-- Admin: full access to leave requests
create policy "admin read all leaves" on leave_requests
  for select using (exists (select 1 from admins a where a.auth_user_id = auth.uid()));
create policy "admin update leaves" on leave_requests
  for update using (exists (select 1 from admins a where a.auth_user_id = auth.uid()));

-- Admin: manage announcements (public read already allowed by Phase 1)
create policy "admin insert updates" on updates
  for insert with check (exists (select 1 from admins a where a.auth_user_id = auth.uid()));
create policy "admin update updates" on updates
  for update using (exists (select 1 from admins a where a.auth_user_id = auth.uid()));
create policy "admin delete updates" on updates
  for delete using (exists (select 1 from admins a where a.auth_user_id = auth.uid()));
