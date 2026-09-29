import { useState } from "react";

/* Colour theme: "red" | "navy" | "green" | "black" */
const THEME = "red";
if (typeof document !== "undefined") document.documentElement.dataset.theme = THEME;

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
    { name: "Siddhant Pujari", display: "+91 9175570396", tel: "919175570396" },
    { name: "Sagar Hajare", display: "+91 9545250793", tel: "919545250793" },
  ],
};

// Paste your Google Apps Script "Web app" URL here to save registrations in a Google Sheet.
// Leave empty ("") to use WhatsApp only. Steps: see google-apps-script.js
const SHEET_URL = "";

const PROGRAMS = [
  { icon: "🪖", title: "Army Recruitment Training", sub: "Indian Army" },
  { icon: "⚓", title: "Navy Recruitment Training", sub: "Indian Navy" },
  { icon: "✈️", title: "Air Force Recruitment Training", sub: "Indian Air Force" },
  { icon: "🛡️", title: "Maharashtra Police Bharti Training", sub: "Police recruitment" },
  { icon: "🎖️", title: "Territorial Army (TA) Training", sub: "TA recruitment" },
  { icon: "🏃", title: "Physical Training", sub: "For all staff and competitive examination candidates" },
];

// Add real photos: put files in /public/gallery and add { src: "/gallery/photoN.jpg", alt: "..." }
const GALLERY = [
  { src: "/gallery/photo1.jpg", alt: "Coach guiding students during morning training" },
  { src: "/gallery/photo2.jpg", alt: "Group photo at Momentum 2K26 event" },
  { src: "/gallery/photo3.jpg", alt: "Athlete qualified for Asian Games 2026 achievement poster" },
];

const NAV = [
  ["home", "Home"],
  ["about", "About"],
  ["programs", "Programs"],
  ["physical", "Physical Training"],
  ["results", "Results & Success Stories"],
  ["online", "Online Study"],
  ["updates", "Latest Updates"],
  ["fees", "Timing & Fees"],
  ["gallery", "Gallery"],
  ["contact", "Contact"],
];

// Add real results here, e.g. { name: "Student name", detail: "Selected in ..." }
// Only add results you can confirm. Nothing is shown until you add entries.
const RESULTS = [];

// Add academy announcements here, newest first, e.g. { date: "1 Oct 2026", text: "New batch starting..." }
const UPDATES = [];

const wa = (tel, text) => `https://wa.me/${tel}?text=${encodeURIComponent(text)}`;
const ENQUIRY = `Hello, I would like to enquire about training at ${ACADEMY.name}, ${ACADEMY.city}.`;
const PLACE = "S.P. Sports Foundation near Shivaji University Kolhapur";
const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(PLACE)}`;
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(PLACE)}&output=embed`;

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

function Physical() {
  const points = [
    "Special physical fitness training for defence and police recruitment.",
    "Training for all staff and competitive examination candidates.",
    "A disciplined and fitness-focused training environment.",
    `Daily batch: ${ACADEMY.timing}, led by ${ACADEMY.owner}, an international-level athlete.`,
  ];
  return (
    <section id="physical" className="section">
      <h2>Physical Training</h2>
      <ul className="points">
        {points.map((p) => <li key={p}>{p}</li>)}
      </ul>
    </section>
  );
}

