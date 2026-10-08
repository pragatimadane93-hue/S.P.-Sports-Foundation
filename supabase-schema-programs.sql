-- S.P. SPORTS FOUNDATION — Training Programs
-- Run in Supabase: SQL Editor > New query > paste all > Run.  Safe to run more than once.
-- Creates ONE new table (there was no programs table before) and nothing else is changed.
-- Existing tables and their Row Level Security policies are not touched.

create table if not exists public.training_programs (
  id                   uuid primary key default gen_random_uuid(),
  program_name         text not null unique,
  short_description    text,
  detailed_description text,
  training_objectives  text[] not null default '{}',
  icon                 text,
  sort_order           int  not null default 100,
  is_active            boolean not null default true,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table public.training_programs enable row level security;

-- Public visitors and students: READ active programs only.
drop policy if exists "programs public read active" on public.training_programs;
create policy "programs public read active" on public.training_programs
  for select using (is_active = true);

-- Admin (a row in the admins table): read everything, add, edit, delete.
drop policy if exists "programs admin read all" on public.training_programs;
create policy "programs admin read all" on public.training_programs
  for select using (exists (select 1 from public.admins a where a.auth_user_id = auth.uid()));

drop policy if exists "programs admin insert" on public.training_programs;
create policy "programs admin insert" on public.training_programs
  for insert with check (exists (select 1 from public.admins a where a.auth_user_id = auth.uid()));

drop policy if exists "programs admin update" on public.training_programs;
create policy "programs admin update" on public.training_programs
  for update using (exists (select 1 from public.admins a where a.auth_user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.auth_user_id = auth.uid()));

drop policy if exists "programs admin delete" on public.training_programs;
create policy "programs admin delete" on public.training_programs
  for delete using (exists (select 1 from public.admins a where a.auth_user_id = auth.uid()));

-- Keep updated_at current whenever a program is edited.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists training_programs_set_updated_at on public.training_programs;
create trigger training_programs_set_updated_at
  before update on public.training_programs
  for each row execute function public.set_updated_at();

-- Starting content: the 6 programs (skipped for any name that already exists).
insert into public.training_programs
  (program_name, short_description, detailed_description, training_objectives, icon, sort_order)
values
  ('Indian Army Recruitment Training', 'Fitness, running and stamina preparation for Indian Army recruitment.', 'This program is for candidates who want to prepare physically for Indian Army recruitment.

The training objective is to build general fitness, endurance, strength and the habit of regular, disciplined practice through guided training at S.P. Sports Foundation.', array['Physical Fitness Training', 'Running and Endurance Training', 'Strength and Stamina Training', 'Discipline and Regular Practice', 'Basic recruitment-oriented physical preparation'], '🪖', 10),
  ('Indian Navy Recruitment Training', 'Endurance, running and strength preparation for Indian Navy recruitment.', 'This program is for candidates who want to prepare physically for Indian Navy recruitment.

The training focuses on building endurance, running ability, strength, stamina and general physical fitness through regular, disciplined practice.', array['Endurance', 'Running', 'Strength', 'Stamina', 'General physical fitness', 'Discipline and regular practice'], '⚓', 20),
  ('Indian Air Force Recruitment Training', 'Running, endurance and fitness preparation for Indian Air Force recruitment.', 'This program is for candidates who want to prepare physically for Indian Air Force recruitment.

The training focuses on running and endurance, strength and stamina, and general physical fitness, supported by regular practice and discipline.', array['Running and endurance', 'Strength and stamina', 'General physical fitness', 'Regular practice', 'Discipline'], '✈️', 30),
  ('Maharashtra Police Bharti Training', 'Running, strength, agility and fitness preparation for Maharashtra Police Bharti.', 'This program is for candidates who want to prepare physically for Maharashtra Police Bharti.

The training focuses on running and endurance, strength, stamina, agility and fitness, with regular physical practice and discipline as recruitment-oriented preparation.', array['Running and endurance training', 'Strength and stamina', 'Agility and fitness', 'Regular physical practice', 'Discipline', 'Recruitment-oriented physical preparation'], '🛡️', 40),
  ('Territorial Army (TA) Training', 'Fitness, running and stamina preparation for Territorial Army (TA) recruitment.', 'This program is for candidates who want to prepare physically for Territorial Army (TA) recruitment.

The training focuses on physical fitness, running and endurance, strength and stamina, and the habit of regular, disciplined practice.', array['Physical fitness preparation', 'Running and endurance', 'Strength and stamina', 'General fitness', 'Discipline and regular practice'], '🎖️', 50),
  ('Physical Training for All Staff and Competitive Examination Candidates', 'General fitness, running, endurance and strength training for staff and competitive examination candidates.', 'This program is for staff members and competitive examination candidates who want to improve their general physical fitness.

The training covers running, endurance, strength and stamina through regular exercise, with an emphasis on fitness and discipline.', array['General physical fitness', 'Running', 'Endurance', 'Strength', 'Stamina', 'Regular exercise', 'Fitness and discipline'], '🏃', 60)
on conflict (program_name) do nothing;
