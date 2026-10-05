import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase, supabaseReady } from "../supabaseClient.js";
import { ACADEMY, PROGRAMS, wa } from "../data.js";

const emptyForm = (courseFromUrl) => ({
  fullName: "",
  mobile: "",
  email: "",
  dob: "",
  age: "",
  gender: "Boy",
  address: "",
  course: courseFromUrl || PROGRAMS[0].title,
  parentName: "",
  parentContact: "",
  message: "",
});

export default function Admission() {
  const [params] = useSearchParams();
  const [f, setF] = useState(emptyForm(params.get("course")));
  const [status, setStatus] = useState("idle"); // idle | sending | done
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    // Best-effort: save the registration to the database so the admin can
    // manage attendance and fees. If the database isn't connected yet, or
    // this fails for any reason, registration still continues via WhatsApp
    // below — nothing here blocks the student.
    if (supabaseReady) {
      try {
        await supabase.from("students").insert({
          full_name: f.fullName,
          mobile: f.mobile,
          email: f.email || null,
          dob: f.dob || null,
          age: f.age ? Number(f.age) : null,
          gender: f.gender,
          address: f.address,
          course: f.course,
          parent_name: f.parentName,
          parent_contact: f.parentContact,
        });
      } catch {
        // Ignored on purpose — WhatsApp registration below always works.
      }
    }

    const text = [
      `New registration enquiry for ${ACADEMY.name}`,
      `Name: ${f.fullName}`,
      `Mobile: ${f.mobile}`,
      f.email && `Email: ${f.email}`,
      f.dob && `Date of Birth: ${f.dob}`,
      `Age: ${f.age}`,
      `Gender: ${f.gender}`,
      `Address: ${f.address}`,
      `Course: ${f.course}`,
      `Parent/Guardian: ${f.parentName}`,
      `Parent/Guardian Contact: ${f.parentContact}`,
      f.message && `Message: ${f.message}`,
    ].filter(Boolean).join("\n");

    window.open(wa(ACADEMY.contacts[0].tel, text), "_blank", "noopener");
    setStatus("done");
  };

  if (status === "done") {
    return (
      <section className="section" id="admission">
        <h2>Registration Sent</h2>
        <div className="note">
          <p>Your registration has been sent to the academy on WhatsApp. If WhatsApp didn't open
          automatically, please message the academy directly to confirm your spot.</p>
        </div>
        <button className="btn btn-gold" onClick={() => { setF(emptyForm()); setStatus("idle"); }}>
          Register Another Student
        </button>
      </section>
    );
  }

  return (
    <section className="section" id="admission">
      <h2>Admission / Registration</h2>
      <p className="sub">Fill in the details below. Submitting opens WhatsApp with your registration ready to send.</p>
      <form className="form" onSubmit={submit}>
        <label>Full Name
          <input required value={f.fullName} onChange={set("fullName")} />
        </label>
        <label>Mobile Number
          <input required type="tel" pattern="[0-9+ ]{10,15}" value={f.mobile} onChange={set("mobile")} />
        </label>
        <label>Email Address (optional)
          <input type="email" value={f.email} onChange={set("email")} />
        </label>
        <label>Date of Birth
          <input type="date" value={f.dob} onChange={set("dob")} />
        </label>
        <label>Age
          <input required type="number" min="8" max="60" value={f.age} onChange={set("age")} />
        </label>
        <label>Gender
          <select value={f.gender} onChange={set("gender")}>
            <option>Boy</option>
            <option>Girl</option>
          </select>
        </label>
        <label className="full">Address
          <input value={f.address} onChange={set("address")} />
        </label>
        <label>Course / Training Program
          <select value={f.course} onChange={set("course")}>
            {PROGRAMS.map((p) => <option key={p.title}>{p.title}</option>)}
          </select>
        </label>
        <label>Parent / Guardian Name
          <input value={f.parentName} onChange={set("parentName")} />
        </label>
        <label>Parent / Guardian Contact Number
          <input type="tel" value={f.parentContact} onChange={set("parentContact")} />
        </label>
        <label className="full">Message (optional)
          <textarea rows="2" value={f.message} onChange={set("message")} />
        </label>
        <button className="btn btn-gold full" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Opening WhatsApp..." : "Submit Registration"}
        </button>
      </form>
    </section>
  );
}
