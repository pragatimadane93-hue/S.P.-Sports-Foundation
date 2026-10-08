import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase, supabaseReady, mobileToEmail, normalizeMobile } from "../supabaseClient.js";
import { ACADEMY, PROGRAMS, wa } from "../data.js";
import { usePrograms } from "../usePrograms.js";

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
  password: "",
});

const DUPLICATE_MSG =
  "This mobile number is already registered. Please use Student Login instead.";

// Turn technical errors into clear messages for the student.
function friendlyError(err) {
  const msg = String(err?.message || "");
  const code = String(err?.code || "");
  if (msg === "DUPLICATE" || code === "user_already_exists" || /already registered/i.test(msg)) {
    return DUPLICATE_MSG;
  }
  if (code === "23505" || /duplicate key|students_mobile/i.test(msg)) return DUPLICATE_MSG;
  if (/database error saving new user/i.test(msg)) {
    return "Registration could not be completed. This mobile number may already be registered, or some details are invalid. Please check and try again.";
  }
  if (msg === "NO_SESSION") {
    return "Your registration was received, but the login system needs a setting changed (email confirmation must be OFF). Please contact the academy.";
  }
  if (/password/i.test(msg)) return msg;
  if (/failed to fetch|network/i.test(msg)) return "Network problem. Please check your internet connection and try again.";
  return msg || "Something went wrong. Please try again.";
}

