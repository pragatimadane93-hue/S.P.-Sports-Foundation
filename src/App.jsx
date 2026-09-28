import { useState } from "react";

/* ===== EDIT ACADEMY DETAILS HERE ===== */
const ACADEMY = {
  name: "S.P. Sports Foundation",
  city: "Kolhapur",
  tagline: "Train Hard. Serve the Nation.",
  established: "2 October 2023",
  owner: "Siddhant Suresh Pujari",
  fee: "₹1,200",
  timing: "4:30 PM – 6:30 PM",
  address: "S.P. Sports Foundation, near Shivaji University, Kolhapur, Maharashtra, India",
  contacts: [
    { name: "Siddhant Pujari Sir", display: "+91 9175570396", tel: "919175570396" },
    { name: "Sagar Hajare Sir", display: "+91 9545250793", tel: "919545250793" },
  ],
};

const PROGRAMS = [
  { icon: "🪖", title: "Army Recruitment Training", sub: "Indian Army" },
  { icon: "⚓", title: "Navy Recruitment Training", sub: "Indian Navy" },
  { icon: "✈️", title: "Air Force Recruitment Training", sub: "Indian Air Force" },
  { icon: "🛡️", title: "Maharashtra Police Bharti Training", sub: "Police recruitment" },
  { icon: "🎖️", title: "Territorial Army (TA) Training", sub: "TA recruitment" },
  { icon: "🏃", title: "Physical Training", sub: "For all staff and competitive examination candidates" },
];

// Add real photos: put files in /public/gallery and add { src: "/gallery/photo1.jpg", alt: "..." }
const GALLERY = [];

const NAV = [
  ["home", "Home"],
  ["about", "About Us"],
  ["programs", "Training Programs"],
  ["fees", "Batch Timing & Fees"],
  ["gallery", "Gallery"],
  ["contact", "Contact Us"],
];

