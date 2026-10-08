import { ACADEMY, COACH_ACHIEVEMENTS } from "../data.js";

export default function About() {
  const points = [
    `Established on ${ACADEMY.established}.`,
    `Led by ${ACADEMY.owner}, an international-level athlete.`,
    "Focus on physical fitness, discipline, teamwork and recruitment preparation.",
    "Special physical fitness training for defence and police recruitment.",
    "A disciplined and fitness-focused training environment.",
    `Located near Shivaji University, ${ACADEMY.city}.`,
  ];
  return (
    <section className="section" id="about">
      <h2>About Us</h2>
      <p className="sub">
        <strong>S.P. SPORTS FOUNDATION</strong> — Owner and Head Coach: {ACADEMY.owner}
      </p>
      <ul className="points">
        {points.map((p) => <li key={p}>{p}</li>)}
      </ul>

      <div className="coach-panel" id="coach-achievements">
        <div className="coach-head">
          <span className="coach-avatar" aria-hidden="true">🏃</span>
          <div>
            <h3 className="coach-title">Coach Achievements</h3>
            <p className="coach-name">{ACADEMY.owner}</p>
            <p className="coach-role">Owner &amp; Head Coach</p>
            <span className="coach-chip">International-Level Athlete</span>
          </div>
        </div>

        <ul className="ach-grid">
          {COACH_ACHIEVEMENTS.map((a) => (
            <li className="ach-card" key={a.date + a.event}>
              <p className="ach-date">{a.date}</p>
              <h4 className="ach-event">{a.event}</h4>
              <p className="ach-result">
                <span className="ach-icon" role="img" aria-label={a.result}>{a.icon}</span>
                {a.result}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
