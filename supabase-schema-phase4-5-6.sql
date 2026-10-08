-- S.P. SPORTS FOUNDATION — Fee + Attendance + Leave
-- Run after the existing schema files.
-- Safe for the current project structure.

-- Attendance table
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  date date not null,
  course text,
  status text not null check (status in ('Present','Absent','Leave')),
  created_at timestamptz default now(),
  unique (student_id, date)
);

alter table public.attendance enable row level security;

-- Admin can view attendance
DROP POLICY IF EXISTS "admin read attendance" ON public.attendance;
CREATE POLICY "admin read attendance" ON public.attendance
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins a WHERE a.auth_user_id = auth.uid())
  );

-- Admin can create attendance
DROP POLICY IF EXISTS "admin insert attendance" ON public.attendance;
CREATE POLICY "admin insert attendance" ON public.attendance
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins a WHERE a.auth_user_id = auth.uid())
  );

-- Admin can update attendance
DROP POLICY IF EXISTS "admin update attendance" ON public.attendance;
CREATE POLICY "admin update attendance" ON public.attendance
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins a WHERE a.auth_user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins a WHERE a.auth_user_id = auth.uid())
  );

-- Allow the public Leave form to submit a request after looking up the student
-- through find_student_by_mobile().
DROP POLICY IF EXISTS "public insert leave request" ON public.leave_requests;
CREATE POLICY "public insert leave request" ON public.leave_requests
  FOR INSERT WITH CHECK (true);

-- Admin can read and approve/reject leave requests
DROP POLICY IF EXISTS "admin read all leaves" ON public.leave_requests;
CREATE POLICY "admin read all leaves" ON public.leave_requests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins a WHERE a.auth_user_id = auth.uid())
  );

DROP POLICY IF EXISTS "admin update leaves" ON public.leave_requests;
CREATE POLICY "admin update leaves" ON public.leave_requests
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins a WHERE a.auth_user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins a WHERE a.auth_user_id = auth.uid())
  );

-- Fee status already exists on students from Phase 1:
-- Paid / Pending.
-- Admin update permission is supplied by Phase 2.
