import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        // Wait a tick so the page has rendered before measuring position.
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
        return;
      }
    }
    if (location.pathname === "/") window.scrollTo({ top: 0 });
  }, [location]);
  return null;
}
