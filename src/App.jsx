import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToHash from "./components/ScrollToHash.jsx";
import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  return (
    <>
      <ScrollToHash />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* Old page links now scroll to a section on the Home page */}
          <Route path="/about" element={<Navigate to="/#about" replace />} />
          <Route path="/training" element={<Navigate to="/#training" replace />} />
          <Route path="/online-study" element={<Navigate to="/#online-study" replace />} />
          <Route path="/admission" element={<Navigate to="/#admission" replace />} />
          <Route path="/updates" element={<Navigate to="/#updates" replace />} />
          <Route path="/gallery" element={<Navigate to="/#gallery" replace />} />
          <Route path="/contact" element={<Navigate to="/#contact" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
