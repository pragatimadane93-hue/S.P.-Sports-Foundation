import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseReady = Boolean(url && anonKey);

// If Supabase isn't configured yet, export null so pages can show a clear
// setup message instead of crashing.
export const supabase = supabaseReady ? createClient(url, anonKey) : null;

// Turn whatever the user typed (e.g. "+91 98765 43210", "09876543210") into a plain
// 10-digit Indian mobile number, so the same person always maps to the same login
// and duplicate registrations can be detected reliably.
export const normalizeMobile = (raw) => {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return d;
};

// Students log in with their Mobile Number, but Supabase Auth needs an
// email. We build a fixed-format internal email from the mobile number so
// no separate email address is required for every student.
export const mobileToEmail = (mobile) =>
  `m${normalizeMobile(mobile)}@students.spsportsfoundation.app`;
