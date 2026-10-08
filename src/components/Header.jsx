import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const SECTIONS = [
  ["home", "Home"],
  ["about", "About Us"],
  ["training", "Physical Training"],
  ["online-study", "Online Study"],
  ["admission", "Admission"],
  ["updates", "Latest Updates"],
  ["gallery", "Gallery"],
  ["fees", "Fees & Payment"],
  ["contact", "Contact Us"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="header">
      <Link to="/#home" className="brand" onClick={close}>
        <img src="/logo.jpg" alt="S.P. Sports Foundation logo" />
        <span>S.P. Sports Foundation</span>
      </Link>
      <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? "✕" : "☰"}
      </button>
      <nav className={open ? "nav open" : "nav"}>
        {SECTIONS.map(([id, label]) => (
          <Link key={id} to={`/#${id}`} onClick={close}>{label}</Link>
        ))}
        <NavLink to="/student-login" onClick={close}>Student Login</NavLink>
        <NavLink to="/admin-login" onClick={close}>Admin Login</NavLink>
        <Link to="/#admission" className="btn btn-gold small" onClick={close}>Register Now</Link>
      </nav>
    </header>
  );
}
