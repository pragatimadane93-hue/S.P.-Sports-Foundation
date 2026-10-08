import { ACADEMY } from "../data.js";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} {ACADEMY.fullName}. {ACADEMY.tagline}</p>
      <p className="foot-sub">{ACADEMY.address}</p>
      <p className="footer-credit">Designed by Pragati Madane</p>
    </footer>
  );
}
