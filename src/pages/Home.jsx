import { Link } from "react-router-dom";
import { ACADEMY, PROGRAMS, wa } from "../data.js";

export default function Home() {
  const enquiry = `Hello, I would like to enquire about training at ${ACADEMY.name}.`;
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="kicker">{ACADEMY.city}, Maharashtra</p>
          <h1>{ACADEMY.tagline}</h1>
          <p className="lead">
            {ACADEMY.fullName} trains young people for Army, Navy, Air Force, Police and
            Territorial Army recruitment, with a strong focus on physical fitness and discipline.
          </p>
          <div className="row">
            <Link className="btn btn-gold" to="/admission">Join Now</Link>
            <Link className="btn btn-ghost-dark" to="/admission">Register</Link>
            <Link className="btn btn-ghost-dark" to="/contact">Contact Us</Link>
          </div>
        </div>
        <img className="hero-logo" src="/logo.jpg" alt="S.P. Sports Foundation emblem" />
      </section>

      <section className="section">
        <h2>Training Programs</h2>
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

      <section className="section dark">
        <h2>Batch Timing and Fee</h2>
        <div className="fees">
          <div><span>Monthly Training Fee</span><strong>{ACADEMY.fee}</strong></div>
          <div><span>Batch Timing</span><strong>{ACADEMY.timing}</strong></div>
        </div>
      </section>

      <section className="section">
        <h2>Follow Us</h2>
        <div className="row">
          {ACADEMY.instagram.map((i) => (
            <a key={i.url} className="btn btn-ghost" href={i.url} target="_blank" rel="noreferrer">
              Instagram — {i.label}
            </a>
          ))}
          <a className="btn btn-gold" target="_blank" rel="noreferrer" href={wa(ACADEMY.contacts[0].tel, enquiry)}>
            WhatsApp for Enquiry
          </a>
        </div>
      </section>
    </>
  );
}
