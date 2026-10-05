import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseReady = Boolean(url && anonKey);

// If Supabase isn't configured yet, export null so pages can show a clear
// setup message instead of crashing.
export const supabase = supabaseReady ? createClient(url, anonKey) : null;

// Students log in with their Mobile Number, but Supabase Auth needs an
// email. We build a fixed-format internal email from the mobile number so
// no separate email address is required for every student.
export const mobileToEmail = (mobile) =>
  `m${mobile.replace(/\D/g, "")}@students.spsportsfoundation.app`;
