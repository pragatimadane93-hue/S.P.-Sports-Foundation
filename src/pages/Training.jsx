import { Link } from "react-router-dom";
import { PROGRAMS } from "../data.js";

export default function Training() {
  return (
    <section className="section">
      <h2>Physical Training Programs</h2>
      <div className="grid">
        {PROGRAMS.map((p) => (
          <article className="card" key={p.title}>
            <span className="icon" aria-hidden="true">{p.icon}</span>
            <h3>{p.title}</h3>
            <p>{p.sub}</p>
            <Link className="btn btn-ghost small" to={`/admission?course=${encodeURIComponent(p.title)}`}>
              Register Now
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
