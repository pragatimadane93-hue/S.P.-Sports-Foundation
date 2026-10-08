import { useCallback, useState } from "react";
import { usePrograms } from "../usePrograms.js";
import ProgramModal from "../components/ProgramModal.jsx";

export default function Training() {
  const { programs, loading } = usePrograms();
  const [selected, setSelected] = useState(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <section className="section" id="training">
      <h2>Physical Training Programs</h2>

      {loading && programs.length === 0 && <p className="sub">Loading programs...</p>}
      {!loading && programs.length === 0 && (
        <p className="sub">No training programs are available right now. Please check back soon.</p>
      )}

      <div className="grid">
        {programs.map((p) => (
          <article className="card program-card" key={p.id || p.title}>
            <span className="icon" aria-hidden="true">{p.icon}</span>
            <h3>{p.title}</h3>
            <p>{p.short}</p>
            {/* The button's ::after covers the whole card, so the entire card is clickable. */}
            <button className="btn btn-gold small" onClick={() => setSelected(p)}>
              View Details
            </button>
          </article>
        ))}
      </div>

      {selected && <ProgramModal program={selected} onClose={close} />}
    </section>
  );
}
