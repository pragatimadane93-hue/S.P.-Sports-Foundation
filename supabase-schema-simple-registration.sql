-- S.P. SPORTS FOUNDATION — Simplify registration (no Student Login)
-- Run this AFTER supabase-schema.sql and supabase-schema-phase2.sql.
-- This lets the public registration form save a student record WITHOUT
-- creating a login/password, so attendance and fees can still be managed
-- by the admin. Students no longer need an account.

-- Allow anyone to insert a registration row that has no linked login.
create policy "public insert registration (no login)" on students
  for insert
  with check (auth_user_id is null);

-- NOTE: the old "students insert self" / "students read self" policies
-- from Phase 1 (for logged-in students) can stay — they simply won't be
-- used anymore since registration no longer creates a login.

-- Since there is no more Student Login, Online Study materials are now
-- public (like Latest Updates) instead of "logged-in students only".
create policy "materials public read" on study_materials
  for select using (true);

