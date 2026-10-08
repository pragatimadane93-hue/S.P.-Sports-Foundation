import { useCallback, useEffect, useState } from "react";
import { supabase, supabaseReady } from "./supabaseClient.js";
import { PROGRAMS } from "./data.js";

// Convert a row of the Supabase table `training_programs` into the shape the pages use.
const fromRow = (r) => ({
  id: r.id,
  title: r.program_name,
  short: r.short_description || "",
  details: r.detailed_description || "",
  objectives: Array.isArray(r.training_objectives) ? r.training_objectives : [],
  icon: r.icon || "🏅",
  active: r.is_active,
});

/**
 * Loads the training programs.
 *  - Public pages:  usePrograms()                         -> active programs only (enforced by RLS too)
 *  - Admin screens: usePrograms({ includeInactive: true }) -> every program
 * If Supabase is not connected, the table doesn't exist yet, or it has no rows, the built-in
 * PROGRAMS from data.js are used (unless fallback:false, which the admin manager uses).
 */
export function usePrograms({ includeInactive = false, fallback = true } = {}) {
  const [programs, setPrograms] = useState(fallback ? PROGRAMS : []);
  const [source, setSource] = useState("static"); // "static" | "database"
  const [loading, setLoading] = useState(supabaseReady);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!supabaseReady) { setLoading(false); return; }
    setLoading(true);
    let q = supabase
      .from("training_programs")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (!includeInactive) q = q.eq("is_active", true);
    const { data, error: err } = await q;
    if (err) {
      setError(err.message);
      setPrograms(fallback ? PROGRAMS : []);
      setSource("static");
    } else if (!data || data.length === 0) {
      setError("");
      setPrograms(fallback ? PROGRAMS : []);
      setSource("static");
    } else {
      setError("");
      setPrograms(data.map(fromRow));
      setSource("database");
    }
    setLoading(false);
  }, [includeInactive, fallback]);

  useEffect(() => { load(); }, [load]);

  return { programs, source, loading, error, reload: load };
}
