import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Training from "./pages/Training.jsx";
import OnlineStudy from "./pages/OnlineStudy.jsx";
import Admission from "./pages/Admission.jsx";
import Updates from "./pages/Updates.jsx";
import Contact from "./pages/Contact.jsx";
import StudentLogin from "./pages/StudentLogin.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Gallery from "./pages/Gallery.jsx";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/training" element={<Training />} />
          <Route path="/online-study" element={<OnlineStudy />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