const wa = (tel, text) => `https://wa.me/${tel}?text=${encodeURIComponent(text)}`;
const ENQUIRY = `Hello, I would like to enquire about training at ${ACADEMY.name}, ${ACADEMY.city}.`;
const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "S.P. Sports Foundation near Shivaji University Kolhapur"
)}`;

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <a href="#home" className="brand" onClick={() => setOpen(false)}>
        <img src="/logo.jpg" alt="S.P. Sports Foundation logo" />
        <span>{ACADEMY.name}</span>
      </a>
      <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? "✕" : "☰"}
      </button>
      <nav className={open ? "nav open" : "nav"}>
        {NAV.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>
        ))}
        <a href="#register" className="btn btn-gold small" onClick={() => setOpen(false)}>Register Now</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-text">
        <p className="kicker">{ACADEMY.city}, Maharashtra</p>
        <h1>{ACADEMY.tagline}</h1>
        <p className="lead">
          {ACADEMY.name} trains young people for Army, Navy, Air Force, Police and Territorial Army
          recruitment, with a strong focus on physical fitness and discipline.
        </p>
        <div className="row">
          <a href="#register" className="btn btn-gold">Join Our Academy</a>
          <a href={wa(ACADEMY.contacts[0].tel, ENQUIRY)} target="_blank" rel="noreferrer" className="btn btn-ghost">WhatsApp for Enquiry</a>
        </div>
      </div>
      <img className="hero-logo" src="/logo.jpg" alt="S.P. Sports Foundation emblem: running athlete with Indian flag" />
    </section>
  );
}

function About() {
  const points = [
    `Established on ${ACADEMY.established}.`,
    `Led by ${ACADEMY.owner}, an international-level athlete.`,
    "Special physical fitness training for defence and police recruitment.",
    "A disciplined and fitness-focused training environment.",
  ];
  return (
    <section id="about" className="section">
      <h2>About Us</h2>
      <p className="sub">Owner and Head Coach: {ACADEMY.owner}</p>
      <ul className="points">
        {points.map((p) => <li key={p}>{p}</li>)}
      </ul>
    </section>
  );
}

function Programs() {
  return (
    <section id="programs" className="section dark">
      <h2>Our Training Programs</h2>
      <div className="grid">
        {PROGRAMS.map((p) => (
          <article className="card" key={p.title}>
            <span className="icon" aria-hidden="true">{p.icon}</span>
            <h3>{p.title}</h3>
            <p>{p.sub}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Fees() {
  return (
    <section id="fees" className="section">
      <h2>Batch Timing and Fees</h2>
      <div className="fees">
        <div><span>Monthly Training Fee</span><strong>{ACADEMY.fee}</strong></div>
        <div><span>Batch Timing</span><strong>{ACADEMY.timing}</strong></div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="section dark">
      <h2>Academy Gallery</h2>
      <div className="gallery">
        <figure><img src="/logo.jpg" alt="S.P. Sports Foundation logo" /></figure>
        {GALLERY.map((g) => (
          <figure key={g.src}><img src={g.src} alt={g.alt} loading="lazy" /></figure>
        ))}
      </div>
      {GALLERY.length === 0 && (
        <p className="sub">Training photos will be added here soon.</p>
      )}
    </section>
  );
}

function Register() {
  const [f, setF] = useState({
    name: "", phone: "", email: "", program: PROGRAMS[0].title, age: "", gender: "Male", batch: ACADEMY.timing, message: "",
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const text = [
      `New registration enquiry for ${ACADEMY.name}`,
      `Name: ${f.name}`,
      `Mobile: ${f.phone}`,
      f.email && `Email: ${f.email}`,
      `Program: ${f.program}`,
      `Age: ${f.age}`,
      `Gender: ${f.gender}`,
      `Preferred Batch: ${f.batch}`,
      f.message && `Message: ${f.message}`,
    ].filter(Boolean).join("\n");
    window.open(wa(ACADEMY.contacts[0].tel, text), "_blank", "noopener");
  };

  return (
    <section id="register" className="section">
      <h2>Register Now</h2>
      <p className="sub">This form opens WhatsApp with your details. Press send there to submit your enquiry.</p>
      <form className="form" onSubmit={submit}>
        <label>Student Full Name
          <input required value={f.name} onChange={set("name")} autoComplete="name" />
        </label>
        <label>Mobile Number
          <input required type="tel" pattern="[0-9+ ]{10,15}" value={f.phone} onChange={set("phone")} autoComplete="tel" />
        </label>
        <label>Email Address (optional)
          <input type="email" value={f.email} onChange={set("email")} autoComplete="email" />
        </label>
        <label>Training Program
          <select value={f.program} onChange={set("program")}>
            {PROGRAMS.map((p) => <option key={p.title}>{p.title}</option>)}
          </select>
        </label>
        <label>Age
          <input required type="number" min="8" max="60" value={f.age} onChange={set("age")} />
        </label>
        <label>Gender
          <select value={f.gender} onChange={set("gender")}>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </label>
        <label>Preferred Batch Timing
          <select value={f.batch} onChange={set("batch")}>
            <option>{ACADEMY.timing}</option>
          </select>
        </label>
        <label className="full">Message (optional)
          <textarea rows="3" value={f.message} onChange={set("message")} />
        </label>
        <button className="btn btn-gold full" type="submit">Submit</button>
      </form>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section dark">
      <h2>Contact Us</h2>
      <div className="contacts">
        {ACADEMY.contacts.map((c) => (
          <div className="card" key={c.tel}>
            <h3>{c.name}</h3>
            <p>{c.display}</p>
            <div className="row">
              <a className="btn btn-gold small" href={`tel:+${c.tel}`}>Call Now</a>
              <a className="btn btn-ghost small" target="_blank" rel="noreferrer" href={wa(c.tel, ENQUIRY)}>WhatsApp for Enquiry</a>
            </div>
          </div>
        ))}
      </div>
      <p className="addr"><strong>Address:</strong> {ACADEMY.address}</p>
      <p className="addr"><strong>Monthly Fee:</strong> {ACADEMY.fee} &nbsp;|&nbsp; <strong>Batch Timing:</strong> {ACADEMY.timing}</p>
      <div className="row">
        <a className="btn btn-gold" href="#register">Register Now</a>
        <a className="btn btn-ghost" href={MAPS} target="_blank" rel="noreferrer">Get Directions</a>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Programs />
        <Fees />
        <Gallery />
        <Register />
        <Contact />
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} {ACADEMY.name}, {ACADEMY.city}. {ACADEMY.tagline}
      </footer>
    </>
  );
}