export default function Admission() {
  const [params] = useSearchParams();
  const { programs } = usePrograms();
  const [f, setF] = useState(emptyForm(params.get("course")));
  const courseParam = params.get("course");

  // "Join This Program" opens this section with ?course=<program>; select it in the form.
  useEffect(() => {
    if (courseParam) setF((prev) => ({ ...prev, course: courseParam }));
  }, [courseParam]);
  const [status, setStatus] = useState("idle"); // idle | saving | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const [student, setStudent] = useState(null); // the row read back FROM SUPABASE
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const mobile = normalizeMobile(f.mobile);
    if (!/^[0-9]{10}$/.test(mobile)) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      setStatus("error");
      return;
    }

    // Database not connected: the form still works and sends the registration on WhatsApp.
    if (!supabaseReady) {
      const text = [
        `New registration enquiry for ${ACADEMY.name}`,
        `Name: ${f.fullName.trim()}`,
        `Mobile: ${mobile}`,
        f.email.trim() && `Email: ${f.email.trim()}`,
        f.dob && `Date of Birth: ${f.dob}`,
        `Age: ${f.age}`,
        `Gender: ${f.gender}`,
        f.address.trim() && `Address: ${f.address.trim()}`,
        `Course: ${f.course}`,
        f.parentName.trim() && `Parent/Guardian: ${f.parentName.trim()}`,
        f.parentContact.trim() && `Parent/Guardian Contact: ${f.parentContact.trim()}`,
      ].filter(Boolean).join("\n");
      window.open(wa(ACADEMY.contacts[0].tel, text), "_blank", "noopener");
      setStatus("whatsapp");
      return;
    }

    setStatus("saving");
    const details = {
      full_name: f.fullName.trim(),
      mobile,
      email: f.email.trim() || null,
      dob: f.dob || null,
      age: f.age ? Number(f.age) : null,
      gender: f.gender,
      address: f.address.trim() || null,
      course: f.course,
      parent_name: f.parentName.trim() || null,
      parent_contact: f.parentContact.trim() || null,
    };

    try {
      // Step 1: create the student's login. The details are also sent along so the
      // database can create the student record in the same step (see
      // supabase-schema-registration-v2.sql). If either part fails, nothing is saved.
      const { data: signUp, error: signUpErr } = await supabase.auth.signUp({
        email: mobileToEmail(mobile),
        password: f.password,
        options: { data: details },
      });
      if (signUpErr) throw signUpErr;

      const user = signUp.user;
      // With "email enumeration protection" Supabase returns a fake user (no identities)
      // when the email already exists.
      if (!user || (user.identities && user.identities.length === 0)) throw new Error("DUPLICATE");
      if (!signUp.session) throw new Error("NO_SESSION");

      // Step 2: read the saved record back FROM SUPABASE (RLS: a student can only
      // read their own row). This is what we show on the success screen.
      let { data: row, error: readErr } = await supabase
        .from("students")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();
      if (readErr) throw readErr;

      // Fallback for projects where the registration trigger hasn't been installed yet:
      // insert the record from here (same table, same RLS rule "students insert self").
      if (!row) {
        const { data: inserted, error: insertErr } = await supabase
          .from("students")
          .insert({ auth_user_id: user.id, ...details })
          .select("*")
          .single();
        if (insertErr) throw insertErr;
        row = inserted;
      }

      // Don't leave the new student logged in on a shared device — they log in next.
      await supabase.auth.signOut();

      setStudent(row);
      setF(emptyForm(params.get("course"))); // clears the password from memory too
      setStatus("done");
      document.getElementById("admission")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      await supabase.auth.signOut().catch(() => {});
      setErrorMsg(friendlyError(err));
      setStatus("error");
    }
  };

  if (status === "whatsapp") {
    return (
      <section className="section" id="admission">
        <h2>Registration Sent</h2>
        <div className="note">
          <p>Your registration has been opened in WhatsApp. Please press <strong>Send</strong> there to
          complete it. If WhatsApp did not open, message the academy directly.</p>
        </div>
        <div className="row">
          <button className="btn btn-gold" onClick={() => { setF(emptyForm(params.get("course"))); setStatus("idle"); }}>
            Register Another Student
          </button>
        </div>
      </section>
    );
  }

  if (status === "done" && student) {
    const rows = [
      ["Student ID", student.student_id],
      ["Student Name", student.full_name],
      ["Mobile Number", student.mobile],
      ...(student.email ? [["Email", student.email]] : []),
      ["Course", student.course],
      ["Age", student.age],
      ["Gender", student.gender],
      ["Registration Date", student.registration_date],
      ["Status", student.status],
      ["Monthly Fee", `${ACADEMY.fee} (${student.fee_status})`],
    ];
    return (
      <section className="section" id="admission">
        <h2>Registration Successful</h2>
        <p className="sub">Your registration has been saved. Please note your details below.</p>
        <ul className="points">
          {rows.map(([label, value]) => (
            <li key={label}><strong>{label}:</strong> {value}</li>
          ))}
        </ul>
        <p className="sub" style={{ marginTop: 16 }}>
          Log in with your <strong>Mobile Number</strong> and the password you created. Your status
          stays <strong>Pending</strong> until the academy approves it.
        </p>
        <div className="row">
          <Link className="btn btn-gold" to="/student-login">Go to Student Login</Link>
          <button className="btn btn-ghost" onClick={() => { setStudent(null); setStatus("idle"); }}>
            Register Another Student
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="admission">
      <h2>Admission / Registration</h2>
      <p className="sub">
        {supabaseReady
          ? "Fields marked required must be filled. You'll get a Student ID and can log in right after."
          : "Fill in the details below. Submitting opens WhatsApp with your registration ready to send."}
      </p>
      <form className="form" onSubmit={submit}>
        <label>Full Name
          <input required value={f.fullName} onChange={set("fullName")} />
        </label>
        <label>Mobile Number
          <input required type="tel" inputMode="numeric" placeholder="10-digit mobile number" value={f.mobile} onChange={set("mobile")} />
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
            {programs.map((p) => <option key={p.title}>{p.title}</option>)}
            {!programs.some((p) => p.title === f.course) && <option>{f.course}</option>}
          </select>
        </label>
        <label>Parent / Guardian Name
          <input value={f.parentName} onChange={set("parentName")} />
        </label>
        <label>Parent / Guardian Contact Number
          <input type="tel" value={f.parentContact} onChange={set("parentContact")} />
        </label>
        {supabaseReady && (
          <label className="full">Create a Password (for Student Login)
            <input required type="password" minLength={6} value={f.password} onChange={set("password")} />
          </label>
        )}
        {status === "error" && <p className="full note" role="alert">{errorMsg}</p>}
        <button className="btn btn-gold full" type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </section>
  );
}
