import { ACADEMY, wa } from "../data.js";
import About from "./About.jsx";
import Training from "./Training.jsx";
import OnlineStudy from "./OnlineStudy.jsx";
import Admission from "./Admission.jsx";
import Updates from "./Updates.jsx";
import Gallery from "./Gallery.jsx";
import Contact from "./Contact.jsx";

function FollowUs() {
  const enquiry = `Hello, I would like to enquire about training at ${ACADEMY.name}.`;
  return (
    <section id="follow" className="section navy">
      <h2>Follow Us</h2>
      <div className="row">
        {ACADEMY.instagram.map((i) => (
          <a key={i.url} className="btn btn-gold" href={i.url} target="_blank" rel="noreferrer">
            Instagram — {i.label}
          </a>
        ))}
        <a className="btn btn-ghost-navy" target="_blank" rel="noreferrer" href={wa(ACADEMY.contacts[0].tel, enquiry)}>
          WhatsApp for Enquiry
        </a>
      </div>
    </section>
  );
}

function FeesPayment() {
  const payMsg = `Hello, I would like to pay my monthly training fee at ${ACADEMY.name}. Please share payment details.`;
  return (
    <section id="fees" className="section navy">
      <h2>Fees &amp; Payment</h2>
      <div className="fees">
        <div><span>Monthly Training Fee</span><strong>{ACADEMY.fee}</strong></div>
        <div><span>Batch Timing</span><strong>{ACADEMY.timing}</strong></div>
      </div>
      <p className="sub" style={{ color: "#dbe6ff" }}>
        Online card/UPI payment (Razorpay) will be added once the academy's payment account is
        set up. Until then, pay by cash or UPI directly and let the academy know so it can be
        recorded. Payments are confirmed manually by the academy — nothing is marked Paid
        automatically.
      </p>
      <div className="row">
        <a className="btn btn-gold" target="_blank" rel="noreferrer" href={wa(ACADEMY.contacts[0].tel, payMsg)}>
          Ask About Payment on WhatsApp
        </a>
      </div>
    </section>
  );
}

export default function Home() {
  const enquiry = `Hello, I would like to enquire about training at ${ACADEMY.name}.`;
  return (
    <>
      <section id="home" className="hero">
        <div className="hero-text">
          <p className="kicker">{ACADEMY.city}, Maharashtra</p>
          <h1>{ACADEMY.tagline}</h1>
          <p className="lead">
            {ACADEMY.fullName} trains young people for Army, Navy, Air Force, Police and
            Territorial Army recruitment, with a strong focus on physical fitness and discipline.
          </p>
          <div className="row">
            <a className="btn btn-gold" href="#admission">Join Now</a>
            <a className="btn btn-ghost-dark" href="#admission">Register</a>
            <a className="btn btn-ghost-dark" href="#contact">Contact Us</a>
          </div>
        </div>
        <img className="hero-logo" src="/logo.jpg" alt="S.P. Sports Foundation emblem" />
      </section>

      <About />
      <Training />
      <OnlineStudy />
      <Admission />
      <Updates />
      <Gallery />
      <FollowUs />
      <FeesPayment />
      <Contact />
    </>
  );
}
