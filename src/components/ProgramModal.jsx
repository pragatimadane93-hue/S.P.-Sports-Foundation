import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ACADEMY, wa } from "../data.js";

export default function ProgramModal({ program, onClose }) {
  const navigate = useNavigate();
  const closeRef = useRef(null);

  // Close on Escape, lock page scroll while open, and put focus on the Close button.
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const join = () => {
    onClose();
    // Opens the existing registration form with this program already selected.
    navigate({ pathname: "/", search: `?course=${encodeURIComponent(program.title)}`, hash: "#admission" });
  };

  const message =
    `Hello S.P. SPORTS FOUNDATION, I am interested in ${program.title}. ` +
    `I would like to know more about the training program.`;

  const paragraphs = (program.details || "").split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="pm-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pm-panel" role="dialog" aria-modal="true" aria-labelledby="pm-title">
        <div className="pm-head">
          <span className="pm-icon" aria-hidden="true">{program.icon}</span>
          <h3 id="pm-title">{program.title}</h3>
          <button ref={closeRef} className="pm-x" onClick={onClose} aria-label="Close program details">✕</button>
        </div>

        <div className="pm-body">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}

          {program.objectives.length > 0 && (
            <>
              <h4>Training Focus</h4>
              <ul className="pm-list">
                {program.objectives.map((o) => <li key={o}>{o}</li>)}
              </ul>
            </>
          )}

          <p className="pm-note">
            S.P. Sports Foundation provides physical training preparation only. Official recruitment
            standards, eligibility and selection are decided by the respective recruiting authority,
            and this program does not guarantee selection.
          </p>
        </div>

        <div className="pm-actions">
          <button className="btn btn-gold" onClick={join}>Join This Program</button>
          <a className="btn btn-ghost" target="_blank" rel="noreferrer" href={wa(ACADEMY.contacts[0].tel, message)}>
            Enquire on WhatsApp
          </a>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
