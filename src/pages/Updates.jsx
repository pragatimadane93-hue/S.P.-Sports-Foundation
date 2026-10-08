import { useEffect, useState } from "react";
import { supabase, supabaseReady } from "../supabaseClient.js";

export default function Updates() {
  const [items, setItems] = useState([]);
  const [state, setState] = useState("loading"); // loading | ready | error | unconfigured

  useEffect(() => {
    if (!supabaseReady) { setState("unconfigured"); return; }
    (async () => {
      const { data, error } = await supabase
        .from("updates")
        .select("id, title, description, published_at")
        .order("published_at", { ascending: false });
      if (error) { setState("error"); return; }
      setItems(data || []);
      setState("ready");
    })();
  }, []);

  return (
    <section className="section dark" id="updates">
      <h2>Latest Updates</h2>
      {state === "unconfigured" && (
        <p className="note">Database isn't connected yet — see SETUP.md.</p>
      )}
      {state === "error" && <p className="note">Could not load updates right now.</p>}
      {state === "ready" && items.length === 0 && (
        <p className="sub">No announcements yet. New batches, camps and results will be posted here.</p>
      )}
      {state === "ready" && items.length > 0 && (
        <ul className="points">
          {items.map((u) => (
            <li key={u.id}>
              <strong>{u.published_at}:</strong> {u.title}
              {u.description ? ` — ${u.description}` : ""}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
