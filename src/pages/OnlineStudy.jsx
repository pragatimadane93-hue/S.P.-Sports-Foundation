import { useEffect, useState } from "react";
import { supabase, supabaseReady } from "../supabaseClient.js";

export default function OnlineStudy() {
  const [items, setItems] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    if (!supabaseReady) { setState("unconfigured"); return; }
    (async () => {
      const { data, error } = await supabase
        .from("study_materials")
        .select("id, title, description, course, link, published_at")
        .order("published_at", { ascending: false });
      if (error) { setState("error"); return; }
      setItems(data || []);
      setState("ready");
    })();
  }, []);

  return (
    <section className="section" id="online-study">
      <h2>Online Study</h2>

      {state === "unconfigured" && (
        <p className="sub">
          Study notes, practice questions, mock tests and PDF material will appear here once the
          owner/admin publishes them.
        </p>
      )}
      {state === "error" && <p className="note">Could not load study materials right now.</p>}
      {state === "ready" && items.length === 0 && (
        <p className="sub">No study materials uploaded yet. Check back soon.</p>
      )}
      {state === "ready" && items.length > 0 && (
        <ul className="points">
          {items.map((m) => (
            <li key={m.id}>
              <strong>{m.title}</strong>{m.course ? ` (${m.course})` : ""}
              {m.description ? ` — ${m.description}` : ""}{" "}
              — <a href={m.link} target="_blank" rel="noreferrer">Open</a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
