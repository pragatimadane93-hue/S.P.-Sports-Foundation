import { ACADEMY } from "../data.js";

export default function About() {
  const points = [
    `Established on ${ACADEMY.established}.`,
    `Led by ${ACADEMY.owner}, an international-level athlete.`,
    "Focus on physical fitness, discipline, teamwork and recruitment preparation.",
    "Special physical fitness training for defence and police recruitment.",
    `Located near Shivaji University, ${ACADEMY.city}.`,
  ];
  return (
    <section className="section">
      <h2>About Us</h2>
      <p className="sub">Owner and Head Coach: {ACADEMY.owner}</p>
      <ul className="points">
        {points.map((p) => <li key={p}>{p}</li>)}
      </ul>
    </section>
  );
}
