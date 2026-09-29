import { useState } from "react";
import { ACADEMY, wa, MAPS, MAP_EMBED } from "../data.js";

function ContactForm() {
  const [f, setF] = useState({ name: "", mobile: "", message: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const text = `Contact form message\nName: ${f.name}\nMobile: ${f.mobile}\nMessage: ${f.message}`;
    window.open(wa(ACADEMY.contacts[0].tel, text), "_blank", "noopener");
  };
  return (
    <form className="form" onSubmit={submit}>
      <label>Name
        <input required value={f.name} onChange={set("name")} />
      </label>
      <label>Mobile Number
        <input required type="tel" value={f.mobile} onChange={set("mobile")} />
      </label>
      <label className="full">Message
        <textarea required rows="3" value={f.message} onChange={set("message")} />
      </label>
      <button className="btn btn-gold full" type="submit">Send on WhatsApp</button>
    </form>
  );
}

export default function Contact() {
  const enquiry = `Hello, I would like to enquire about training at ${ACADEMY.name}.`;
  return (
    <section className="section">
      <h2>Contact Us</h2>
      <div className="contacts">
        {ACADEMY.contacts.map((c) => (
          <div className="card" key={c.tel}>
            <h3>{c.name}</h3>
            <p>{c.display}</p>
            <div className="row">
              <a className="btn btn-gold small" href={`tel:+${c.tel}`}>Call Now</a>
              <a className="btn btn-ghost small" target="_blank" rel="noreferrer" href={wa(c.tel, enquiry)}>WhatsApp</a>
            </div>
          </div>
        ))}
      </div>
      <p className="addr"><strong>Address:</strong> {ACADEMY.address}</p>
      <div className="row">
        {ACADEMY.instagram.map((i) => (
          <a key={i.url} className="btn btn-ghost" href={i.url} target="_blank" rel="noreferrer">
            Instagram — {i.label}
          </a>
        ))}
        <a className="btn btn-ghost" href={MAPS} target="_blank" rel="noreferrer">Get Directions</a>
      </div>
      <iframe className="map" title="S.P. Sports Foundation location on Google Maps" src={MAP_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      <h3 className="form-title">Send a Message</h3>
      <ContactForm />
    </section>
  );
}
