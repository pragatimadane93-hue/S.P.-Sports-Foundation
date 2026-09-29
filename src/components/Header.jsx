import { useState } from "react";
import { NavLink } from "react-router-dom";

const NAV = [
  ["/", "Home"],
  ["/about", "About Us"],
  ["/training", "Physical Training"],
  ["/online-study", "Online Study"],
  ["/admission", "Admission"],
  ["/updates", "Latest Updates"],
  ["/gallery", "Gallery"],
  ["/contact", "Contact Us"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="header">
      <NavLink to="/" className="brand" onClick={close}>
        <img src="/logo.jpg" alt="S.P. Sports Foundation logo" />
        <span>S.P. Sports Foundation</span>
      </NavLink>
      <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? "✕" : "☰"}
      </button>
      <nav className={open ? "nav open" : "nav"}>
        {NAV.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === "/"} onClick={close}>{label}</NavLink>
        ))}
        <NavLink to="/student-login" onClick={close}>Student Login</NavLink>
        <NavLink to="/admin-login" onClick={close}>Admin Login</NavLink>
        <NavLink to="/admission" className="btn btn-gold small" onClick={close}>Register Now</NavLink>
      </nav>
    </header>
  );
}
