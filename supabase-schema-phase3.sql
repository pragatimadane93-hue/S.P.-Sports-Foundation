-- S.P. SPORTS FOUNDATION — Phase 3 additions
-- Run this AFTER supabase-schema.sql and supabase-schema-phase2.sql.
-- Dashboard > SQL Editor > New query > paste all > Run.

-- Attendance
create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  date date not null,
  course text,
  status text not null check (status in ('Present','Absent','Leave')),
  created_at timestamptz default now(),
  unique (student_id, date)
);
alter table attendance enable row level security;

-- Student can read only their own attendance
create policy "attendance read self" on attendance
  for select using (
    exists (select 1 from students s where s.id = student_id and s.auth_user_id = auth.uid())
  );

-- Admin: full access to attendance
create policy "admin read attendance" on attendance
  for select using (exists (select 1 from admins a where a.auth_user_id = auth.uid()));
create policy "admin insert attendance" on attendance
  for insert with check (exists (select 1 from admins a where a.auth_user_id = auth.uid()));
create policy "admin update attendance" on attendance
  for update using (exists (select 1 from admins a where a.auth_user_id = auth.uid()));

-- Study materials (simplified: visible to any logged-in student; not per-student targeting)
create table if not exists study_materials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  course text,
  link text not null,
  published_at date default current_date,
  created_at timestamptz default now()
);
alter table study_materials enable row level security;

-- Any logged-in student can read materials
create policy "materials read students" on study_materials
  for select using (auth.role() = 'authenticated');

-- Admin: manage materials
create policy "admin insert materials" on study_materials
  for insert with check (exists (select 1 from admins a where a.auth_user_id = auth.uid()));
create policy "admin update materials" on study_materials
  for update using (exists (select 1 from admins a where a.auth_user_id = auth.uid()));
create policy "admin delete materials" on study_materials
  for delete using (exists (select 1 from admins a where a.auth_user_id = auth.uid()));