function Results() {
  return (
    <section id="results" className="section dark">
      <h2>Results and Success Stories</h2>
      {RESULTS.length === 0 ? (
        <p className="sub">Results and success stories of our students will be shared here.</p>
      ) : (
        <div className="grid">
          {RESULTS.map((r) => (
            <article className="card" key={r.name}>
              <h3>{r.name}</h3>
              <p>{r.detail}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function Online() {
  return (
    <section id="online" className="section">
      <h2>Online Study</h2>
      <p className="sub">Ask us about online study support for recruitment and competitive examinations.</p>
      <div className="row">
        <a className="btn btn-gold" target="_blank" rel="noreferrer"
           href={wa(ACADEMY.contacts[0].tel, `Hello, I would like to know about online study at ${ACADEMY.name}.`)}>
          Ask on WhatsApp
        </a>
        <a className="btn btn-ghost" href="#contact">Contact Us</a>
      </div>
    </section>
  );
}

function Updates() {
  return (
    <section id="updates" className="section">
      <h2>Latest Updates</h2>
      {UPDATES.length === 0 ? (
        <p className="sub">No announcements yet. New batches, camps and results will be posted here.</p>
      ) : (
        <ul className="points">
          {UPDATES.map((u) => (
            <li key={u.date + u.text}><strong>{u.date}:</strong> {u.text}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Notifications() {
  const [status, setStatus] = useState("idle"); // idle | granted | denied | unsupported
  const enableBrowser = async () => {
    if (!("Notification" in window)) { setStatus("unsupported"); return; }
    const perm = await Notification.requestPermission();
    setStatus(perm === "granted" ? "granted" : "denied");
    if (perm === "granted") {
      new Notification(ACADEMY.name, { body: "Thanks! You'll see updates when you open this site." });
    }
  };
  return (
    <section id="notifications" className="section dark">
      <h2>Notifications</h2>
      <p className="sub">
        Join our WhatsApp updates so you never miss a new batch, camp or result. You can also allow
        browser notifications as a reminder to check this site (this only works while the site is open
        in your browser; it cannot send messages when the site is closed).
      </p>
      <div className="row">
        <a className="btn btn-gold" target="_blank" rel="noreferrer"
           href={wa(ACADEMY.contacts[0].tel, `Hello, please add me to S.P. Sports Foundation updates.`)}>
          Join Updates on WhatsApp
        </a>
        <button className="btn btn-ghost" type="button" onClick={enableBrowser}>
          {status === "granted" ? "Notifications On" : "Enable Browser Notifications"}
        </button>
      </div>
      {status === "denied" && <p className="note">Notifications are blocked. Enable them from your browser's site settings to turn this on.</p>}
      {status === "unsupported" && <p className="note">Your browser does not support notifications. Please use WhatsApp updates instead.</p>}
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
    name: "", phone: "", location: "", email: "", program: PROGRAMS[0].title, age: "", gender: "Male", batch: ACADEMY.timing, message: "",
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const [status, setStatus] = useState("idle"); // idle | sending | saved | error
  const [waLink, setWaLink] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const text = [
      `New registration enquiry for ${ACADEMY.name}`,
      `Name: ${f.name}`,
      `Mobile: ${f.phone}`,
      `Location: ${f.location}`,
      f.email && `Email: ${f.email}`,
      `Program: ${f.program}`,
      `Age: ${f.age}`,
      `Gender: ${f.gender}`,
      `Preferred Batch: ${f.batch}`,
      f.message && `Message: ${f.message}`,
    ].filter(Boolean).join("\n");
    const link = wa(ACADEMY.contacts[0].tel, text);

    if (!SHEET_URL) {
      window.open(link, "_blank", "noopener");
      return;
    }
    setStatus("sending");
    try {
      await fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(f),
      });
      setWaLink(link);
      setStatus("saved");
    } catch {
      setWaLink(link);
      setStatus("error");
    }
  };

  return (
    <section id="register" className="section">
      <h2>Register Now</h2>
      <p className="sub">
        {SHEET_URL
          ? "Fill in your details and submit. The academy will receive your registration."
          : "This form opens WhatsApp with your details. Press send there to submit your enquiry."}
      </p>
      <form className="form" onSubmit={submit}>
        <label>Student Full Name
          <input required value={f.name} onChange={set("name")} autoComplete="name" />
        </label>
        <label>Mobile Number
          <input required type="tel" pattern="[0-9+ ]{10,15}" value={f.phone} onChange={set("phone")} autoComplete="tel" />
        </label>
        <label>Your Village / City (Location)
          <input required value={f.location} onChange={set("location")} placeholder="e.g. Kolhapur" autoComplete="address-level2" />
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
        <button className="btn btn-gold full" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Submit"}
        </button>
        {status === "saved" && (
          <p className="full note" role="status">
            Your registration has been sent to the academy. You can also send it on WhatsApp:{" "}
            <a href={waLink} target="_blank" rel="noreferrer">Open WhatsApp</a>
          </p>
        )}
        {status === "error" && (
          <p className="full note" role="alert">
            Could not send the form. Check your internet and try again, or{" "}
            <a href={waLink} target="_blank" rel="noreferrer">send it on WhatsApp</a>.
          </p>
        )}
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
        <a className="btn btn-ghost" href={MAPS} target="_blank" rel="noreferrer">Live Location</a>
      </div>
      <iframe className="map" title="S.P. Sports Foundation location on Google Maps" src={MAP_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
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
        <Physical />
        <Results />
        <Online />
        <Updates />
        <Notifications />
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
